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
const templateRenderer = require('../utils/templateRenderer');
const { db } = require('../config/firebaseConfig');
const admin = require('firebase-admin');
const { generateEmailContent } = require('../services/aiService');
const aiLogger = require('../services/aiLogger');
const { applySmartRules } = require('../services/aiRulesEngine');

// POST /api/run-workflow
router.post('/run-workflow', verifyToken, async (req, res) => {
    const { workflowType, channels, distinctId, mapping, tone, smartRulesEnabled } = req.body;

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

        // 2. Process Records with AI-generated content
        const processedRecords = [];
        for (const record of data) {
            const name = record[mapping?.Name || 'Name'] || 'User';
            const balance = record[mapping?.Balance || 'Balance'] || '0';
            const email = record[mapping?.Email || 'Email'];
            let currentTone = tone;
            
            aiLogger.logSystem(`Processing record for ${name}...`);

            // Apply Smart AI Rules
            const ruleContext = {
                tone,
                balance,
                workflowType,
                smartRulesEnabled,
                // Passing other typical standard mapped fields for rule engine checking
                dueDate: record[mapping?.DueDate || 'DueDate'] || null
            };
            const adjustedRules = applySmartRules(ruleContext);
            currentTone = adjustedRules.tone;
            
            if (adjustedRules.appliedRules.length > 0) {
                aiLogger.log('SMART RULES', `Applied adjustments: ${adjustedRules.appliedRules.join(', ')}`);
            }

            let generatedSubject = null;
            let generatedMessage = null;
            let generationStatus = 'Pending';
            let generationError = null;

            // Generate Content (Try AI first, Fallback to Template)
            if (process.env.GEMINI_API_KEY) {
                aiLogger.logAIStart(workflowType, currentTone, name);
                aiLogger.logAIRequest();

                try {
                    const aiContext = {
                        recipientName: name,
                        workflowType,
                        tone: currentTone,
                        balance: balance, // legacy support
                        feeAmount: balance, 
                        organizationName: record[mapping?.OrganizationName || 'OrganizationName'],
                        eventName: record[mapping?.EventName || 'EventName'],
                        eventDate: record[mapping?.EventDate || 'EventDate'],
                        eventTime: record[mapping?.EventTime || 'EventTime'],
                        eventLocation: record[mapping?.EventLocation || 'EventLocation'],
                        dueDate: record[mapping?.DueDate || 'DueDate'],
                        taskName: record[mapping?.TaskName || 'TaskName'],
                        taskDeadline: record[mapping?.TaskDeadline || 'TaskDeadline'],
                    };

                    const aiResult = await generateEmailContent(aiContext);
                    generatedSubject = aiResult.subject;
                    generatedMessage = aiResult.body;
                    aiLogger.logAIResponse();

                } catch (error) {
                    aiLogger.logError('AI ERROR', `Failed: ${error.message}`);
                    aiLogger.logFallback();
                    generationError = `AI Generation Failed: ${error.message}`;
                }
            } else {
                aiLogger.logFallback('No AI Key. Using template engine.');
            }

            // Fallback Generation via Handlebars Template
            if (!generatedMessage || !generatedSubject) {
                try {
                    const isOverdue = parseInt(balance.toString().replace(/[^0-9.-]+/g, '')) > 1000 || currentTone.toLowerCase().includes('urgent');
                    const templateResult = templateRenderer.render('feeReminder', {
                        name,
                        balance,
                        isOverdue,
                        workflowType,
                        description: 'Outstanding workflow notification'
                    });
                    generatedSubject = templateResult.subject;
                    generatedMessage = templateResult.html;
                } catch (error) {
                    generationError = `Fallback Template Failed: ${error.message}`;
                    generationStatus = 'Failed';
                }
            }

            processedRecords.push({
                ...record,
                generatedMessage,
                generatedSubject,
                userEmail: email,
                tone: currentTone,
                status: generationStatus,
                error: generationError
            });
        }

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
            let status = record.status || 'Pending';
            let error = record.error || '';

            // If AI/Template generation failed, skip sending
            if (status === 'Failed') {
                failedCount++;
            } else if (channels?.email && record.userEmail) {
                aiLogger.logEmailStart(record.userEmail);
                const result = await sendEmail({
                    to: record.userEmail,
                    subject: record.generatedSubject,
                    html: record.generatedMessage
                });

                if (result.success) {
                    sentCount++;
                    status = 'Sent';
                    aiLogger.logEmailSuccess(record.userEmail);
                } else {
                    failedCount++;
                    status = 'Failed';
                    error = result.error || 'Unknown error';
                    aiLogger.logEmailFail(record.userEmail, error);
                }
            } else {
                status = 'Skipped'; // No channel or email
                aiLogger.logSystem(`Skipping delivery for ${record.userEmail || record[mapping?.Name || 'Name'] || 'User'} (No valid channel)`);
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
