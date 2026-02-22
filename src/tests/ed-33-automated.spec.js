const { test, expect } = require('@playwright/test');

test('Verify page loads successfully', async ({ page }) => {
  try {
    await page.goto('https://www.saucedemo.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });

    // Dismiss any consent/cookie dialogs
    try {
      const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
      await consentBtn.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
    } catch (e) { /* No consent dialog */ }

    await expect(page).toHaveTitle('Swag Labs');
    console.log('✓ Test passed');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
});

test('Check content exists', async ({ page }) => {
  try {
    await page.goto('https://www.saucedemo.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });

    await expect(page.locator('h4').first()).toHaveText('Accepted usernames are:', { timeout: 15000 });
    await expect(page.locator('h4').nth(1)).toHaveText('Password for all users:', { timeout: 15000 });
    console.log('✓ Test passed');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
});

test('Verify content is visible', async ({ page }) => {
  try {
    await page.goto('https://www.saucedemo.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });

    await expect(page.locator('[data-test="username"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-test="password"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-test="login-button"]')).toBeVisible({ timeout: 15000 });
    console.log('✓ Test passed');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
});

test('Test content positioning and formatting', async ({ page }) => {
  try {
    await page.goto('https://www.saucedemo.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });

    const usernameInput = page.locator('[data-test="username"]');
    const passwordInput = page.locator('[data-test="password"]');
    const loginButton = page.locator('[data-test="login-button"]');

    await expect(usernameInput).toBeVisible({ timeout: 15000 });
    await expect(passwordInput).toBeVisible({ timeout: 15000 });
    await expect(loginButton).toBeVisible({ timeout: 15000 });

    await expect(usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
    console.log('✓ Test passed');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
});