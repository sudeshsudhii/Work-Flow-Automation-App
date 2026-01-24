// Simple in-memory store for demo purposes
// In a real app, this would be Firestore
let logs = [
    { id: 'init_1', workflow: 'Fees', name: 'Demo User', channel: 'Email', status: 'Sent', time: new Date(Date.now() - 86400000).toLocaleString() },
    { id: 'init_2', workflow: 'Tasks', name: 'Alice Smith', channel: 'WhatsApp', status: 'Failed', time: new Date(Date.now() - 40000000).toLocaleString() }
];

const addLog = (log) => {
    logs.unshift(log); // Add to beginning
    if (logs.length > 100) logs.pop(); // Keep limit
};

const getLogs = () => logs;

module.exports = { addLog, getLogs };
