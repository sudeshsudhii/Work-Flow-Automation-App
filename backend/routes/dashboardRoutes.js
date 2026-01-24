const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseConfig');
const verifyToken = require('../middleware/authMiddleware');

router.get('/metrics', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('workflowRuns').get();
        let totalRuns = snapshot.size;
        let totalSent = 0;
        let totalFailed = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            totalSent += data.messagesSent || 0;
            totalFailed += data.failedMessages || 0;
        });

        res.json({ totalRuns, totalSent, totalFailed });
    } catch (error) {
        console.error('Dashboard Metrics Error:', error);
        res.status(500).json({ error: 'Failed to fetch metrics', details: error.message });
    }
});

router.get('/weekly-activity', verifyToken, async (req, res) => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));

        // Note: Complex date query requires compound index in Firestore
        // For simple MVP we fetch all and filter in memory if small, or limit 100
        const snapshot = await db.collection('workflowRuns').limit(50).get();

        const activity = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            let date;

            // Handle Timestamp format
            if (data.startedAt && data.startedAt.toDate) {
                date = data.startedAt.toDate().toLocaleDateString('en-US', { weekday: 'short' });
            } else {
                date = 'Unknown';
            }

            if (!activity[date]) activity[date] = { name: date, sent: 0, failed: 0 };
            activity[date].sent += data.messagesSent || 0;
            activity[date].failed += data.failedMessages || 0;
        });

        res.json(Object.values(activity));
    } catch (error) {
        console.error('Dashboard Weekly Activity Error:', error);
        res.status(500).json({ error: 'Failed to fetch weekly activity', details: error.message });
    }
});

router.get('/delivery-status', verifyToken, async (req, res) => {
    try {
        // Aggregate totals again (or could query messageLogs directly for more granularity)
        const snapshot = await db.collection('workflowRuns').get();
        let sent = 0;
        let failed = 0;
        let partial = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            sent += data.messagesSent || 0;
            failed += data.failedMessages || 0;
        });

        res.json([
            { name: 'Sent', value: sent },
            { name: 'Failed', value: failed },
        ]);
    } catch (error) {
        console.error('Dashboard Delivery Status Error:', error);
        res.status(500).json({ error: 'Failed to fetch delivery status', details: error.message });
    }
});

router.get('/ai-summary', verifyToken, async (req, res) => {
    try {
        // Get latest run
        const snapshot = await db.collection('workflowRuns').orderBy('completedAt', 'desc').limit(1).get();
        if (snapshot.empty) return res.json(null);

        const data = snapshot.docs[0].data();
        res.json({
            summaryText: data.summaryText || 'No summary available.',
            workflowType: data.workflowType,
            timestamp: data.completedAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

module.exports = router;
