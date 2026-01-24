require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Routes will be imported here
const workflowRoutes = require('./routes/workflowRoutes');
const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Health Check
app.get('/', (req, res) => {
    res.send('Intelligent Workflow Automation Platform API is Running');
});

// Use Routes
app.use('/api', workflowRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
