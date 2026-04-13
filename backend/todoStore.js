function normalizeText(text) {
    return typeof text === 'string' ? text.trim() : '';
}

function createTodoStore(initialTodos = []) {
    let nextId = 1;
    let todos = [];

    function seedTodo(todo) {
        const text = normalizeText(todo.text);

        if (text === '') {
            return;
        }

        const normalizedId = Number.isInteger(todo.id) ? todo.id : nextId;

        todos.push({
            id: normalizedId,
            text,
            completed: Boolean(todo.completed)
        });
        nextId = Math.max(nextId, normalizedId + 1);
    }

    initialTodos.forEach(seedTodo);

    return {
        list() {
            return [...todos];
        },
        create(text) {
            const normalizedText = normalizeText(text);

            if (normalizedText === '') {
                return null;
            }

            const todo = {
                id: nextId++,
                text: normalizedText,
                completed: false
            };

            todos.push(todo);
            return todo;
        },
        update(id, updates = {}) {
            const todo = todos.find((item) => item.id === id);

            if (!todo) {
                return null;
            }

            if (Object.prototype.hasOwnProperty.call(updates, 'text')) {
                const normalizedText = normalizeText(updates.text);

                if (normalizedText === '') {
                    return false;
                }

                todo.text = normalizedText;
            }

            if (Object.prototype.hasOwnProperty.call(updates, 'completed')) {
                todo.completed = Boolean(updates.completed);
            }

            return todo;
        },
        remove(id) {
            const targetIndex = todos.findIndex((item) => item.id === id);

            if (targetIndex === -1) {
                return false;
            }

            todos.splice(targetIndex, 1);
            return true;
        }
    };
}

module.exports = {
    createTodoStore
};
