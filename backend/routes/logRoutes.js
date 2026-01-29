const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { db } = require('../config/firebaseConfig');

router.get('/', verifyToken, async (req, res) => {
    try {
        // Fetch real logs from Firestore
        const snapshot = await db.collection('messageLogs')
            .orderBy('timestamp', 'desc')
            .limit(100)
            .get();

        const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: data.runId || doc.id,
                workflow: data.workflowType || 'Unknown',
                name: data.name || data.email || 'Unknown',
                channel: data.channel || 'Email',
                status: data.deliveryStatus || 'Unknown',
                time: data.timestamp?.toDate?.()?.toLocaleString() || new Date().toLocaleString()
            };
        });

        res.json(logs);
    } catch (error) {
        console.error('[Logs API] Error fetching logs:', error.message);

        // Fallback to empty array if Firestore fails
        res.json([]);
    }
});

module.exports = router;
