const expenseService = require('../src/services/expenseService');
const db = require('../src/db');

// Mock the database module
jest.mock('../src/db');

describe('ExpenseService', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('getAllExpenses', () => {
        it('should return all expenses from the database', async () => {
            const mockExpenses = [
                {
                    id: 1,
                    description: 'Grocery shopping',
                    amount: 50,
                    category: 'Food',
                    date: '2026-06-01',
                    notes: 'Weekly groceries',
                },
                {
                    id: 2,
                    description: 'Gas',
                    amount: 40,
                    category: 'Transport',
                    date: '2026-06-02',
                    notes: null,
                },
            ];

            db.getExpenses.mockResolvedValue(mockExpenses);

            const result = await expenseService.getAllExpenses();

            expect(result).toEqual(mockExpenses);
            expect(db.getExpenses).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array when there are no expenses', async () => {
            db.getExpenses.mockResolvedValue([]);

            const result = await expenseService.getAllExpenses();

            expect(result).toEqual([]);
            expect(db.getExpenses).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if database call fails', async () => {
            const error = new Error('Database connection failed');
            db.getExpenses.mockRejectedValue(error);

            await expect(expenseService.getAllExpenses()).rejects.toThrow('Database connection failed');
        });
    });

    describe('getExpenseById', () => {
        it('should return an expense when it exists', async () => {
            const mockExpenses = [
                {
                    id: 1,
                    description: 'Grocery shopping',
                    amount: 50,
                    category: 'Food',
                    date: '2026-06-01',
                },
                {
                    id: 2,
                    description: 'Gas',
                    amount: 40,
                    category: 'Transport',
                    date: '2026-06-02',
                },
            ];

            db.getExpenses.mockResolvedValue(mockExpenses);

            const result = await expenseService.getExpenseById(1);

            expect(result).toEqual(mockExpenses[0]);
            expect(db.getExpenses).toHaveBeenCalledTimes(1);
        });

        it('should return null when expense does not exist', async () => {
            db.getExpenses.mockResolvedValue([
                {
                    id: 1,
                    description: 'Grocery shopping',
                    amount: 50,
                    category: 'Food',
                    date: '2026-06-01',
                },
            ]);

            const result = await expenseService.getExpenseById(999);

            expect(result).toBeNull();
        });

        it('should throw an error if database call fails', async () => {
            const error = new Error('Database error');
            db.getExpenses.mockRejectedValue(error);

            await expect(expenseService.getExpenseById(1)).rejects.toThrow('Database error');
        });
    });

    describe('createExpense', () => {
        it('should create a new expense and return it with an ID', async () => {
            const newExpense = {
                description: 'Restaurant',
                amount: 75,
                category: 'Food',
                date: '2026-06-05',
                notes: 'Dinner with friends',
            };

            const createdExpense = {
                id: 3,
                ...newExpense,
            };

            db.createExpense.mockResolvedValue(createdExpense);

            const result = await expenseService.createExpense(newExpense);

            expect(result).toEqual(createdExpense);
            expect(db.createExpense).toHaveBeenCalledWith(newExpense);
        });

        it('should create an expense without notes', async () => {
            const newExpense = {
                description: 'Movie tickets',
                amount: 30,
                category: 'Entertainment',
                date: '2026-06-06',
            };

            const createdExpense = {
                id: 4,
                ...newExpense,
                notes: null,
            };

            db.createExpense.mockResolvedValue(createdExpense);

            const result = await expenseService.createExpense(newExpense);

            expect(result).toEqual(createdExpense);
            expect(result.notes).toBeNull();
        });

        it('should throw an error if database call fails', async () => {
            const error = new Error('Failed to insert expense');
            const newExpense = {
                description: 'Test',
                amount: 10,
                category: 'Test',
                date: '2026-06-07',
            };

            db.createExpense.mockRejectedValue(error);

            await expect(expenseService.createExpense(newExpense)).rejects.toThrow(
                'Failed to insert expense'
            );
        });
    });

    describe('updateExpense', () => {
        it('should successfully update an expense', async () => {
            const updatedExpense = {
                description: 'Updated description',
                amount: 100,
                category: 'Transport',
                date: '2026-06-08',
                notes: 'Updated notes',
            };

            db.updateExpense.mockResolvedValue(true);

            const result = await expenseService.updateExpense(1, updatedExpense);

            expect(result).toBe(true);
            expect(db.updateExpense).toHaveBeenCalledWith(1, updatedExpense);
        });

        it('should return false if expense does not exist', async () => {
            const updatedExpense = {
                description: 'Updated',
                amount: 50,
                category: 'Food',
                date: '2026-06-09',
            };

            db.updateExpense.mockResolvedValue(false);

            const result = await expenseService.updateExpense(999, updatedExpense);

            expect(result).toBe(false);
        });

        it('should throw an error if database call fails', async () => {
            const error = new Error('Update failed');
            const updatedExpense = {
                description: 'Test',
                amount: 25,
                category: 'Test',
                date: '2026-06-10',
            };

            db.updateExpense.mockRejectedValue(error);

            await expect(expenseService.updateExpense(1, updatedExpense)).rejects.toThrow(
                'Update failed'
            );
        });
    });

    describe('deleteExpense', () => {
        it('should successfully delete an expense', async () => {
            db.deleteExpense.mockResolvedValue(true);

            const result = await expenseService.deleteExpense(1);

            expect(result).toBe(true);
            expect(db.deleteExpense).toHaveBeenCalledWith(1);
        });

        it('should return false if expense does not exist', async () => {
            db.deleteExpense.mockResolvedValue(false);

            const result = await expenseService.deleteExpense(999);

            expect(result).toBe(false);
        });

        it('should throw an error if database call fails', async () => {
            const error = new Error('Delete failed');
            db.deleteExpense.mockRejectedValue(error);

            await expect(expenseService.deleteExpense(1)).rejects.toThrow('Delete failed');
        });
    });

    describe('calculateTotalSpending', () => {
        it('should calculate total spending correctly', async () => {
            const mockExpenses = [
                { id: 1, description: 'Item 1', amount: 50, category: 'Food', date: '2026-06-01' },
                { id: 2, description: 'Item 2', amount: 30, category: 'Transport', date: '2026-06-02' },
                { id: 3, description: 'Item 3', amount: 20, category: 'Entertainment', date: '2026-06-03' },
            ];

            db.getExpenses.mockResolvedValue(mockExpenses);

            const result = await expenseService.calculateTotalSpending();

            expect(result).toBe(100);
            expect(db.getExpenses).toHaveBeenCalledTimes(1);
        });

        it('should return 0 when there are no expenses', async () => {
            db.getExpenses.mockResolvedValue([]);

            const result = await expenseService.calculateTotalSpending();

            expect(result).toBe(0);
        });

        it('should handle decimal amounts correctly', async () => {
            const mockExpenses = [
                { id: 1, description: 'Item 1', amount: 10.5, category: 'Food', date: '2026-06-01' },
                { id: 2, description: 'Item 2', amount: 20.75, category: 'Transport', date: '2026-06-02' },
                { id: 3, description: 'Item 3', amount: 5.25, category: 'Entertainment', date: '2026-06-03' },
            ];

            db.getExpenses.mockResolvedValue(mockExpenses);

            const result = await expenseService.calculateTotalSpending();

            expect(result).toBeCloseTo(36.5, 2);
        });

        it('should throw an error if database call fails', async () => {
            const error = new Error('Database error');
            db.getExpenses.mockRejectedValue(error);

            await expect(expenseService.calculateTotalSpending()).rejects.toThrow('Database error');
        });
    });

    describe('calculateSpendingByCategory', () => {
        it('should calculate spending by category correctly', async () => {
            const mockExpenses = [
                { id: 1, description: 'Groceries', amount: 50, category: 'Food', date: '2026-06-01' },
                { id: 2, description: 'Restaurant', amount: 40, category: 'Food', date: '2026-06-02' },
                { id: 3, description: 'Gas', amount: 60, category: 'Transport', date: '2026-06-03' },
                {
                    id: 4,
                    description: 'Movie',
                    amount: 15,
                    category: 'Entertainment',
                    date: '2026-06-04',
                },
            ];

            db.getExpenses.mockResolvedValue(mockExpenses);

            const result = await expenseService.calculateSpendingByCategory();

            expect(result).toEqual({
                Food: 90,
                Transport: 60,
                Entertainment: 15,
            });
            expect(db.getExpenses).toHaveBeenCalledTimes(1);
        });

        it('should return empty object when there are no expenses', async () => {
            db.getExpenses.mockResolvedValue([]);

            const result = await expenseService.calculateSpendingByCategory();

            expect(result).toEqual({});
        });

        it('should group multiple expenses in the same category', async () => {
            const mockExpenses = [
                { id: 1, description: 'Uber', amount: 25, category: 'Transport', date: '2026-06-01' },
                { id: 2, description: 'Lyft', amount: 20, category: 'Transport', date: '2026-06-02' },
                { id: 3, description: 'Gas', amount: 50, category: 'Transport', date: '2026-06-03' },
            ];

            db.getExpenses.mockResolvedValue(mockExpenses);

            const result = await expenseService.calculateSpendingByCategory();

            expect(result).toEqual({
                Transport: 95,
            });
        });

        it('should handle decimal amounts in categories', async () => {
            const mockExpenses = [
                { id: 1, description: 'Item 1', amount: 10.5, category: 'Food', date: '2026-06-01' },
                { id: 2, description: 'Item 2', amount: 15.75, category: 'Food', date: '2026-06-02' },
                { id: 3, description: 'Item 3', amount: 5.25, category: 'Transport', date: '2026-06-03' },
            ];

            db.getExpenses.mockResolvedValue(mockExpenses);

            const result = await expenseService.calculateSpendingByCategory();

            expect(result.Food).toBeCloseTo(26.25, 2);
            expect(result.Transport).toBeCloseTo(5.25, 2);
        });

        it('should throw an error if database call fails', async () => {
            const error = new Error('Database error');
            db.getExpenses.mockRejectedValue(error);

            await expect(expenseService.calculateSpendingByCategory()).rejects.toThrow(
                'Database error'
            );
        });
    });
});
