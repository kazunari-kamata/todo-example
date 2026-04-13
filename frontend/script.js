const todoList = document.getElementById('todo-list');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('new-todo-input');
const statusMessage = document.getElementById('status-message');

async function fetchTodos() {
    const response = await fetch('/api/todos');
    const data = await response.json();
    return data.todos;
}

async function createTodo(text) {
    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error('TODO の追加に失敗しました');
    }
}

async function updateTodo(id, payload) {
    const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('TODO の更新に失敗しました');
    }
}

async function deleteTodo(id) {
    const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('TODO の削除に失敗しました');
    }
}

function setStatus(message) {
    statusMessage.textContent = message;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderTodos(todos) {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = '<p class="empty-state">TODO がありません</p>';
        return;
    }

    todos.forEach((todo) => {
        const item = document.createElement('article');
        item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        item.innerHTML = `
            <div class="todo-copy">
                <span>${escapeHtml(todo.text)}</span>
                <small>ID: ${todo.id}</small>
            </div>
            <div class="todo-actions">
                <button class="check-btn" type="button">${todo.completed ? '未完了へ戻す' : '完了'}</button>
                <button class="delete-btn" type="button">削除</button>
            </div>
        `;

        item.querySelector('.check-btn').addEventListener('click', async () => {
            try {
                await updateTodo(todo.id, { completed: !todo.completed });
                await refreshTodos();
            } catch (error) {
                setStatus(error.message);
            }
        });

        item.querySelector('.delete-btn').addEventListener('click', async () => {
            try {
                await deleteTodo(todo.id);
                await refreshTodos();
            } catch (error) {
                setStatus(error.message);
            }
        });

        todoList.appendChild(item);
    });
}

async function refreshTodos() {
    const todos = await fetchTodos();
    renderTodos(todos);
    setStatus(`TODO 件数: ${todos.length}`);
}

todoForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        await createTodo(todoInput.value);
        todoInput.value = '';
        await refreshTodos();
    } catch (error) {
        setStatus(error.message);
    }
});

refreshTodos().catch(() => {
    setStatus('API サーバーに接続できませんでした');
});
