const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseConfig');
const verifyToken = require('../middleware/authMiddleware');

router.post('/login', verifyToken, async (req, res) => {
    const { uid, name, email, picture } = req.user;

    try {
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            await userRef.set({
                name,
                email,
                role: 'Viewer', // Default role
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
        } else {
            await userRef.update({
                lastLogin: new Date().toISOString()
            });
        }

        const userData = (await userRef.get()).data();
        res.json({ message: 'User authenticated', user: userData });
    } catch (error) {
        console.error('CRITICAL: Auth Login error:', error);
        res.status(500).json({
            message: 'Auth server error',
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;
