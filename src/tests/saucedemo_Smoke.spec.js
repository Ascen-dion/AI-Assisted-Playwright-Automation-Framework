const { test, expect } = require('../core/ai-test-runner');

/**
 * Smoke Test for SauceDemo E-Commerce Website
 * https://www.saucedemo.com/
 */

test.describe('SauceDemo - Authentication', () => {

  // test('Should login successfully with valid credentials', async ({ aiPage, page }) => {
  //   await aiPage.navigateTo('https://www.saucedemo.com/');

  //   // Login with standard user - using actual element IDs from the page
  //   await page.fill('#user-name', 'standard_user');
  //   await page.fill('#password', 'secret_sauce');
  //   await page.click('#login-button');

  //   // Verify successful login - wait for inventory page
  //   await page.waitForSelector('.inventory_container', { timeout: 10000 });
  //   await page.waitForSelector('.shopping_cart_link', { timeout: 5000 });

  //   // Take screenshot
  //   await page.screenshot({ path: 'test-results/successful-login.png' });

  //   console.log('✅ Login test passed successfully!');
  // });

  test('1 Should login successfully with valid credentials', async ({ aiPage, page }) => {
    await aiPage.navigateTo('https://www.saucedemo.com/');

    // Login with standard user - AI-powered element finding
    await aiPage.fillField('username', 'standard_user');
    await aiPage.fillField('password', 'secret_sauce');
    await aiPage.clickElement('login button');

    // Verify successful login - using traditional selectors for reliability
    await page.waitForSelector('.inventory_container', { timeout: 10000 });
    await page.waitForSelector('.shopping_cart_link', { timeout: 5000 });

    // Take screenshot
    await page.screenshot({ path: 'test-results/successful-login.png' });

    console.log('✅ Login test passed successfully!');
  });
});
