const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'expenses.db');
const migrationPath = path.join(__dirname, '..', 'migrations', 'init.sql');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

function runMigrations() {
    const initSql = fs.readFileSync(migrationPath, 'utf8');
    db.exec(initSql, (err) => {
        if (err) {
            console.error('Failed to run migrations:', err);
            process.exit(1);
        }
    });
}

function allAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

function getAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

runMigrations();

const getExpenses = async () => {
    return allAsync('SELECT * FROM expenses ORDER BY date DESC, id DESC');
};

const getSummary = async () => {
    return getAsync('SELECT COUNT(*) AS count, COALESCE(SUM(amount), 0) AS totalAmount FROM expenses');
};

const createExpense = async (expense) => {
    const result = await runAsync(
        `INSERT INTO expenses (description, amount, category, date, notes)
     VALUES (?, ?, ?, ?, ?)`,
        [expense.description, expense.amount, expense.category, expense.date, expense.notes || null]
    );
    return getAsync('SELECT * FROM expenses WHERE id = ?', [result.lastID]);
};

const updateExpense = async (id, expense) => {
    const result = await runAsync(
        `UPDATE expenses
     SET description = ?,
         amount = ?,
         category = ?,
         date = ?,
         notes = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
        [expense.description, expense.amount, expense.category, expense.date, expense.notes || null, id]
    );
    return result.changes > 0;
};

const deleteExpense = async (id) => {
    const result = await runAsync('DELETE FROM expenses WHERE id = ?', [id]);
    return result.changes > 0;
};

module.exports = {
    getExpenses,
    getSummary,
    createExpense,
    updateExpense,
    deleteExpense,
};
