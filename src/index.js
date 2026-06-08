const path = require('path');
const express = require('express');
const cors = require('cors');
const expensesRouter = require('./routes/expenses');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/expenses', expensesRouter);

app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API route not found.' });
    } else {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(port, () => {
    console.log(`Expense tracker listening on http://localhost:${port}`);
});
