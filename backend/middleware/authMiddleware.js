const { auth } = require('../config/firebaseConfig');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Accept demo token only in mock/fallback mode
    if (token === 'demo-token-valid-2024') {
        // Check if we're using real Firebase auth
        if (auth && auth.verifyIdToken && auth.constructor && auth.constructor.name !== 'Object') {
            // Real Firebase is active — reject demo tokens
            return res.status(403).json({ message: 'Demo mode not available with real Firebase. Use proper credentials.' });
        }
        // Mock mode — allow demo token
        req.user = {
            uid: 'demo-123',
            email: 'demo@autoflow.app',
            name: 'Demo User',
        };
        return next();
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(403).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = verifyToken;
