function sanitizeTodos(todos) {
    return todos.filter((todo) => todo.text !== '');
}

function createTodo(text) {
    return {
        text: text.trim(),
        completed: false
    };
}

function addTodoItem(todos, text) {
    const todo = createTodo(text);

    if (todo.text === '') {
        return todos;
    }

    return [...todos, todo];
}

function toggleTodoAt(todos, index) {
    return todos.map((todo, todoIndex) => {
        if (todoIndex !== index) {
            return todo;
        }

        return {
            ...todo,
            completed: !todo.completed
        };
    });
}

function removeTodoAt(todos, index) {
    return todos.filter((_, todoIndex) => todoIndex !== index);
}

const TodoLogic = {
    sanitizeTodos,
    createTodo,
    addTodoItem,
    toggleTodoAt,
    removeTodoAt
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TodoLogic;
}

if (typeof window !== 'undefined') {
    window.TodoLogic = TodoLogic;
}
