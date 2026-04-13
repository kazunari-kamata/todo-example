const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable, Writable } = require('node:stream');
const { createRequestListener } = require('./server');

async function requestJson(listener, method, path, body) {
    const payload = body ? JSON.stringify(body) : '';

    const req = new Readable({
        read() {
            this.push(payload);
            this.push(null);
        }
    });

    req.method = method;
    req.url = path;
    req.headers = {
        host: 'localhost',
        ...(payload ? {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(payload)
        } : {})
    };

    const chunks = [];
    let statusCode = 200;
    let headers = {};

    const res = new Writable({
        write(chunk, encoding, callback) {
            chunks.push(Buffer.from(chunk));
            callback();
        }
    });

    res.writeHead = (nextStatusCode, nextHeaders) => {
        statusCode = nextStatusCode;
        headers = nextHeaders;
        return res;
    };

    res.setHeader = (name, value) => {
        headers[name.toLowerCase()] = value;
    };

    res.end = (chunk) => {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }

        res.emit('finish');
    };

    return new Promise((resolve, reject) => {
        res.on('finish', () => {
            const text = Buffer.concat(chunks).toString('utf8');

            resolve({
                statusCode,
                headers,
                body: text ? JSON.parse(text) : null
            });
        });

        Promise.resolve(listener(req, res)).catch(reject);
    });
}

test('CRUD API works end-to-end', async () => {
    const listener = createRequestListener();

    const initial = await requestJson(listener, 'GET', '/api/todos');
    assert.equal(initial.statusCode, 200);
    assert.equal(Array.isArray(initial.body.todos), true);

    const created = await requestJson(listener, 'POST', '/api/todos', { text: 'API test task' });
    assert.equal(created.statusCode, 201);
    assert.equal(created.body.todo.text, 'API test task');

    const updated = await requestJson(listener, 'PUT', `/api/todos/${created.body.todo.id}`, {
        text: 'updated task',
        completed: true
    });
    assert.equal(updated.statusCode, 200);
    assert.deepEqual(updated.body.todo, {
        id: created.body.todo.id,
        text: 'updated task',
        completed: true
    });

    const deleted = await requestJson(listener, 'DELETE', `/api/todos/${created.body.todo.id}`);
    assert.equal(deleted.statusCode, 204);
    assert.equal(deleted.body, null);
});
