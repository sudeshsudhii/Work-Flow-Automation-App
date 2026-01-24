const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || './serviceAccountKey.json';
const absolutePath = path.resolve(__dirname, '..', serviceAccountPath);

// Initialize Firebase only if not already initialized
let db, auth;

if (!admin.apps.length) {
    try {
        if (fs.existsSync(absolutePath)) {
            const serviceAccount = require(absolutePath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('Firebase Admin Initialized');
            db = admin.firestore();
            auth = admin.auth();
        } else {
            console.warn('Warning: serviceAccountKey.json not found. Using MOCK Firebase services.');

            // Mock DB
            db = {
                collection: (name) => ({
                    doc: (id) => ({
                        get: async () => ({ exists: false, data: () => ({ role: 'Admin' }) }),
                        set: async (data) => console.log(`[MockDB] Set ${name}/${id}:`, data),
                        update: async (data) => console.log(`[MockDB] Update ${name}/${id}:`, data),
                    })
                })
            };

            // Mock Auth
            auth = {
                verifyIdToken: async (token) => {
                    console.log('[MockAuth] Verifying token:', token ? 'Token exists' : 'No token');
                    // Return a dummy user for any token
                    return {
                        uid: 'mock-user-123',
                        email: 'demo@example.com',
                        name: 'Demo User',
                        picture: 'https://via.placeholder.com/150'
                    };
                }
            };
        }
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
    }
} else {
    db = admin.firestore();
    auth = admin.auth();
}

module.exports = { admin, db, auth };
