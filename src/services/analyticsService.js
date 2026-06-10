/**
 * Analytics Service
 * Provides comprehensive analytics and statistics for expenses
 * Returns data in Chart.js compatible formats
 */

/**
 * Calculate total spending across all expenses
 * @param {Array} expenses - List of expense objects
 * @returns {number} Total spending
 */
function calculateTotalSpending(expenses) {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Calculate spending by category
 * @param {Array} expenses - List of expense objects
 * @returns {Object} Object with categories as keys and total amounts as values
 */
function calculateSpendingByCategory(expenses) {
    return expenses.reduce((acc, expense) => {
        const category = expense.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + expense.amount;
        return acc;
    }, {});
}

/**
 * Find the highest spending category
 * @param {Object} spendingByCategory - Object with categories and amounts
 * @returns {Object} Object with category name and amount
 */
function getHighestSpendingCategory(spendingByCategory) {
    if (Object.keys(spendingByCategory).length === 0) {
        return { category: null, amount: 0 };
    }

    const highest = Object.entries(spendingByCategory).reduce(
        (max, [category, amount]) => (amount > max.amount ? { category, amount } : max),
        { category: null, amount: 0 }
    );

    return highest;
}

/**
 * Calculate monthly spending totals
 * @param {Array} expenses - List of expense objects
 * @returns {Object} Object with month keys and total amounts as values
 */
function calculateMonthlySpending(expenses) {
    return expenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const month = date.toISOString().substring(0, 7); // YYYY-MM format
        acc[month] = (acc[month] || 0) + expense.amount;
        return acc;
    }, {});
}

/**
 * Calculate average expense value
 * @param {Array} expenses - List of expense objects
 * @returns {number} Average expense amount
 */
function calculateAverageExpense(expenses) {
    if (expenses.length === 0) return 0;
    const total = calculateTotalSpending(expenses);
    return parseFloat((total / expenses.length).toFixed(2));
}

/**
 * Find the largest expense
 * @param {Array} expenses - List of expense objects
 * @returns {Object} The largest expense object or null
 */
function getLargestExpense(expenses) {
    if (expenses.length === 0) return null;

    return expenses.reduce((max, expense) =>
        expense.amount > max.amount ? expense : max
    );
}

/**
 * Generate Chart.js compatible bar chart data for spending by category
 * @param {Object} spendingByCategory - Object with categories and amounts
 * @returns {Object} Chart.js dataset object
 */
function generateCategoryChartData(spendingByCategory) {
    const labels = Object.keys(spendingByCategory);
    const data = Object.values(spendingByCategory);

    return {
        labels,
        datasets: [
            {
                label: 'Spending by Category',
                data,
                backgroundColor: generateColors(labels.length),
                borderColor: generateBorderColors(labels.length),
                borderWidth: 1,
            },
        ],
    };
}

/**
 * Generate Chart.js compatible line chart data for monthly spending
 * @param {Object} monthlySpending - Object with months and amounts
 * @returns {Object} Chart.js dataset object
 */
function generateMonthlyChartData(monthlySpending) {
    const sortedMonths = Object.keys(monthlySpending).sort();
    const data = sortedMonths.map(month => monthlySpending[month]);

    return {
        labels: sortedMonths,
        datasets: [
            {
                label: 'Monthly Spending',
                data,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            },
        ],
    };
}

/**
 * Generate Chart.js compatible doughnut chart data for category distribution
 * @param {Object} spendingByCategory - Object with categories and amounts
 * @returns {Object} Chart.js dataset object
 */
function generateCategoryDistributionChart(spendingByCategory) {
    const labels = Object.keys(spendingByCategory);
    const data = Object.values(spendingByCategory);

    return {
        labels,
        datasets: [
            {
                label: 'Category Distribution',
                data,
                backgroundColor: generateColors(labels.length),
                borderColor: generateBorderColors(labels.length),
                borderWidth: 2,
            },
        ],
    };
}

/**
 * Generate an array of colors for charts
 * @param {number} count - Number of colors needed
 * @returns {Array} Array of RGBA color strings
 */
function generateColors(count) {
    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
        'rgba(255, 99, 255, 0.7)',
        'rgba(99, 255, 132, 0.7)',
    ];

    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
}

/**
 * Generate an array of border colors for charts
 * @param {number} count - Number of colors needed
 * @returns {Array} Array of RGB color strings
 */
function generateBorderColors(count) {
    const colors = [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
        'rgb(255, 159, 64)',
        'rgb(199, 199, 199)',
        'rgb(83, 102, 255)',
        'rgb(255, 99, 255)',
        'rgb(99, 255, 132)',
    ];

    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
}

/**
 * Calculate percentage distribution by category
 * @param {Object} spendingByCategory - Object with categories and amounts
 * @returns {Object} Object with categories and their percentages
 */
function calculateCategoryPercentages(spendingByCategory) {
    const total = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);

    if (total === 0) return {};

    return Object.keys(spendingByCategory).reduce((acc, category) => {
        acc[category] = parseFloat(
            ((spendingByCategory[category] / total) * 100).toFixed(2)
        );
        return acc;
    }, {});
}

/**
 * Generate comprehensive analytics summary
 * @param {Array} expenses - List of expense objects
 * @returns {Object} Comprehensive analytics object
 */
function generateAnalyticsSummary(expenses) {
    const totalSpending = calculateTotalSpending(expenses);
    const spendingByCategory = calculateSpendingByCategory(expenses);
    const highestCategory = getHighestSpendingCategory(spendingByCategory);
    const monthlySpending = calculateMonthlySpending(expenses);
    const averageExpense = calculateAverageExpense(expenses);
    const largestExpense = getLargestExpense(expenses);
    const categoryPercentages = calculateCategoryPercentages(spendingByCategory);

    return {
        summary: {
            totalSpending: parseFloat(totalSpending.toFixed(2)),
            expenseCount: expenses.length,
            averageExpense,
            largestExpense: largestExpense ? {
                id: largestExpense.id,
                description: largestExpense.description,
                amount: largestExpense.amount,
                category: largestExpense.category,
                date: largestExpense.date,
            } : null,
            highestSpendingCategory: {
                category: highestCategory.category,
                amount: parseFloat(highestCategory.amount.toFixed(2)),
            },
        },
        byCategory: {
            spending: Object.fromEntries(
                Object.entries(spendingByCategory).map(([cat, amount]) => [
                    cat,
                    parseFloat(amount.toFixed(2)),
                ])
            ),
            percentages: categoryPercentages,
        },
        monthly: Object.fromEntries(
            Object.entries(monthlySpending).map(([month, amount]) => [
                month,
                parseFloat(amount.toFixed(2)),
            ])
        ),
        charts: {
            categoryBar: generateCategoryChartData(spendingByCategory),
            monthlyLine: generateMonthlyChartData(monthlySpending),
            categoryDistribution: generateCategoryDistributionChart(spendingByCategory),
        },
    };
}

/**
 * Filter expenses by date range
 * @param {Array} expenses - List of expense objects
 * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
 * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
 * @returns {Array} Filtered expenses
 */
function filterByDateRange(expenses, startDate, endDate) {
    // Parse dates treating them as local dates, not UTC
    const parseLocalDate = (dateString) => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date;
    };

    const start = parseLocalDate(startDate);
    const end = parseLocalDate(endDate);
    end.setHours(23, 59, 59, 999); // Include entire end date

    return expenses.filter(expense => {
        const expenseDate = parseLocalDate(expense.date);
        return expenseDate >= start && expenseDate <= end;
    });
}

/**
 * Filter expenses by category
 * @param {Array} expenses - List of expense objects
 * @param {string|Array} categories - Category name or array of category names
 * @returns {Array} Filtered expenses
 */
function filterByCategory(expenses, categories) {
    const categoryList = Array.isArray(categories) ? categories : [categories];
    return expenses.filter(expense =>
        categoryList.includes(expense.category)
    );
}

module.exports = {
    // Calculation functions
    calculateTotalSpending,
    calculateSpendingByCategory,
    calculateMonthlySpending,
    calculateAverageExpense,
    calculateCategoryPercentages,
    getHighestSpendingCategory,
    getLargestExpense,

    // Chart generation functions
    generateCategoryChartData,
    generateMonthlyChartData,
    generateCategoryDistributionChart,

    // Summary and comprehensive analysis
    generateAnalyticsSummary,

    // Filter functions
    filterByDateRange,
    filterByCategory,
};
