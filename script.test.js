const test = require('node:test');
const assert = require('node:assert/strict');
const {
    sanitizeTodos,
    addTodoItem,
    toggleTodoAt,
    removeTodoAt
} = require('./todoLogic');

test('sanitizeTodos removes empty text entries', () => {
    const todos = [
        { text: 'task 1', completed: false },
        { text: '', completed: true },
        { text: 'task 2', completed: false }
    ];

    assert.deepEqual(sanitizeTodos(todos), [
        { text: 'task 1', completed: false },
        { text: 'task 2', completed: false }
    ]);
});

test('addTodoItem trims input and appends a new todo', () => {
    const todos = [{ text: 'existing', completed: false }];

    assert.deepEqual(addTodoItem(todos, '  new task  '), [
        { text: 'existing', completed: false },
        { text: 'new task', completed: false }
    ]);
});

test('addTodoItem ignores blank input', () => {
    const todos = [{ text: 'existing', completed: false }];

    assert.deepEqual(addTodoItem(todos, '   '), todos);
});

test('toggleTodoAt flips only the selected item', () => {
    const todos = [
        { text: 'a', completed: false },
        { text: 'b', completed: true }
    ];

    assert.deepEqual(toggleTodoAt(todos, 0), [
        { text: 'a', completed: true },
        { text: 'b', completed: true }
    ]);
});

test('removeTodoAt deletes the todo at the given index', () => {
    const todos = [
        { text: 'a', completed: false },
        { text: 'b', completed: true },
        { text: 'c', completed: false }
    ];

    assert.deepEqual(removeTodoAt(todos, 1), [
        { text: 'a', completed: false },
        { text: 'c', completed: false }
    ]);
});
