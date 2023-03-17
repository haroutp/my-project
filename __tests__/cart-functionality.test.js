const { test, expect } = require('@playwright/test');

test.describe('SauceDemo', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Login with valid credentials', async () => {
    const usernameInput = await page.$('[data-test="username"]');
    const passwordInput = await page.$('[data-test="password"]');
    const loginButton = await page.$('[data-test="login-button"]');

    await usernameInput.type('standard_user');
    await passwordInput.type('secret_sauce');
    await loginButton.click();

    const url = await page.url();
    expect(url).toBe('https://www.saucedemo.com/inventory.html');
  });

  test.describe('Cart functionality', () => {
    test('Add product to cart', async () => {
      const addToCartButton = await page.$('[data-test="add-to-cart-sauce-labs-backpack"]');
      await addToCartButton.click();

      const cartBadge = await page.$('.shopping_cart_badge');
      expect(await cartBadge.textContent()).toBe('1');
    });

    test('Add multiple products to cart', async () => {
      const addToCartButtons = await page.$$('.btn_primary.btn_inventory');

      for (const button of addToCartButtons) {
        await button.click();
      }

      const cartBadge = await page.$('.shopping_cart_badge');
      expect(await cartBadge.textContent()).toBe('6');
    });

    test('Remove product from cart', async () => {
      await Promise.all([
        page.click('.shopping_cart_link'),
        page.waitForNavigation()
      ]);
      
      expect(page.url()).toBe('https://www.saucedemo.com/cart.html');

      expect(await page.title()).toBe('Swag Labs');
      // Verify that the cart items are displayed
      const cartItems = await page.$$('.cart_item');
      expect(cartItems.length).toBeGreaterThan(0);
      console.log(cartItems.length);
      const removeButton = await page.$('[data-test="remove-sauce-labs-backpack"]');
      await removeButton.click();

      const cartBadge = await page.$('.shopping_cart_badge');
      expect(await cartBadge.textContent()).toBe(`${cartItems.length - 1}`);
    });

    test('Checkout process', async () => {
      const checkoutButton = await page.$('[data-test="checkout"]');
      await checkoutButton.click();

      const firstNameInput = await page.$('[data-test="firstName"]');
      const lastNameInput = await page.$('[data-test="lastName"]');
      const zipCodeInput = await page.$('[data-test="postalCode"]');
      const continueButton = await page.$('[data-test="continue"]');
      const thankYouMessage = 'Thank you for your order!';

      await firstNameInput.type('John');
      await lastNameInput.type('Doe');
      await zipCodeInput.type('12345');
      await continueButton.click();
      const finishButton = await page.$('[data-test="finish"]');
      await finishButton.click();

      const orderConfirmation = await page.$('.complete-header');
      expect(await orderConfirmation.textContent()).toBe(thankYouMessage);
    });
  });
});
