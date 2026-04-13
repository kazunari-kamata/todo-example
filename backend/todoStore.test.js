const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createTodoStore } = require('./todoStore');

test('createTodoStore lists seeded todos and removes blank seeds', () => {
    const store = createTodoStore({
        seedTodos: [
            { text: 'task 1', completed: false },
            { text: '   ', completed: true }
        ]
    });

    assert.deepEqual(store.list(), [
        { id: 1, text: 'task 1', completed: false }
    ]);

    store.close();
});

test('create adds a trimmed todo', () => {
    const store = createTodoStore();

    assert.deepEqual(store.create('  new task  '), {
        id: 1,
        text: 'new task',
        completed: false
    });

    store.close();
});

test('update changes text and completed state', () => {
    const store = createTodoStore({
        seedTodos: [{ text: 'task', completed: false }]
    });

    assert.deepEqual(store.update(1, { text: ' updated ', completed: true }), {
        id: 1,
        text: 'updated',
        completed: true
    });

    store.close();
});

test('update rejects blank text', () => {
    const store = createTodoStore({
        seedTodos: [{ text: 'task', completed: false }]
    });

    assert.equal(store.update(1, { text: '   ' }), false);

    store.close();
});

test('remove deletes an existing todo', () => {
    const store = createTodoStore({
        seedTodos: [{ text: 'task', completed: false }]
    });

    assert.equal(store.remove(1), true);
    assert.deepEqual(store.list(), []);

    store.close();
});

test('seedTodos are ignored when data already exists', () => {
    const databasePath = path.join(os.tmpdir(), `todo-store-${process.pid}-${Date.now()}.sqlite`);
    const store = createTodoStore({
        databasePath,
        seedTodos: [{ text: 'first seed', completed: false }]
    });

    assert.equal(store.create('saved task').id, 2);
    store.close();

    const reopenedStore = createTodoStore({
        databasePath,
        seedTodos: [{ text: 'second seed', completed: false }]
    });

    assert.deepEqual(reopenedStore.list(), [
        { id: 1, text: 'first seed', completed: false },
        { id: 2, text: 'saved task', completed: false }
    ]);

    reopenedStore.close();
    fs.rmSync(databasePath, { force: true });
});
