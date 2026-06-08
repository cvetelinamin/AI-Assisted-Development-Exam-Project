const summaryCount = document.getElementById('summaryCount');
const summaryTotal = document.getElementById('summaryTotal');
const expenseRows = document.getElementById('expenseRows');
const messageEl = document.getElementById('message');
const expenseForm = document.getElementById('expenseForm');
const expenseIdInput = document.getElementById('expenseId');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const categoryInput = document.getElementById('category');
const notesInput = document.getElementById('notes');
const submitButton = document.getElementById('submitButton');

const apiBase = '/api/expenses';

function showMessage(text, type = 'success') {
    messageEl.textContent = text;
    messageEl.className = `message visible ${type}`;
    setTimeout(() => {
        messageEl.className = 'message';
    }, 4000);
}

async function fetchSummary() {
    const res = await fetch(`${apiBase}/summary`);
    if (!res.ok) {
        throw new Error('Unable to fetch summary');
    }
    return res.json();
}

async function fetchExpenses() {
    const res = await fetch(apiBase);
    if (!res.ok) {
        throw new Error('Unable to fetch expenses');
    }
    return res.json();
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function resetForm() {
    expenseIdInput.value = '';
    expenseForm.reset();
    submitButton.textContent = 'Add expense';
}

function buildExpenseRow(expense) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <td>${expense.description}</td>
    <td>${formatCurrency(expense.amount)}</td>
    <td>${expense.category}</td>
    <td>${new Date(expense.date).toLocaleDateString()}</td>
    <td>${expense.notes || ''}</td>
    <td class="actions">
      <button class="edit" type="button">Edit</button>
      <button class="delete" type="button">Delete</button>
    </td>
  `;

    const [editButton, deleteButton] = tr.querySelectorAll('button');

    editButton.addEventListener('click', () => {
        expenseIdInput.value = expense.id;
        descriptionInput.value = expense.description;
        amountInput.value = expense.amount.toFixed(2);
        dateInput.value = expense.date;
        categoryInput.value = expense.category;
        notesInput.value = expense.notes || '';
        submitButton.textContent = 'Update expense';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    deleteButton.addEventListener('click', async () => {
        if (!confirm('Delete this expense?')) return;
        try {
            const res = await fetch(`${apiBase}/${expense.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Delete failed');
            }
            showMessage('Expense deleted.', 'success');
            await refresh();
        } catch (err) {
            showMessage(err.message, 'error');
        }
    });

    return tr;
}

async function refresh() {
    try {
        const [summary, expenses] = await Promise.all([fetchSummary(), fetchExpenses()]);
        summaryCount.textContent = summary.count;
        summaryTotal.textContent = formatCurrency(summary.totalAmount);
        expenseRows.innerHTML = '';
        expenses.forEach((expense) => {
            expenseRows.appendChild(buildExpenseRow(expense));
        });
    } catch (err) {
        showMessage(err.message, 'error');
    }
}

expenseForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const expense = {
        description: descriptionInput.value.trim(),
        amount: Number(amountInput.value),
        date: dateInput.value,
        category: categoryInput.value.trim(),
        notes: notesInput.value.trim(),
    };

    const id = expenseIdInput.value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiBase}/${id}` : apiBase;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
        });

        const body = await res.json();
        if (!res.ok) {
            if (body.errors) {
                throw new Error(body.errors.join(' '));
            }
            throw new Error(body.error || 'Request failed');
        }

        showMessage(id ? 'Expense updated.' : 'Expense added.', 'success');
        resetForm();
        await refresh();
    } catch (err) {
        showMessage(err.message, 'error');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    refresh();
});
