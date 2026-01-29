const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { processExcel } = require('../services/uploadService');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/upload
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const result = processExcel(req.file.path);
        // Clean up file after processing if needed, or keep it for the run step
        // For now, we return the preview and keep the file path in response for the frontend to send back on run?
        // Or better, we should probably save the "Upload Session" in DB. 
        // For MVP, we pass back the file path or ID.
        res.json({ ...result, distinctId: req.file.filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing file' });
    }
});

const { sendToN8N } = require('../services/n8nService');
const path = require('path');
const xlsx = require('xlsx');

const { addLog } = require('../services/logStore');
const { sendEmail } = require('../services/emailService');
const { db } = require('../config/firebaseConfig');
const admin = require('firebase-admin');

// POST /api/run-workflow
router.post('/run-workflow', verifyToken, async (req, res) => {
    const { workflowType, channels, distinctId, mapping, tone } = req.body;

    if (!distinctId) return res.status(400).json({ message: 'Missing file ID' });

    try {
        const filePath = path.join(__dirname, '..', 'uploads', distinctId);

        // 1. Read File
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const startedAt = new Date().toISOString();
        let sentCount = 0;
        let failedCount = 0;

        // 2. Process Records 
        const processedRecords = data.map(record => {
            const name = record[mapping?.Name || 'Name'] || 'User';
            const balance = record[mapping?.Balance || 'Balance'] || '0';
            const email = record[mapping?.Email || 'Email'];

            let message = '';
            let subject = '';
            if (workflowType === 'Fees') {
                subject = 'Action Required: Fee Payment Reminder';
                message = `Hello ${name}, this is a ${tone} reminder to pay your balance of ${balance}.`;
            } else {
                subject = `Update regarding ${workflowType}`;
                message = `Hello ${name}, regarding ${workflowType}.`;
            }

            return {
                ...record,
                generatedMessage: message,
                generatedSubject: subject,
                userEmail: email,
                tone
            };
        });

        // 3. Create Workflow Run Document
        let runRef, runId, batch;
        let useFirestore = true;

        try {
            runRef = db.collection('workflowRuns').doc();
            runId = runRef.id;
            batch = db.batch(); // Firestore batch for logs
        } catch (error) {
            console.warn('[Workflow] Firestore unavailable, using fallback mode:', error.message);
            useFirestore = false;
            runId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        // 4. Send Emails & Log

        for (const [index, record] of processedRecords.entries()) {
            let status = 'Pending';
            let error = '';

            if (channels?.email && record.userEmail) {
                console.log(`Processing ${record.userEmail}...`);
                const result = await sendEmail(record.userEmail, record.generatedSubject, record.generatedMessage);

                if (result.success) {
                    sentCount++;
                    status = 'Sent';
                } else {
                    failedCount++;
                    status = 'Failed';
                    error = result.error || 'Unknown error';
                }
            } else {
                status = 'Skipped'; // No channel or email
            }

            // Create Log Entry
            if (useFirestore) {
                try {
                    const logRef = db.collection('messageLogs').doc();
                    batch.set(logRef, {
                        runId: runId,
                        workflowType: workflowType,  // Added this line
                        name: record[mapping?.Name || 'Name'] || 'User',
                        email: record.userEmail || '',
                        channel: 'Email',
                        messageContent: record.generatedMessage,
                        deliveryStatus: status,
                        errorMessage: error,
                        timestamp: admin.firestore.Timestamp.now()
                    });
                } catch (err) {
                    console.warn('[Workflow] Failed to add log to batch:', err.message);
                }
            } else {
                console.log(`[Local Log] ${status} - ${record.userEmail}: ${record.generatedMessage}`);
            }

            // Keep adding to batch, commit every 500 ops (simplified here for MVP, assuming < 500 rows)
        }

        if (useFirestore) {
            try {
                await batch.commit();
            } catch (err) {
                console.warn('[Workflow] Failed to commit batch:', err.message);
            }
        }

        // 5. Generate AI Summary (Mocked logic for now)
        const successRate = ((sentCount / processedRecords.length) * 100).toFixed(1);
        const summaryText = `Out of ${processedRecords.length} records, ${sentCount} messages were sent successfully. ${failedCount} failed. Overall success rate: ${successRate}%.`;

        // 6. Update Workflow Run with final stats
        if (useFirestore) {
            try {
                await runRef.set({
                    workflowType,
                    totalRecords: processedRecords.length,
                    messagesSent: sentCount,
                    failedMessages: failedCount,
                    channelsUsed: Object.keys(channels || {}).filter(k => channels[k]),
                    startedAt: admin.firestore.Timestamp.fromDate(new Date(startedAt)),
                    completedAt: admin.firestore.Timestamp.now(),
                    status: failedCount === 0 ? 'Success' : (sentCount > 0 ? 'Partial' : 'Failed'),
                    summaryText: summaryText
                });
            } catch (err) {
                console.warn('[Workflow] Failed to save workflow run:', err.message);
            }
        } else {
            console.log(`[Local Summary] ${summaryText}`);
        }

        console.log(`Workflow ${workflowType} complete. Sent: ${sentCount}`);

        res.json({ message: 'Workflow completed', runId: runId, count: processedRecords.length, sent: sentCount });

    } catch (error) {
        console.error('CRITICAL: Workflow run error:', error);

        let clientMessage = 'Failed to run workflow';
        if (error.code === 'ENOENT') {
            clientMessage = `Internal Error: Uploaded file not found on server. (ID: ${distinctId})`;
        } else if (error.code === 7 || error.message.includes('permission-denied')) {
            clientMessage = 'Firestore Permission Denied. Check Service Account permissions.';
        } else if (error.message) {
            clientMessage = `Workflow Error: ${error.message}`;
        }

        res.status(500).json({
            message: clientMessage,
            details: error.stack // Include stack in dev/internal for better debugging
        });
    }
});

module.exports = router;
