const axios = require('axios');

const sendToN8N = async (payload) => {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

    if (!webhookUrl) {
        console.log('Mocking n8n call (No URL provided):', payload);
        return { success: true, mocked: true };
    }

    try {
        const response = await axios.post(webhookUrl, payload, {
            headers: {
                'X-Webhook-Secret': webhookSecret
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending to n8n:', error.message);
        throw error;
    }
};

module.exports = { sendToN8N };
