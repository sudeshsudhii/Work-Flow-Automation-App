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
        // Prepare structured data for the AI
        const rowData = {
            name: recipientName,
            workflowType: workflowType,
            balance: balance || 'N/A',
            tone: tone || 'professional'
        };

        const prompt = `You are a controlled AI system embedded inside a workflow automation app.

YOUR JOB:
Generate a NEW email message based ONLY on the data and instructions provided.

ABSOLUTE RULES (DO NOT BREAK):
1. Do NOT use or imitate any previous email templates
2. Do NOT use default or generic email language
3. Do NOT guess missing information
4. Do NOT add anything that is not in the data
5. Do NOT explain what you are doing
6. Do NOT output markdown or bullet points
7. Do NOT repeat any sentence from past responses
8. Sign off as "AutoFlow Team"

IF YOU CANNOT FOLLOW THE RULES:
Return exactly this text: "ERROR: INSUFFICIENT DATA"

INPUT DATA:
Name: ${rowData.name}
Workflow Type: ${rowData.workflowType}
Balance/Amount: ${rowData.balance}

INSTRUCTIONS:
Purpose: ${rowData.workflowType}
Tone: ${rowData.tone}
Channel: Email

FINAL COMMAND:
Generate ONE fresh email with a subject line.
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
