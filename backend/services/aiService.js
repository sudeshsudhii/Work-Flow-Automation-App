const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Generate personalized email content using Google Gemini AI
 * @param {Object} context - Email context
 * @returns {Promise<{subject: string, body: string}>}
 */
const generateEmailContent = async (context) => {
    const { recipientName, workflowType, balance, tone, additionalContext } = context;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('No AI API key configured');
    }

    try {
        const prompt = `You are a professional message generator.

Generate a ${context.tone || 'Professional'} ${context.workflowType} message.

Recipient: ${context.recipientName}
Organization: ${context.organizationName || 'AutoFlow'}

Additional context:
Event: ${context.eventName || 'N/A'}
Date: ${context.eventDate || 'N/A'}
Time: ${context.eventTime || 'N/A'}
Location: ${context.eventLocation || 'N/A'}
Fee Amount: ${context.feeAmount || context.balance || 'N/A'}
Due Date: ${context.dueDate || 'N/A'}
Task: ${context.taskName || 'N/A'}
Task Deadline: ${context.taskDeadline || 'N/A'}

Requirements:
* professional tone
* concise
* email-ready
* personalized
* no placeholders

FINAL COMMAND:
Output ONLY valid JSON in this exact format: {"subject": "...", "body": "..."}`;


        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048
                }
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 15000
            }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Try multiple parsing strategies
        let parsed = null;

        // Strategy 1: Clean and parse JSON
        try {
            const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
            parsed = JSON.parse(cleanJson);
        } catch (jsonError) {
            // Strategy 2: Extract using regex if JSON parsing fails
            console.warn('[AI] JSON parse failed, attempting regex extraction');
            const subjectMatch = text.match(/"subject"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
            const bodyMatch = text.match(/"body"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);

            if (subjectMatch && bodyMatch) {
                parsed = {
                    subject: subjectMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n'),
                    body: bodyMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
                };
            }
        }

        if (parsed && parsed.subject && parsed.body) {
            console.log(`[AI] ✓ Generated email for ${recipientName}`);
            return {
                subject: parsed.subject,
                body: parsed.body
            };
        } else {
            console.error('[AI] Raw response that failed parsing:', text);
            throw new Error('Failed to extract valid JSON from AI response');
        }

    } catch (error) {
        console.error('[AI] Generation failed:', error.response?.data?.error?.message || error.message);
        throw error; // Rethrow to be handled by the caller
    }
};

/**
 * Test AI connectivity
 */
const testAIConnection = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { success: false, error: 'No API key configured' };
    }

    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: 'Say "AI is working!" in exactly those words.' }] }]
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return { success: true, response: text };
    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        return { success: false, error: errorMsg };
    }
};

const initializeAI = () => !!process.env.GEMINI_API_KEY;

module.exports = { generateEmailContent, testAIConnection, initializeAI };
