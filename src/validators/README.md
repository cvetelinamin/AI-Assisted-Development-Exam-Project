# Expense Validation Layer

A comprehensive validation system for expense creation and updates in the Personal Expense Tracker.

## Overview

The validation layer provides:
- **Field-level validation** with specific rules for each expense field
- **Detailed error messages** that guide users on what needs to be corrected
- **Reusable validator functions** for different validation contexts
- **Express middleware** for declarative route protection
- **Extensible design** for adding new validation rules

## Validation Rules

### Description
- **Required**: No
- **Type**: String
- **Constraints**:
  - If provided, must be non-empty (cannot be only whitespace)
  - Maximum 255 characters
  - Example: "Grocery shopping", "Gas for car"

### Amount
- **Required**: Yes
- **Type**: Number
- **Constraints**:
  - Must be positive (> 0)
  - Minimum value: $0.01
  - Maximum value: $999,999.99
  - Maximum 2 decimal places
  - Example: 25.50, 100, 1250.99

### Category
- **Required**: Yes
- **Type**: String
- **Constraints**:
  - Must be non-empty (after trimming)
  - Maximum 50 characters
  - Example: "Food", "Transportation", "Entertainment"

### Date
- **Required**: Yes
- **Type**: String (ISO 8601 format)
- **Constraints**:
  - Must be valid ISO date format (YYYY-MM-DD)
  - Cannot be in the future (by default)
  - Example: "2024-06-10", "2024-01-15"

## Usage

### Option 1: Direct Validation (Function)

Import and use the validator directly in your route handler:

```javascript
const { validateExpense } = require('../validators/expenseValidator');

// In your route handler
router.post('/', async (req, res) => {
    const { valid, errors } = validateExpense(req.body);
    
    if (!valid) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors,
        });
    }
    
    // Process expense...
});
```

### Option 2: Middleware (Declarative)

Use the validation middleware for cleaner route definitions:

```javascript
const { validateExpenseData } = require('../validators/validationMiddleware');

// In your route file
router.post('/', validateExpenseData(), async (req, res) => {
    // Validation already passed, process expense
    try {
        const expense = await createExpense(req.body);
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create expense.' });
    }
});
```

### Option 3: Field-Level Validation

Validate individual fields independently:

```javascript
const { 
    validateDescription, 
    validateAmount, 
    validateCategory, 
    validateDate 
} = require('../validators/expenseValidator');

const descError = validateDescription(data.description);
const amountError = validateAmount(data.amount);
const categoryError = validateCategory(data.category);
const dateError = validateDate(data.date);
```

## API Response Format

### Success Response (201 Created)
```json
{
    "id": 1,
    "description": "Grocery shopping",
    "amount": 45.50,
    "category": "Food",
    "date": "2024-06-10"
}
```

### Validation Error Response (400 Bad Request)
```json
{
    "error": "Validation failed",
    "details": [
        "Description is required.",
        "Amount must be a positive number.",
        "Category cannot exceed 50 characters."
    ]
}
```

## Configuration Options

### Allow Future Dates

By default, the validator rejects dates in the future. You can allow them:

```javascript
const { valid, errors } = validateExpense(req.body, {
    allowFutureDate: true
});
```

Or with middleware:

```javascript
router.post('/', validateExpenseData({ allowFutureDate: true }), async (req, res) => {
    // Process expense...
});
```

## Validation Constants

Access validation rules programmatically:

```javascript
const { VALIDATION_RULES } = require('../validators/expenseValidator');

console.log(VALIDATION_RULES.DESCRIPTION.maxLength); // 255
console.log(VALIDATION_RULES.AMOUNT.maxValue);       // 999999.99
console.log(VALIDATION_RULES.CATEGORY.maxLength);    // 50
```

## File Structure

```
src/
├── validators/
│   ├── expenseValidator.js       # Core validation logic
│   └── validationMiddleware.js   # Express middleware
├── routes/
│   └── expenses.js               # Route handlers using validation
├── db.js
└── index.js
```

## Error Messages

The validator provides clear, actionable error messages:

| Validation | Error Message |
|-----------|---|
| Description not string | "Description must be a string." |
| Empty description | "Description cannot be empty or whitespace only." |
| Description too long | "Description cannot exceed 255 characters." |
| Missing amount | "Amount is required." |
| Non-numeric amount | "Amount must be a valid number." |
| Negative amount | "Amount must be a positive number." |
| Amount too small | "Amount must be at least 0.01." |
| Amount too large | "Amount cannot exceed 999999.99." |
| Bad decimal places | "Amount can have at most 2 decimal places." |
| Missing category | "Category is required." |
| Empty category | "Category cannot be empty." |
| Category too long | "Category cannot exceed 50 characters." |
| Missing date | "Date is required." |
| Invalid date format | "Date must be a valid ISO date string (YYYY-MM-DD format)." |
| Future date (default) | "Date cannot be in the future." |

## Adding New Validation Rules

To add new validation rules:

1. Define a new validator function in `expenseValidator.js`:

```javascript
function validateNewField(value) {
    if (value === undefined) return 'New field is required.';
    // ... validation logic
    return null; // null means valid
}
```

2. Update the `validateExpense` function to call the new validator:

```javascript
const newFieldError = validateNewField(payload.newField);
if (newFieldError) errors.push(newFieldError);
```

3. Update `VALIDATION_RULES` constant if needed:

```javascript
const VALIDATION_RULES = {
    // ... existing rules
    NEW_FIELD: {
        minLength: 1,
        maxLength: 100,
    },
};
```

## Testing

Example test cases for the validation layer:

```javascript
// Valid expense
const validExpense = {
    description: "Grocery shopping",
    amount: 45.50,
    category: "Food",
    date: "2024-06-10"
};
const result = validateExpense(validExpense);
console.log(result.valid); // true

// Invalid amount
const invalidExpense = {
    description: "Test",
    amount: -10,
    category: "Test",
    date: "2024-06-10"
};
const result = validateExpense(invalidExpense);
console.log(result.errors); // ["Amount must be a positive number."]
```
