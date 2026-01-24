const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getLogs } = require('../services/logStore');

router.get('/', verifyToken, (req, res) => {
    // In a real app, fetch from Firestore
    // const snapshot = await db.collection('logs').orderBy('createdAt', 'desc').limit(50).get();
    // const logs = snapshot.docs.map(doc => doc.data());

    res.json(getLogs());
});

module.exports = router;
