// TODO リストを管理する機能
// localStorage への保存と読み込みを実装

const todoList = document.getElementById('todo-list');
const addBtn = document.querySelector('.add-btn');
const todoInput = document.getElementById('new-todo-input');
const { sanitizeTodos, addTodoItem, toggleTodoAt, removeTodoAt } = window.TodoLogic;

// localStorage に保存する際のキー
const STORAGE_KEY = 'todo_list_data';

// localStorage から TODO データを取得
function loadTodos() {
    const todos = localStorage.getItem(STORAGE_KEY);
    return todos ? sanitizeTodos(JSON.parse(todos)) : [];
}

// TODO データを localStorage に保存
function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// TODO リストを画面に描画
function renderTodos() {
    const todos = loadTodos();
    todoList.innerHTML = '';
    
    todos.forEach((todo, index) => {
        const item = document.createElement('div');
        item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        item.innerHTML = `
            <span>${escapeHtml(todo.text)}</span>
            <button class="check-btn">完了</button>
            <button class="delete-btn">削除</button>
        `;
        
        const checkBtn = item.querySelector('.check-btn');
        const deleteBtn = item.querySelector('.delete-btn');
        
        checkBtn.addEventListener('click', () => {
            const nextTodos = toggleTodoAt(todos, index);
            saveTodos(nextTodos);
            renderTodos();
        });
        
        deleteBtn.addEventListener('click', () => {
            const nextTodos = removeTodoAt(todos, index);
            saveTodos(nextTodos);
            renderTodos();
        });
        
        todoList.appendChild(item);
    });
    
    // 空の TODO が保存されないようにする
    const remainingTodos = sanitizeTodos(todos);
    saveTodos(remainingTodos);
}

// HTML をエスケープ
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 新しい TODO を追加
function addTodo() {
    const todos = loadTodos();
    const nextTodos = addTodoItem(todos, todoInput.value);

    if (nextTodos === todos) return;
    
    todoInput.value = '';
    saveTodos(nextTodos);
    renderTodos();
}

// イベントリスナーを設定
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// 初期表示
renderTodos();
