/**
 * aiRulesEngine.js
 * 
 * Applies "Smart AI Rules" to dynamically adjust message generation parameters
 * like urgency, tone, and context based on the input data.
 */

const applySmartRules = (context) => {
    let { tone, balance, dueDate, workflowType, smartRulesEnabled } = context;

    // If smart rules are disabled, return the original context
    if (!smartRulesEnabled) {
        return context;
    }

    let appliedRules = [];

    // Rule 1: High Balance -> Urgent Tone for Fees
    if (workflowType === 'Fee Reminder' && balance) {
        // Parse balance string (e.g., "$1,500" -> 1500)
        const numericBalance = parseFloat(balance.toString().replace(/[^0-9.-]+/g, ''));
        if (numericBalance > 1000) {
            tone = 'Urgent';
            appliedRules.push('High balance detected: Tone set to Urgent');
        }
    }

    // Rule 2: Due Date passed -> Urgent Tone
    if (dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        if (due < now && tone !== 'Urgent') {
            tone = 'Urgent';
            appliedRules.push('Overdue date detected: Tone set to Urgent');
        }
    }

    // Rule 3: Support workflow -> Supportive / Friendly Tone
    if (workflowType === 'HR Notification' || workflowType === 'Task Follow-up' && tone === 'Urgent') {
        // Maybe don't force supportive, but ensure it's not overly aggressive unless specified
        // Let's ensure new recipients or certain workflows have a friendly fallback
        if (!tone) {
            tone = 'Friendly';
            appliedRules.push('Defaulted HR/Task workflow to Friendly tone');
        }
    }

    // Default tone if none provided
    if (!tone) {
        tone = 'Professional';
        appliedRules.push('No tone specified, defaulting to Professional');
    }

    return {
        ...context,
        tone,
        appliedRules
    };
};

module.exports = { applySmartRules };
