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
        let serviceAccount;

        // 1. Try to parse from Environment Variable directly (as JSON string)
        const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        console.log(`Firebase: Checking FIREBASE_SERVICE_ACCOUNT_KEY env var (Length: ${envKey ? envKey.length : 0})`);

        if (envKey) {
            try {
                // If it starts with '{', it's likely a JSON string
                if (envKey.trim().startsWith('{')) {
                    serviceAccount = JSON.parse(envKey);
                    console.log('Firebase: Successfully parsed JSON key from environment variable');
                }
            } catch (e) {
                console.warn('Firebase: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY as JSON:', e.message);
            }
        }

        // 2. Try to load from file path if not already loaded from env
        if (!serviceAccount) {
            if (fs.existsSync(absolutePath)) {
                serviceAccount = require(absolutePath);
                console.log('Firebase: Using key from file:', absolutePath);
            }
        }

        // 3. Initialize if we have a service account
        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('Firebase Admin Initialized Successfully');
            db = admin.firestore();
            auth = admin.auth();
        } else {
            console.warn('Warning: No Firebase Service Account found (JSON or file). Falling back to Mocks.');

            // In-Memory Store
            const store = {
                workflowRuns: [],
                messageLogs: []
            };

            const createMockDoc = (collectionName, id, data) => {
                if (!store[collectionName]) store[collectionName] = [];
                const existing = store[collectionName].find(d => d.id === id);
                if (existing) {
                    Object.assign(existing, data);
                } else {
                    store[collectionName].push({ id, ...data });
                }
            };

            const mockCollection = (name) => ({
                doc: (id) => {
                    const docId = id || `mock_doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    return {
                        id: docId,
                        get: async () => {
                            const item = store[name]?.find(d => d.id === docId);
                            return { exists: !!item, data: () => item || {} };
                        },
                        set: async (data) => {
                            console.log(`[MockDB] Set ${name}/${docId}:`, data);
                            createMockDoc(name, docId, data);
                        },
                        update: async (data) => {
                            console.log(`[MockDB] Update ${name}/${docId}:`, data);
                            createMockDoc(name, docId, data);
                        }
                    };
                },
                get: async () => {
                    // Simple get all
                    const items = store[name] || [];
                    return {
                        size: items.length,
                        empty: items.length === 0,
                        docs: items.map(item => ({
                            id: item.id,
                            data: () => item
                        })),
                        forEach: (cb) => items.forEach(item => cb({ data: () => item, id: item.id }))
                    };
                },
                limit: (n) => mockCollection(name),
                orderBy: (f, d) => mockCollection(name),
                where: (f, o, v) => mockCollection(name),
                offset: (n) => mockCollection(name),
                count: () => ({ get: async () => ({ data: () => ({ count: store[name]?.length || 0 }) }) })
            });

            db = {
                collection: mockCollection,
                batch: () => ({
                    set: (docRef, data) => docRef.set(data),
                    update: (docRef, data) => docRef.update(data),
                    commit: async () => console.log('[MockDB] Batch committed')
                })
            };

            // Mock Auth
            auth = {
                verifyIdToken: async (token) => {
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

// Final assignments to ensure exports are correct
db = db || null;
auth = auth || null;

module.exports = { admin, db, auth };
