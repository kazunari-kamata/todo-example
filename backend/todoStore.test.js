const test = require('node:test');
const assert = require('node:assert/strict');
const { createTodoStore } = require('./todoStore');

test('createTodoStore lists seeded todos and removes blank seeds', () => {
    const store = createTodoStore([
        { id: 1, text: 'task 1', completed: false },
        { id: 2, text: '   ', completed: true }
    ]);

    assert.deepEqual(store.list(), [
        { id: 1, text: 'task 1', completed: false }
    ]);
});

test('create adds a trimmed todo', () => {
    const store = createTodoStore();

    assert.deepEqual(store.create('  new task  '), {
        id: 1,
        text: 'new task',
        completed: false
    });
});

test('update changes text and completed state', () => {
    const store = createTodoStore([{ id: 4, text: 'task', completed: false }]);

    assert.deepEqual(store.update(4, { text: ' updated ', completed: true }), {
        id: 4,
        text: 'updated',
        completed: true
    });
});

test('update rejects blank text', () => {
    const store = createTodoStore([{ id: 1, text: 'task', completed: false }]);

    assert.equal(store.update(1, { text: '   ' }), false);
});

test('remove deletes an existing todo', () => {
    const store = createTodoStore([{ id: 1, text: 'task', completed: false }]);

    assert.equal(store.remove(1), true);
    assert.deepEqual(store.list(), []);
});
