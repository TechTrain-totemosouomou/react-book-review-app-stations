// tests/login.test.cjs
const { test, expect } = require('@playwright/test');

test.describe('Login functionality', () => {
  test('should display error message for non-existent user', async ({ page }) => {
    // ページを開く
    await page.goto('/');

    // フォームに入力する
    await page.fill('input[name="email"]', 'exsample@techtrain.dev');
    await page.fill('input[name="password"]', 'password');

    // ログインボタンをクリックする
    await page.click('button[type="submit"]');

    // エラーメッセージが表示されるまで待機する
    await page.waitForSelector('.error-message');

    // エラーメッセージを確認する
    const errorMessage = await page.locator('.error-message');
    const errorMessageText = await errorMessage.innerText();

    // エラーメッセージの内容をチェックする
    const expectedMessages = ['User not found.', 'そのユーザは存在しません'];
    expect(expectedMessages).toContain(errorMessageText);
  });
});
