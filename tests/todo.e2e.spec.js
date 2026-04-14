const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test('Todo を追加して完了切り替え後に削除できる', async ({ page }) => {
    const todoInput = page.getByPlaceholder('新しい TODO を入力してください');
    const addButton = page.getByRole('button', { name: 'TODO 追加' });
    const statusMessage = page.locator('#status-message');
    const newTodoText = 'Playwright で追加した Todo';

    await expect(statusMessage).toContainText('TODO 件数: 2');

    await todoInput.fill(newTodoText);
    await addButton.click();

    const createdTodo = page.locator('.todo-item', {
        has: page.getByText(newTodoText)
    });

    await expect(createdTodo).toBeVisible();
    await expect(statusMessage).toContainText('TODO 件数: 3');

    await createdTodo.getByRole('button', { name: '完了' }).click();
    await expect(createdTodo).toHaveClass(/completed/);
    await expect(createdTodo.getByRole('button', { name: '未完了へ戻す' })).toBeVisible();

    await createdTodo.getByRole('button', { name: '削除' }).click();
    await expect(createdTodo).toHaveCount(0);
    await expect(statusMessage).toContainText('TODO 件数: 2');
});
