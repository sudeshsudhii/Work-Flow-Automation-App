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
app.use(cors());
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
        timestamp: new Date().toISOString()
    });
});

// Use Routes
app.use('/api', workflowRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
