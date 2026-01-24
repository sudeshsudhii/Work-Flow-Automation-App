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

// POST /api/run-workflow
router.post('/run-workflow', verifyToken, async (req, res) => {
    const { workflowType, config, distinctId, mapping, tone } = req.body;

    if (!distinctId) return res.status(400).json({ message: 'Missing file ID' });

    try {
        const filePath = path.join(__dirname, '..', 'uploads', distinctId);

        // 1. Read File
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

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

        // 3. Send to n8n (Parallel / Optional)
        // const payload = { ... };
        // sendToN8N(payload).catch(err => console.error("n8n Error", err));

        // 4. Send Emails & Log
        let sentCount = 0;

        // We process sequentially or in parallel batches. For demo, sequentially.
        for (const [index, record] of processedRecords.entries()) {
            if (!config.channels.email || !record.userEmail) continue;

            // Only attempt real send for first 5 to avoid spam during demo, or all if configured
            // logic: if index < 50

            console.log(`Processing ${record.userEmail}...`);
            const result = await sendEmail(record.userEmail, record.generatedSubject, record.generatedMessage);

            const logEntry = {
                id: `run_${Date.now()}_${index}`,
                workflow: workflowType,
                name: record[mapping?.Name || 'Name'] || 'User',
                channel: 'Email',
                status: result.success ? (result.simulated ? 'Simulated' : 'Sent') : 'Failed',
                time: new Date().toLocaleString()
            };

            addLog(logEntry);
            if (result.success) sentCount++;
        }

        console.log(`Workflow ${workflowType} complete. Sent: ${sentCount}`);

        res.json({ message: 'Workflow completed', runId: Date.now(), count: processedRecords.length, sent: sentCount });

    } catch (error) {
        console.error('Workflow run error:', error);
        res.status(500).json({ message: 'Failed to run workflow' });
    }
});

module.exports = router;
