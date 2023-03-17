const { test, expect } = require('@playwright/test');

test.describe('Login tests', () => {
  let page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Successful login', async () => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForSelector('.inventory_container');
    const url = page.url();
    expect(url).toContain('/inventory.html');
  });

  test('Invalid credentials', async () => {
    await page.fill('#user-name', 'problem_user');
    await page.fill('#password', 'invalid_password');
    await page.click('#login-button');
    await page.waitForSelector('.error-button');
    const errorMsg = await page.textContent('[data-test="error"]');
    expect(errorMsg).toContain('Username and password do not match any user in this service');
  });
});
