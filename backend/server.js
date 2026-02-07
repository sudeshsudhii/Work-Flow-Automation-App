require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Routes will be imported here
const workflowRoutes = require('./routes/workflowRoutes');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://work-flow-automation-app.vercel.app'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check
app.get('/', (req, res) => {
    res.send('Intelligent Workflow Automation Platform API is Running');
});

// Detailed Health Check
const { admin, db, auth } = require('./config/firebaseConfig');
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Online',
        firebaseReal: admin.apps.length > 0,
        dbDefined: !!db,
        authDefined: !!auth,
        dbType: db?.constructor?.name || typeof db,
        envKeyPresent: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        envKeyLength: process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.length || 0,
        geminiConfigured: !!process.env.GEMINI_API_KEY,
        timestamp: new Date().toISOString()
    });
});

// AI Test Endpoint
const { testAIConnection, generateEmailContent } = require('./services/aiService');
app.get('/api/test-ai', async (req, res) => {
    const connectionTest = await testAIConnection();
    if (!connectionTest.success) {
        return res.json({ success: false, error: connectionTest.error, hint: 'Add GEMINI_API_KEY to your .env file' });
    }

    // Generate a sample email
    const sample = await generateEmailContent({
        recipientName: 'Test User',
        workflowType: 'Fees',
        balance: '$500',
        tone: 'friendly'
    });

    res.json({ success: true, sampleEmail: sample });
});

// Use Routes
app.use('/api', workflowRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
