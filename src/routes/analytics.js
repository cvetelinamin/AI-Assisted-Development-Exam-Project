/**
 * Analytics Routes
 * Provides API endpoints for expense analytics and reporting
 */

const express = require('express');
const { getExpenses } = require('../db');
const {
    generateAnalyticsSummary,
    filterByDateRange,
    filterByCategory,
    calculateSpendingByCategory,
    calculateMonthlySpending,
} = require('../services/analyticsService');

const router = express.Router();

/**
 * GET /api/analytics/summary
 * Get comprehensive analytics summary for all expenses
 * Query parameters:
 *   - startDate: Filter by start date (YYYY-MM-DD)
 *   - endDate: Filter by end date (YYYY-MM-DD)
 *   - category: Filter by single category
 */
router.get('/summary', async (req, res) => {
    try {
        let expenses = await getExpenses();
        console.log(`Total expenses loaded: ${expenses.length}`);

        // Apply date range filter if provided
        if (req.query.startDate && req.query.endDate) {
            console.log(`Filtering by date range: ${req.query.startDate} to ${req.query.endDate}`);
            expenses = filterByDateRange(
                expenses,
                req.query.startDate,
                req.query.endDate
            );
            console.log(`Filtered expenses count: ${expenses.length}`);
        }

        // Apply category filter if provided
        if (req.query.category) {
            expenses = filterByCategory(expenses, req.query.category);
        }

        const analytics = generateAnalyticsSummary(expenses);
        res.json(analytics);
    } catch (error) {
        console.error('Analytics summary error:', error);
        res.status(500).json({
            error: 'Unable to generate analytics summary.',
            details: error.message
        });
    }
});

/**
 * GET /api/analytics/category
 * Get spending analysis by category
 * Query parameters:
 *   - startDate: Filter by start date (YYYY-MM-DD)
 *   - endDate: Filter by end date (YYYY-MM-DD)
 */
router.get('/category', async (req, res) => {
    try {
        let expenses = await getExpenses();

        if (req.query.startDate && req.query.endDate) {
            expenses = filterByDateRange(
                expenses,
                req.query.startDate,
                req.query.endDate
            );
        }

        const spendingByCategory = calculateSpendingByCategory(expenses);
        const categoryData = Object.entries(spendingByCategory).map(
            ([category, amount]) => ({
                category,
                amount: parseFloat(amount.toFixed(2)),
            })
        );

        res.json({
            data: categoryData,
            total: categoryData.reduce((sum, item) => sum + item.amount, 0),
        });
    } catch (error) {
        console.error('Category analytics error:', error);
        res.status(500).json({ error: 'Unable to fetch category analytics.' });
    }
});

/**
 * GET /api/analytics/monthly
 * Get spending analysis by month
 * Query parameters:
 *   - startDate: Filter by start date (YYYY-MM-DD)
 *   - endDate: Filter by end date (YYYY-MM-DD)
 */
router.get('/monthly', async (req, res) => {
    try {
        let expenses = await getExpenses();

        if (req.query.startDate && req.query.endDate) {
            expenses = filterByDateRange(
                expenses,
                req.query.startDate,
                req.query.endDate
            );
        }

        const monthlySpending = calculateMonthlySpending(expenses);
        const monthlyData = Object.entries(monthlySpending)
            .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
            .map(([month, amount]) => ({
                month,
                amount: parseFloat(amount.toFixed(2)),
            }));

        res.json({
            data: monthlyData,
            total: monthlyData.reduce((sum, item) => sum + item.amount, 0),
        });
    } catch (error) {
        console.error('Monthly analytics error:', error);
        res.status(500).json({ error: 'Unable to fetch monthly analytics.' });
    }
});

/**
 * GET /api/analytics/trends
 * Get expense trends and statistics
 * Query parameters:
 *   - startDate: Filter by start date (YYYY-MM-DD)
 *   - endDate: Filter by end date (YYYY-MM-DD)
 */
router.get('/trends', async (req, res) => {
    try {
        let expenses = await getExpenses();

        if (req.query.startDate && req.query.endDate) {
            expenses = filterByDateRange(
                expenses,
                req.query.startDate,
                req.query.endDate
            );
        }

        const monthlySpending = calculateMonthlySpending(expenses);
        const amounts = Object.values(monthlySpending);

        const trends = {
            monthCount: amounts.length,
            averageMonthly: amounts.length > 0
                ? parseFloat((amounts.reduce((sum, a) => sum + a, 0) / amounts.length).toFixed(2))
                : 0,
            maxMonthly: amounts.length > 0 ? parseFloat(Math.max(...amounts).toFixed(2)) : 0,
            minMonthly: amounts.length > 0 ? parseFloat(Math.min(...amounts).toFixed(2)) : 0,
        };

        res.json(trends);
    } catch (error) {
        console.error('Trends analytics error:', error);
        res.status(500).json({ error: 'Unable to fetch trends analytics.' });
    }
});

module.exports = router;
