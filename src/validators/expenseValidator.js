/**
 * Expense Validation Layer
 * Provides comprehensive validation for expense creation and updates
 */

// Constants for validation
const VALIDATION_RULES = {
    DESCRIPTION: {
        minLength: 1,
        maxLength: 255,
    },
    AMOUNT: {
        minValue: 0.01,
        maxValue: 999999.99,
    },
    CATEGORY: {
        minLength: 1,
        maxLength: 50,
    },
};

/**
 * Check if a date string is valid ISO format
 * @param {string} value - Date string to validate
 * @returns {boolean} True if valid ISO date
 */
function isValidISODate(value) {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

/**
 * Check if a date is in the future
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is in the future
 */
function isFutureDate(dateString) {
    const date = new Date(dateString);
    return date > new Date();
}

/**
 * Validate description field
 * @param {any} description - Description value to validate
 * @returns {string|null} Error message or null if valid
 */
function validateDescription(description) {
    // Description is optional, only validate if provided
    if (description === undefined || description === null) {
        return null;
    }

    if (typeof description !== 'string') {
        return 'Description must be a string.';
    }

    const trimmed = description.trim();
    if (trimmed.length === 0) {
        return 'Description cannot be empty or whitespace only.';
    }

    if (trimmed.length > VALIDATION_RULES.DESCRIPTION.maxLength) {
        return `Description cannot exceed ${VALIDATION_RULES.DESCRIPTION.maxLength} characters.`;
    }

    return null;
}

/**
 * Validate amount field
 * @param {any} amount - Amount value to validate
 * @returns {string|null} Error message or null if valid
 */
function validateAmount(amount) {
    if (amount === undefined || amount === null) {
        return 'Amount is required.';
    }

    if (typeof amount !== 'number' || Number.isNaN(amount)) {
        return 'Amount must be a valid number.';
    }

    if (amount <= 0) {
        return 'Amount must be a positive number.';
    }

    if (amount < VALIDATION_RULES.AMOUNT.minValue) {
        return `Amount must be at least ${VALIDATION_RULES.AMOUNT.minValue}.`;
    }

    if (amount > VALIDATION_RULES.AMOUNT.maxValue) {
        return `Amount cannot exceed ${VALIDATION_RULES.AMOUNT.maxValue}.`;
    }

    // Check for reasonable decimal places (max 2)
    if (!Number.isInteger(amount * 100)) {
        return 'Amount can have at most 2 decimal places.';
    }

    return null;
}

/**
 * Validate category field
 * @param {any} category - Category value to validate
 * @returns {string|null} Error message or null if valid
 */
function validateCategory(category) {
    if (category === undefined || category === null) {
        return 'Category is required.';
    }

    if (typeof category !== 'string') {
        return 'Category must be a string.';
    }

    const trimmed = category.trim();
    if (trimmed.length === 0) {
        return 'Category cannot be empty.';
    }

    if (trimmed.length > VALIDATION_RULES.CATEGORY.maxLength) {
        return `Category cannot exceed ${VALIDATION_RULES.CATEGORY.maxLength} characters.`;
    }

    return null;
}

/**
 * Validate date field
 * @param {any} date - Date value to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.allowFutureDate - Whether to allow future dates (default: false)
 * @returns {string|null} Error message or null if valid
 */
function validateDate(date, options = {}) {
    const { allowFutureDate = false } = options;

    if (date === undefined || date === null) {
        return 'Date is required.';
    }

    if (typeof date !== 'string') {
        return 'Date must be a string.';
    }

    if (!isValidISODate(date)) {
        return 'Date must be a valid ISO date string (YYYY-MM-DD format).';
    }

    if (!allowFutureDate && isFutureDate(date)) {
        return 'Date cannot be in the future.';
    }

    return null;
}

/**
 * Main expense validation function
 * @param {any} payload - Expense data to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.allowFutureDate - Whether to allow future dates (default: false)
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateExpense(payload, options = {}) {
    const errors = [];

    // Validate payload structure
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return {
            valid: false,
            errors: ['Payload must be a valid JSON object.'],
        };
    }

    // Validate each field
    const descriptionError = validateDescription(payload.description);
    if (descriptionError) errors.push(descriptionError);

    const amountError = validateAmount(payload.amount);
    if (amountError) errors.push(amountError);

    const categoryError = validateCategory(payload.category);
    if (categoryError) errors.push(categoryError);

    const dateError = validateDate(payload.date, { allowFutureDate: options.allowFutureDate });
    if (dateError) errors.push(dateError);

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Validation middleware factory
 * Returns Express middleware for validating expenses
 * @param {Object} options - Validation options
 * @returns {Function} Express middleware function
 */
function createValidationMiddleware(options = {}) {
    return (req, res, next) => {
        const { valid, errors } = validateExpense(req.body, options);

        if (!valid) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors,
            });
        }

        next();
    };
}

module.exports = {
    validateExpense,
    validateDescription,
    validateAmount,
    validateCategory,
    validateDate,
    createValidationMiddleware,
    isValidISODate,
    VALIDATION_RULES,
};
