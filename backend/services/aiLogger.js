/**
 * aiLogger.js
 * 
 * Centralized logging service that broadcasts real-time workflow events
 * to the frontend AIMonitorPanel using Server-Sent Events (SSE).
 */

class AILogger {
    constructor() {
        this.clients = [];
    }

    /**
     * Add a new SSE client
     */
    addClient(req, res) {
        // Required Headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Allow CORS if necessary (usually handled by app.use(cors()))
        // res.setHeader('Access-Control-Allow-Origin', '*');

        this.clients.push(res);

        // Send an initial connected message
        this.sendLog('System', 'Connected to AI Activity Stream');

        // Handle connection close
        req.on('close', () => {
            this.clients = this.clients.filter(client => client !== res);
            console.log(`[SSE] Client disconnected. Total clients: ${this.clients.length}`);
        });

        console.log(`[SSE] Client connected. Total clients: ${this.clients.length}`);
    }

    /**
     * Broadcast a log event to all connected clients
     * 
     * @param {string} source - e.g., 'AI ENGINE', 'EMAIL SERVICE'
     * @param {string} message - The message to display
     * @param {object} details - Optional metadata
     */
    log(source, message, details = {}) {
        const timestamp = new Date().toISOString();
        const payload = {
            timestamp,
            source,
            message,
            details
        };

        // Format as SSE data
        const eventData = `data: ${JSON.stringify(payload)}\n\n`;

        // Broadcast to all active connections
        this.clients.forEach(client => {
            try {
                client.write(eventData);
            } catch (err) {
                console.error('[SSE] Error writing to client', err);
            }
        });

        // Also log to backend console
        const formattedTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        console.log(`[AILogger ${formattedTime}] [${source}] ${message}`);
    }

    // Helper wrappers
    logSystem(msg) { this.log('SYSTEM', msg); }
    logAIStart(workflow, tone, recipient) { this.log('AI ENGINE STARTED', `Generating message for: ${recipient} | Workflow: ${workflow} | Tone: ${tone}`); }
    logAIRequest() { this.log('AI REQUEST SENT', 'Sending prompt to OpenAI API...'); } // Or Gemini API
    logAIResponse(successMsg) { this.log('AI RESPONSE RECEIVED', successMsg || 'Message generated successfully.'); }
    logEmailStart(recipient) { this.log('EMAIL SERVICE', `Preparing to send email to ${recipient}...`); }
    logEmailSuccess(recipient) { this.log('EMAIL SUCCESS', `Delivered to: ${recipient}`); }
    logEmailFail(recipient, error) { this.log('EMAIL FAILED', `Failed to deliver to ${recipient}: ${error}`); }
    logError(source, msg) { this.log(source, msg); }
    
    // Fallback events
    logFallback(msg) { this.log('TEMPLATE FALLBACK', msg || 'AI generation failed. using default template.'); }
}

// Export a singleton instance
const aiLogger = new AILogger();

module.exports = aiLogger;
