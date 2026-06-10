# Analytics Service

A comprehensive analytics service for the Personal Expense Tracker that provides detailed insights into spending patterns, category breakdowns, and temporal trends.

## Overview

The analytics service calculates various metrics and generates Chart.js-compatible visualizations for expense data. It offers both programmatic access to individual calculation functions and API endpoints for frontend integration.

## Features

- **Summary Statistics**: Total spending, average expense, largest expense
- **Category Analysis**: Spending by category with percentage distribution
- **Temporal Analysis**: Monthly spending trends and comparisons
- **Chart Data Generation**: Pre-formatted data for Chart.js visualizations
- **Flexible Filtering**: Date range and category-based filtering
- **Clean Architecture**: Modular, testable, and maintainable design

## API Endpoints

### 1. GET /api/analytics/summary

Get comprehensive analytics for all or filtered expenses.

**Query Parameters:**
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)
- `category` (optional): Filter by category name

**Response:**
```json
{
    "summary": {
        "totalSpending": 1245.50,
        "expenseCount": 23,
        "averageExpense": 54.15,
        "largestExpense": {
            "id": 5,
            "description": "Monthly rent",
            "amount": 500.00,
            "category": "Housing",
            "date": "2024-06-01"
        },
        "highestSpendingCategory": {
            "category": "Food",
            "amount": 450.75
        }
    },
    "byCategory": {
        "spending": {
            "Food": 450.75,
            "Transportation": 250.00,
            "Entertainment": 125.50,
            "Housing": 500.00
        },
        "percentages": {
            "Food": 36.18,
            "Transportation": 20.07,
            "Entertainment": 10.08,
            "Housing": 40.13
        }
    },
    "monthly": {
        "2024-05": 600.25,
        "2024-06": 645.25
    },
    "charts": {
        "categoryBar": { ... },
        "monthlyLine": { ... },
        "categoryDistribution": { ... }
    }
}
```

### 2. GET /api/analytics/category

Get detailed spending breakdown by category.

**Query Parameters:**
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)

**Response:**
```json
{
    "data": [
        {
            "category": "Food",
            "amount": 450.75
        },
        {
            "category": "Transportation",
            "amount": 250.00
        },
        {
            "category": "Entertainment",
            "amount": 125.50
        }
    ],
    "total": 826.25
}
```

### 3. GET /api/analytics/monthly

Get spending trends broken down by month.

**Query Parameters:**
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)

**Response:**
```json
{
    "data": [
        {
            "month": "2024-04",
            "amount": 525.00
        },
        {
            "month": "2024-05",
            "amount": 600.25
        },
        {
            "month": "2024-06",
            "amount": 645.25
        }
    ],
    "total": 1770.50
}
```

### 4. GET /api/analytics/trends

Get aggregate trend statistics.

**Query Parameters:**
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)

**Response:**
```json
{
    "monthCount": 3,
    "averageMonthly": 590.17,
    "maxMonthly": 645.25,
    "minMonthly": 525.00
}
```

## Service Functions

### Core Calculation Functions

#### `calculateTotalSpending(expenses)`
Returns the sum of all expenses.
```javascript
const total = analyticsService.calculateTotalSpending(expenses);
// Returns: 1245.50
```

#### `calculateSpendingByCategory(expenses)`
Returns an object with categories as keys and total amounts as values.
```javascript
const byCategory = analyticsService.calculateSpendingByCategory(expenses);
// Returns: { "Food": 450.75, "Transportation": 250.00, ... }
```

#### `calculateMonthlySpending(expenses)`
Returns monthly totals in YYYY-MM format.
```javascript
const monthly = analyticsService.calculateMonthlySpending(expenses);
// Returns: { "2024-05": 600.25, "2024-06": 645.25 }
```

#### `calculateAverageExpense(expenses)`
Returns the mean expense value.
```javascript
const avg = analyticsService.calculateAverageExpense(expenses);
// Returns: 54.15
```

#### `calculateCategoryPercentages(expenses)`
Returns category spending as percentages of total.
```javascript
const percentages = analyticsService.calculateCategoryPercentages(expenses);
// Returns: { "Food": 36.18, "Transportation": 20.07, ... }
```

#### `getHighestSpendingCategory(spendingByCategory)`
Returns the category with highest total spending.
```javascript
const highest = analyticsService.getHighestSpendingCategory(byCategory);
// Returns: { category: "Housing", amount: 500.00 }
```

#### `getLargestExpense(expenses)`
Returns the single largest expense.
```javascript
const largest = analyticsService.getLargestExpense(expenses);
// Returns: { id: 5, description: "...", amount: 500.00, ... }
```

### Chart Generation Functions

#### `generateCategoryChartData(spendingByCategory)`
Generates Chart.js bar chart data for categories.
```javascript
const chartData = analyticsService.generateCategoryChartData(byCategory);
// Returns Chart.js compatible dataset
```

#### `generateMonthlyChartData(monthlySpending)`
Generates Chart.js line chart data for monthly trends.
```javascript
const chartData = analyticsService.generateMonthlyChartData(monthly);
// Returns Chart.js compatible dataset
```

#### `generateCategoryDistributionChart(spendingByCategory)`
Generates Chart.js doughnut chart for category distribution.
```javascript
const chartData = analyticsService.generateCategoryDistributionChart(byCategory);
// Returns Chart.js compatible dataset
```

### Summary and Analysis

#### `generateAnalyticsSummary(expenses)`
Generates comprehensive analytics object with all calculations and charts.
```javascript
const summary = analyticsService.generateAnalyticsSummary(expenses);
// Returns all analytics including summary, byCategory, monthly, charts
```

### Filter Functions

#### `filterByDateRange(expenses, startDate, endDate)`
Filters expenses within a date range (inclusive).
```javascript
const filtered = analyticsService.filterByDateRange(
    expenses,
    "2024-05-01",
    "2024-06-30"
);
```

#### `filterByCategory(expenses, categories)`
Filters expenses by one or more categories.
```javascript
// Single category
const filtered = analyticsService.filterByCategory(expenses, "Food");

// Multiple categories
const filtered = analyticsService.filterByCategory(
    expenses,
    ["Food", "Entertainment"]
);
```

## Usage Examples

### Example 1: Get Analytics in Backend

```javascript
const { getExpenses } = require('../db');
const { generateAnalyticsSummary } = require('../services/analyticsService');

async function getAnalytics() {
    const expenses = await getExpenses();
    const analytics = generateAnalyticsSummary(expenses);
    console.log(analytics);
}
```

### Example 2: Filter and Analyze

```javascript
const {
    filterByDateRange,
    filterByCategory,
    generateAnalyticsSummary
} = require('../services/analyticsService');

// Get analytics for June 2024, Food category only
const filtered = filterByDateRange(expenses, "2024-06-01", "2024-06-30");
const foodExpenses = filterByCategory(filtered, "Food");
const analytics = generateAnalyticsSummary(foodExpenses);
```

### Example 3: Frontend Integration with Chart.js

```javascript
// Fetch analytics data
const response = await fetch('/api/analytics/summary');
const analytics = await response.json();

// Create bar chart
const ctx = document.getElementById('categoryChart');
new Chart(ctx, {
    type: 'bar',
    data: analytics.charts.categoryBar,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Spending by Category'
            }
        }
    }
});

// Create line chart
const ctxLine = document.getElementById('monthlyChart');
new Chart(ctxLine, {
    type: 'line',
    data: analytics.charts.monthlyLine,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Monthly Spending Trend'
            }
        }
    }
});

// Create doughnut chart
const ctxDough = document.getElementById('distributionChart');
new Chart(ctxDough, {
    type: 'doughnut',
    data: analytics.charts.categoryDistribution,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Category Distribution'
            }
        }
    }
});
```

## File Structure

```
src/
├── services/
│   └── analyticsService.js          # Core analytics functions
├── routes/
│   ├── expenses.js                  # Expense endpoints
│   └── analytics.js                 # Analytics endpoints
├── index.js                         # Main app file
└── db.js
```

## Data Flow

```
Expenses (SQLite DB)
    ↓
getExpenses() [from db.js]
    ↓
analyticsService functions
    ↓
Analytics data + Chart.js formats
    ↓
/api/analytics/* endpoints
    ↓
Frontend (Chart.js visualization)
```

## Performance Considerations

- All calculations are performed in-memory for currently loaded expenses
- For very large datasets (thousands of expenses), consider implementing:
  - Pagination/sampling
  - Server-side aggregation in database
  - Caching of analytics results
- Date filtering is performed client-side in JavaScript for flexibility

## Extending the Service

### Adding a New Metric

1. Create a calculation function:
```javascript
function calculateNewMetric(expenses) {
    // Your calculation logic
    return result;
}
```

2. Add to module exports:
```javascript
module.exports = {
    // ... existing exports
    calculateNewMetric,
};
```

3. Include in `generateAnalyticsSummary()` if appropriate:
```javascript
function generateAnalyticsSummary(expenses) {
    // ... existing code
    const newMetric = calculateNewMetric(expenses);
    return {
        // ... existing fields
        newMetric,
    };
}
```

### Adding a New Chart Type

```javascript
function generateNewChart(data) {
    return {
        labels: [...],
        datasets: [{
            label: 'New Chart',
            data: [...],
            // Chart.js options
        }],
    };
}
```

## Testing

Example test cases:
```javascript
const { generateAnalyticsSummary } = require('../services/analyticsService');

const testExpenses = [
    { id: 1, description: "Lunch", amount: 15.50, category: "Food", date: "2024-06-10" },
    { id: 2, description: "Gas", amount: 50.00, category: "Transportation", date: "2024-06-09" },
    { id: 3, description: "Movie", amount: 12.00, category: "Entertainment", date: "2024-06-08" },
];

const analytics = generateAnalyticsSummary(testExpenses);
console.log(analytics.summary.totalSpending); // 77.50
console.log(analytics.summary.averageExpense); // 25.83
```
