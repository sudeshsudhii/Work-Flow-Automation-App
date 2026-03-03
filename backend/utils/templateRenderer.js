const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

class TemplateRenderer {
    constructor() {
        this.templatesDir = path.join(__dirname, '..', 'templates');
        this.layoutTemplate = null;
        this.compiledTemplates = new Map();

        this._initialize();
    }

    _initialize() {
        try {
            // Load and compile the base layout layout.hbs
            const layoutPath = path.join(this.templatesDir, 'layout.hbs');
            const layoutSource = fs.readFileSync(layoutPath, 'utf8');
            this.layoutTemplate = handlebars.compile(layoutSource);
        } catch (error) {
            console.error('[TemplateRenderer] Failed to load layout template:', error);
        }
    }

    _getCompiledTemplate(templateName) {
        if (this.compiledTemplates.has(templateName)) {
            return this.compiledTemplates.get(templateName);
        }

        const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templateName}`);
        }

        const source = fs.readFileSync(templatePath, 'utf8');
        const compiled = handlebars.compile(source);
        this.compiledTemplates.set(templateName, compiled);

        return compiled;
    }

    /**
     * Renders a specific template within the base layout.
     * @param {string} templateName - The name of the template file (without .hbs)
     * @param {Object} data - Context data to pass to the template
     * @returns {{ subject: string, html: string }} The rendered subject and HTML content
     */
    render(templateName, data = {}) {
        const enrichedData = {
            ...data,
            currentYear: new Date().getFullYear(),
            paymentLink: data.paymentLink || 'https://example.com/payment'
        };

        try {
            // Render the specific inner template
            const innerTemplate = this._getCompiledTemplate(templateName);
            const bodyHtml = innerTemplate(enrichedData);

            // Apply the layout wrapper, passing the rendered body as 'body'
            if (!this.layoutTemplate) {
                this._initialize(); // Retry initialization
            }

            const finalHtml = this.layoutTemplate({
                ...enrichedData,
                body: new handlebars.SafeString(bodyHtml) // Ensure HTML isn't escaped
            });

            // Handle Subject generation dynamically based on the template and variables
            let subject = 'AutoFlow Automation';
            if (templateName === 'feeReminder') {
                const prefix = enrichedData.isOverdue ? 'URGENT: ' : '';
                subject = `${prefix}Fee Reminder for ${enrichedData.name}`;
            }

            return { subject, html: finalHtml };
        } catch (error) {
            console.error(`[TemplateRenderer] Error rendering template ${templateName}:`, error);
            throw new Error(`Template rendering failed: ${error.message}`);
        }
    }
}

module.exports = new TemplateRenderer();
