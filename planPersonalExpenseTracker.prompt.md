## Plan: Personal Expense Tracker (Node + SQLite)

TL;DR - Build a clean local expense tracker using Node.js, Express, and SQLite. The app will use one Express server to serve API routes and a minimal single-page frontend. It will support create, read, update, delete, and summary calculations with no authentication.

**Phase 1: Scaffold the project and dependencies**
1. Create the project folders:
   - `src/` for backend code
   - `public/` for the browser UI
   - `data/` for the SQLite database file
   - `migrations/` for schema creation SQL
2. Initialize npm with `npm init -y`.
3. Install runtime dependencies:
   - `express`
   - `better-sqlite3`
   - `cors`
4. Install dev dependency:
   - `nodemon`
5. Add `package.json` scripts:
   - `start`: `node src/index.js`
   - `dev`: `nodemon src/index.js`
6. Create an initial `README.md` placeholder to update after implementation.

**Phase 2: Set up SQLite schema and DB access**
1. Create `migrations/init.sql` with the `expenses` table:
   - `id` INTEGER PRIMARY KEY AUTOINCREMENT
   - `description` TEXT NOT NULL
   - `amount` REAL NOT NULL
   - `category` TEXT NOT NULL
   - `date` TEXT NOT NULL
   - `notes` TEXT
   - `created_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
   - `updated_at` TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
2. Implement `src/db.js` to:
   - open `data/expenses.db` using `better-sqlite3`
   - detect whether the `expenses` table exists
   - execute `migrations/init.sql` if needed
   - provide helper functions:
     - `getExpenses()` returns all expenses ordered by `date DESC`
     - `getSummary()` returns `totalAmount` and `count`
     - `createExpense(expense)` inserts and returns the new row
     - `updateExpense(id, expense)` updates a row and returns a status
     - `deleteExpense(id)` deletes a row and returns a status
3. Keep migration logic idempotent so the app can start multiple times safely.

**Phase 3: Build the backend API**
1. Implement `src/index.js` to:
   - create the Express app
   - enable `express.json()` and `cors()` middleware
   - serve static files from `public/`
   - mount expense routes from `src/routes/expenses.js`
   - include a generic 404 handler and error middleware
2. Create `src/routes/expenses.js` with handlers:
   - `GET /api/expenses` — return all expense rows
   - `GET /api/expenses/summary` — return totals and count
   - `POST /api/expenses` — validate payload and create an expense
   - `PUT /api/expenses/:id` — validate and update an expense
   - `DELETE /api/expenses/:id` — delete an expense by id
3. Validate requests in the route module:
   - `description` is required and non-empty
   - `amount` is required and must be a positive number
   - `date` is required and must be a valid ISO date string
   - `category` is required and non-empty
4. Return consistent JSON responses for success and failure.
5. Map errors to HTTP status codes:
   - `400`: invalid input
   - `404`: expense not found
   - `500`: unexpected server/database error

**Phase 4: Create the browser UI**
1. Build `public/index.html` with:
   - app title and summary display
   - a form for description, amount, date, category, and optional notes
   - a summary section for totals and item count
   - an expense list area with edit/remove actions
   - a notification area for messages
2. Build `public/app.js` to:
   - fetch expenses and summary on load
   - render the expense list and totals dynamically
   - submit create requests to `POST /api/expenses`
   - support edit mode using `PUT /api/expenses/:id`
   - support deletion with `DELETE /api/expenses/:id`
   - refresh the list and summary after each change
   - display inline success/error messages
3. Keep styling lightweight and readable.
4. Avoid build tooling so the app runs directly in the browser.

**Phase 5: Documentation and verification**
1. Finalize `README.md` with:
   - project purpose and local-only usage
   - install command: `npm install`
   - run commands: `npm run dev` and `npm start`
   - app URL: `http://localhost:3000`
   - note database file path: `data/expenses.db`
   - example API usage
2. Verify manually:
   - start the server and confirm it launches successfully
   - create, edit, and delete expenses in the browser UI
   - confirm summary totals update correctly
3. Verify the API directly:
   - `GET /api/expenses`
   - `GET /api/expenses/summary`
   - `POST /api/expenses`
   - `PUT /api/expenses/:id`
   - `DELETE /api/expenses/:id`
4. Inspect `data/expenses.db` with a SQLite tool and verify the `expenses` table.

**Relevant files**
- `package.json`
- `migrations/init.sql`
- `src/db.js`
- `src/routes/expenses.js`
- `src/index.js`
- `public/index.html`
- `public/app.js`
- `README.md`

**Verification**
1. Run `npm install` and `npm run dev`.
2. Confirm the server starts and load `http://localhost:3000/`.
3. Create an expense in the UI and verify it appears.
4. Edit an expense and confirm the change persists.
5. Delete an expense and confirm it is removed and totals update.
6. Open `data/expenses.db` and verify persisted expense rows.

**Decisions**
- Use plain JavaScript for quick local setup.
- Use `better-sqlite3` for straightforward SQLite access.
- Serve frontend assets from the Express server so the app stays self-contained.
- Keep the scope to local usage only with no authentication.

**Further considerations**
1. Add category/date filtering and search later.
2. Add CSV/JSON export/import as a future enhancement.
3. Add pagination if the expense list grows large.
