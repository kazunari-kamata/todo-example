const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:3000'
    },
    webServer: {
        command: 'node backend/server.js',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: !process.env.CI,
        env: {
            PORT: '3000',
            TODO_DATABASE_PATH: 'backend/todos.playwright.sqlite'
        }
    }
});
