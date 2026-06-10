const {
    getExpenses,
    getSummary,
    createExpense,
    updateExpense,
    deleteExpense,
} = require('../db');

/**
 * ExpenseService - Business logic layer for expense operations
 */
class ExpenseService {
    /**
     * Get all expenses
     * @returns {Promise<Array>} Array of all expenses
     */
    async getAllExpenses() {
        return getExpenses();
    }

    /**
     * Get a single expense by ID
     * @param {number} id - Expense ID
     * @returns {Promise<Object|null>} Expense object or null if not found
     */
    async getExpenseById(id) {
        const expenses = await getExpenses();
        return expenses.find(expense => expense.id === id) || null;
    }

    /**
     * Create a new expense
     * @param {Object} expense - Expense data
     * @param {string} expense.description - Description of the expense
     * @param {number} expense.amount - Amount of the expense
     * @param {string} expense.category - Category of the expense
     * @param {string} expense.date - Date of the expense
     * @param {string} [expense.notes] - Optional notes
     * @returns {Promise<Object>} Created expense object with ID
     */
    async createExpense(expense) {
        return createExpense(expense);
    }

    /**
     * Update an existing expense
     * @param {number} id - Expense ID
     * @param {Object} expense - Updated expense data
     * @returns {Promise<boolean>} True if update was successful
     */
    async updateExpense(id, expense) {
        return updateExpense(id, expense);
    }

    /**
     * Delete an expense
     * @param {number} id - Expense ID
     * @returns {Promise<boolean>} True if deletion was successful
     */
    async deleteExpense(id) {
        return deleteExpense(id);
    }

    /**
     * Calculate total spending across all expenses
     * @returns {Promise<number>} Total amount spent
     */
    async calculateTotalSpending() {
        const expenses = await getExpenses();
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    /**
     * Calculate spending by category
     * @returns {Promise<Object>} Object with categories as keys and totals as values
     */
    async calculateSpendingByCategory() {
        const expenses = await getExpenses();
        return expenses.reduce((categories, expense) => {
            categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
            return categories;
        }, {});
    }
}

module.exports = new ExpenseService();
