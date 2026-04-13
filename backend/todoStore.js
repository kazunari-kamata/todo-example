const { DatabaseSync } = require('node:sqlite');

function normalizeText(text) {
    return typeof text === 'string' ? text.trim() : '';
}

function normalizeTodo(row) {
    return {
        id: row.id,
        text: row.text,
        completed: Boolean(row.completed)
    };
}

function createTodoStore(options = {}) {
    const {
        databasePath = ':memory:',
        seedTodos = []
    } = options;
    const database = new DatabaseSync(databasePath);

    database.exec(`
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0
        )
    `);

    seedDatabase(database, seedTodos);

    const listStatement = database.prepare(`
        SELECT id, text, completed
        FROM todos
        ORDER BY id ASC
    `);
    const findStatement = database.prepare(`
        SELECT id, text, completed
        FROM todos
        WHERE id = ?
    `);
    const createStatement = database.prepare(`
        INSERT INTO todos (text, completed)
        VALUES (?, 0)
    `);
    const updateTextStatement = database.prepare(`
        UPDATE todos
        SET text = ?
        WHERE id = ?
    `);
    const updateCompletedStatement = database.prepare(`
        UPDATE todos
        SET completed = ?
        WHERE id = ?
    `);
    const deleteStatement = database.prepare(`
        DELETE FROM todos
        WHERE id = ?
    `);

    return {
        list() {
            return listStatement.all().map(normalizeTodo);
        },
        create(text) {
            const normalizedText = normalizeText(text);

            if (normalizedText === '') {
                return null;
            }

            const result = createStatement.run(normalizedText);
            return normalizeTodo(findStatement.get(result.lastInsertRowid));
        },
        update(id, updates = {}) {
            const todo = findStatement.get(id);

            if (!todo) {
                return null;
            }

            if (Object.prototype.hasOwnProperty.call(updates, 'text')) {
                const normalizedText = normalizeText(updates.text);

                if (normalizedText === '') {
                    return false;
                }

                updateTextStatement.run(normalizedText, id);
            }

            if (Object.prototype.hasOwnProperty.call(updates, 'completed')) {
                updateCompletedStatement.run(updates.completed ? 1 : 0, id);
            }

            return normalizeTodo(findStatement.get(id));
        },
        remove(id) {
            return deleteStatement.run(id).changes > 0;
        },
        close() {
            database.close();
        }
    };
}

function seedDatabase(database, seedTodos) {
    const rowCount = database.prepare('SELECT COUNT(*) AS count FROM todos').get().count;

    if (rowCount > 0) {
        return;
    }

    const insertStatement = database.prepare(`
        INSERT INTO todos (text, completed)
        VALUES (?, ?)
    `);

    for (const todo of seedTodos) {
        const normalizedText = normalizeText(todo.text);

        if (normalizedText === '') {
            continue;
        }

        insertStatement.run(normalizedText, todo.completed ? 1 : 0);
    }
}

module.exports = {
    createTodoStore
};
