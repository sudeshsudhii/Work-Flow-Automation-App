const nodemailer = require('nodemailer');

const createTransporter = () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return null;
};

const sendEmail = async (to, subject, text, html) => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log(`[Simulation] Email to ${to}: ${subject}`);
        return { success: true, simulated: true };
    }

    try {
        console.log(`[Email] Attempting to send to ${to}...`);
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"AutoFlow" <no-reply@autoflow.com>',
            to,
            subject,
            text,
            html: html || text // Fallback to text if no HTML
        });
        console.log(`[Email] ✓ Sent successfully to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`[Email] ✗ Failed to send to ${to}:`, error.message);
        console.error(`[Email] Error code: ${error.code}, Response: ${error.response}`);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };
