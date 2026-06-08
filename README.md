# Personal Expense Tracker

A local personal expense tracker built with Node.js, Express, and SQLite. It serves a minimal single-page frontend and stores expense data in `data/expenses.db`.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Or:

```bash
npm start
```

## Open

Visit `http://localhost:3000`

## API

- `GET /api/expenses`
- `GET /api/expenses/summary`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

## Notes

- Database file: `data/expenses.db`
- No authentication is included.
- Use the browser UI to add, edit, and remove expenses.
