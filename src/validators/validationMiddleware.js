/**
 * Validation Middleware
 * Express middleware for expense validation
 */

const { validateExpense } = require('./expenseValidator');

/**
 * Middleware to validate expense data in request body
 * @param {Object} options - Validation options
 * @returns {Function} Express middleware
 */
function validateExpenseData(options = {}) {
    return (req, res, next) => {
        const { valid, errors } = validateExpense(req.body, options);

        if (!valid) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors,
            });
        }

        // Store validation result in request for downstream use
        req.validationResult = { valid: true };
        next();
    };
}

module.exports = {
    validateExpenseData,
};
