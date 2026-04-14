const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');
const { createTodoStore } = require('./todoStore');

const frontendDir = path.join(__dirname, '..', 'frontend');
const defaultDatabasePath = path.join(__dirname, 'todos.sqlite');
const defaultSeedTodos = [
    { text: 'APIでTODOを追加する', completed: false },
    { text: 'フロントとバックエンドを分ける', completed: true }
];

function createRequestListener(options = {}) {
    const store = options.store || createTodoStore({
        databasePath: options.databasePath || defaultDatabasePath,
        seedTodos: options.seedTodos || defaultSeedTodos
    });

    return async (req, res) => {
        const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        if (requestUrl.pathname.startsWith('/api/todos')) {
            await handleApiRequest(req, res, requestUrl, store);
            return;
        }

        handleStaticRequest(res, requestUrl.pathname);
    };
}

function createServer() {
    return http.createServer(createRequestListener({
        databasePath: process.env.TODO_DATABASE_PATH || defaultDatabasePath
    }));
}

async function handleApiRequest(req, res, requestUrl, store) {
    const todoId = getTodoIdFromPath(requestUrl.pathname);

    if (req.method === 'GET' && requestUrl.pathname === '/api/todos') {
        sendJson(res, 200, { todos: store.list() });
        return;
    }

    if (req.method === 'POST' && requestUrl.pathname === '/api/todos') {
        const body = await readJsonBody(req, res);

        if (!body) {
            return;
        }

        const todo = store.create(body.text);

        if (!todo) {
            sendJson(res, 400, { message: 'text is required' });
            return;
        }

        sendJson(res, 201, { todo });
        return;
    }

    if (todoId === null) {
        sendJson(res, 404, { message: 'Not found' });
        return;
    }

    if (req.method === 'PUT') {
        const body = await readJsonBody(req, res);

        if (!body) {
            return;
        }

        const updatedTodo = store.update(todoId, body);

        if (updatedTodo === null) {
            sendJson(res, 404, { message: 'Todo not found' });
            return;
        }

        if (updatedTodo === false) {
            sendJson(res, 400, { message: 'text must not be blank' });
            return;
        }

        sendJson(res, 200, { todo: updatedTodo });
        return;
    }

    if (req.method === 'DELETE') {
        const removed = store.remove(todoId);

        if (!removed) {
            sendJson(res, 404, { message: 'Todo not found' });
            return;
        }

        res.writeHead(204);
        res.end();
        return;
    }

    sendJson(res, 405, { message: 'Method not allowed' });
}

function getTodoIdFromPath(pathname) {
    const match = pathname.match(/^\/api\/todos\/(\d+)$/);

    if (!match) {
        return null;
    }

    return Number(match[1]);
}

async function readJsonBody(req, res) {
    const chunks = [];

    for await (const chunk of req) {
        chunks.push(chunk);
    }

    if (chunks.length === 0) {
        return {};
    }

    try {
        return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
        sendJson(res, 400, { message: 'Invalid JSON' });
        return null;
    }
}

function handleStaticRequest(res, pathname) {
    const requestedPath = pathname === '/' ? '/index.html' : pathname;
    const filePath = path.join(frontendDir, requestedPath);

    if (!filePath.startsWith(frontendDir)) {
        sendText(res, 403, 'Forbidden');
        return;
    }

    fs.readFile(filePath, (error, file) => {
        if (error) {
            sendText(res, 404, 'Not found');
            return;
        }

        res.writeHead(200, { 'Content-Type': getContentType(filePath) });
        res.end(file);
    });
}

function getContentType(filePath) {
    if (filePath.endsWith('.css')) {
        return 'text/css; charset=utf-8';
    }

    if (filePath.endsWith('.js')) {
        return 'application/javascript; charset=utf-8';
    }

    return 'text/html; charset=utf-8';
}

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(message);
}

if (require.main === module) {
    const server = createServer();
    const port = Number(process.env.PORT || 3000);

    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

module.exports = {
    createRequestListener,
    createServer
};
