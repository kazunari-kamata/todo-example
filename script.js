// TODO リストを管理する機能
// localStorage への保存と読み込みを実装

const todoList = document.getElementById('todo-list');
const addBtn = document.querySelector('.add-btn');
const todoInput = document.getElementById('new-todo-input');

// localStorage に保存する際のキー
const STORAGE_KEY = 'todo_list_data';

// localStorage から TODO データを取得
function loadTodos() {
    const todos = localStorage.getItem(STORAGE_KEY);
    return todos ? JSON.parse(todos) : [];
}

// TODO データを localStorage に保存
function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// TODO リストを画面に描画
function renderTodos() {
    const todos = loadTodos();
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
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
            todo.completed = !todo.completed;
            renderTodos();
            saveTodos(todos.filter(t => t.text !== '')); // 空の TODO は除外する
        });
        
        deleteBtn.addEventListener('click', () => {
            todoList.removeChild(item);
            // 対象の TODO を localStorage から削除
            saveTodos(todos.filter(t => t.text !== todo.text));
        });
        
        todoList.appendChild(item);
    });
    
    // 空の TODO が保存されないようにする
    const remainingTodos = todos.filter(t => t.text !== '');
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
    const text = todoInput.value.trim();
    
    if (text === '') return;
    
    const todos = loadTodos();
    todos.push({
        text: text,
        completed: false
    });
    
    todoInput.value = '';
    saveTodos(todos);
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
