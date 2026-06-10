const express = require('express');
const { getExpenses, getSummary, createExpense, updateExpense, deleteExpense } = require('../db');

const router = express.Router();

function isValidISODate(value) {
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function validateExpense(payload) {
    const errors = [];

    if (!payload || typeof payload !== 'object') {
        errors.push('Payload must be a JSON object.');
        return { valid: false, errors };
    }

    if (!payload.description || typeof payload.description !== 'string' || !payload.description.trim()) {
        errors.push('Description is required.');
    }

    if (payload.amount === undefined || payload.amount === null || typeof payload.amount !== 'number' || Number.isNaN(payload.amount)) {
        errors.push('Amount must be a number.');
    } else if (payload.amount <= 0) {
        errors.push('Amount must be a positive number.');
    }

    if (!payload.category || typeof payload.category !== 'string' || !payload.category.trim()) {
        errors.push('Category is required.');
    }

    if (!payload.date || typeof payload.date !== 'string' || !isValidISODate(payload.date)) {
        errors.push('Date is required and must be a valid ISO date string.');
    }

    return { valid: errors.length === 0, errors };
}

router.get('/', async (req, res) => {
    try {
        res.json(await getExpenses());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch expenses.' });
    }
});

router.get('/summary', async (req, res) => {
    try {
        res.json(await getSummary());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch summary.' });
    }
});

router.post('/', async (req, res) => {
    const { valid, errors } = validateExpense(req.body);
    if (!valid) {
        return res.status(400).json({ errors });
    }

    try {
        const expense = await createExpense(req.body);
        res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create expense.' });
    }
});

router.put('/:id', async (req, res) => {
    const expenseId = Number(req.params.id);
    if (!Number.isInteger(expenseId) || expenseId <= 0) {
        return res.status(400).json({ error: 'Expense id must be a positive integer.' });
    }

    const { valid, errors } = validateExpense(req.body);
    if (!valid) {
        return res.status(400).json({ errors });
    }

    try {
        const updated = await updateExpense(expenseId, req.body);
        if (!updated) {
            return res.status(404).json({ error: 'Expense not found.' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to update expense.' });
    }
});

router.delete('/:id', async (req, res) => {
    const expenseId = Number(req.params.id);
    if (!Number.isInteger(expenseId) || expenseId <= 0) {
        return res.status(400).json({ error: 'Expense id must be a positive integer.' });
    }

    try {
        const deleted = await deleteExpense(expenseId);
        if (!deleted) {
            return res.status(404).json({ error: 'Expense not found.' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to delete expense.' });
    }
});

module.exports = router;
