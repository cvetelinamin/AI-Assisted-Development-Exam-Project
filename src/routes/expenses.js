const express = require('express');
const { getExpenses, getSummary, createExpense, updateExpense, deleteExpense } = require('../db');
const { validateExpense } = require('../validators/expenseValidator');

const router = express.Router();

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
        return res.status(400).json({
            error: 'Validation failed',
            details: errors,
        });
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
        return res.status(400).json({
            error: 'Validation failed',
            details: errors,
        });
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
