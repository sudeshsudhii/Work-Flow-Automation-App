const nodemailer = require('nodemailer');

const createTransporter = () => {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Utilizing built-in 'gmail' service correctly configures host/port automatically
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return null;
};

/**
 * Sends an email cleanly formatted with valid HTML and a plain text fallback.
 * @param {Object} options Email configuration
 * @param {string} options.to Email address
 * @param {string} options.subject Subject line
 * @param {string} options.html HTML email body content
 * @returns {Promise<{success: boolean, simulated?: boolean, messageId?: string, error?: string}>} structured result
 */
const sendEmail = async ({ to, subject, html }) => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log(`[Simulation] Email to ${to}: ${subject}`);
        return { success: true, simulated: true };
    }

    try {
        console.log(`[Email] Attempting to send to ${to}...`);

        // Automatically generate a clean plain-text fallback from the HTML payload
        const plainTextFallback = html
            ? html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles definitions
                .replace(/<br\s*[\/]?>/gi, '\n') // Turn breaks into newlines
                .replace(/<\/p>/gi, '\n\n') // Paragraphs yield double newlines
                .replace(/<[^>]+>/g, '') // Strip remaining HTML markup
                .replace(/&nbsp;/g, ' ') // Swap standard encoded spaces
                .trim()
            : 'Please view this email in an HTML-compatible client.';

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"AutoFlow" <no-reply@autoflow.com>',
            to,
            subject,
            text: plainTextFallback, // Include plain text
            html: html               // Ensures header Content-Type=text/html natively
        });

        console.log(`[Email] ✓ Sent successfully to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`[Email] ✗ Failed to send to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
