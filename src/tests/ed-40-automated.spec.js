const { test, expect } = require('@playwright/test');

test.describe('Sauce Demo Login Tests', () => {
  test('Test Case 1: Verify sign-in page loads successfully', async ({ page }) => {
    try {
      await page.goto('https://www.saucedemo.com/', { timeout: 60000 });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      await expect(page).toHaveTitle(/swag labs/i);
      await expect(page).toHaveURL(/saucedemo/i);
      console.log('✓ Sign-in page loaded successfully');
    } catch (error) {
      console.error('❌ Error in Test Case 1:', error);
      throw error;
    }
  });

  test('Test Case 2: Sign in with valid credentials', async ({ page }) => {
    try {
      await page.goto('https://www.saucedemo.com/', { timeout: 60000 });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.getByRole('button', { name: 'Login' }).first().click();

      await expect(page).toHaveURL(/inventory/i);
      console.log('✓ User signed in successfully');
    } catch (error) {
      console.error('❌ Error in Test Case 2:', error);
      throw error;
    }
  });

  test('Test Case 3: Sign in with invalid credentials', async ({ page }) => {
    try {
      await page.goto('https://www.saucedemo.com/', { timeout: 60000 });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      await page.fill('[data-test="username"]', 'invalid_user');
      await page.fill('[data-test="password"]', 'wrong_password');
      await page.getByRole('button', { name: 'Login' }).first().click();

      const errorMessage = page.getByText('Epic sadface: Username and password do not match any user in this service', { exact: true }).first();
      await expect(errorMessage).toBeVisible({ timeout: 15000 });
      console.log('✓ Error message displayed for invalid credentials');
    } catch (error) {
      console.error('❌ Error in Test Case 3:', error);
      throw error;
    }
  });

  test('Test Case 4: Check sign-in button is disabled with no credentials', async ({ page }) => {
    try {
      await page.goto('https://www.saucedemo.com/', { timeout: 60000 });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      const loginButton = page.getByRole('button', { name: 'Login' }).first();
      await expect(loginButton).toBeDisabled({ timeout: 15000 });
      console.log('✓ Sign-in button is disabled with no credentials');
    } catch (error) {
      console.error('❌ Error in Test Case 4:', error);
      throw error;
    }
  });

  test('Test Case 5: Log out successfully after signing in', async ({ page }) => {
    try {
      await page.goto('https://www.saucedemo.com/', { timeout: 60000 });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      await page.fill('[data-test="username"]', 'standard_user');
      await page.fill('[data-test="password"]', 'secret_sauce');
      await page.getByRole('button', { name: 'Login' }).first().click();

      await expect(page).toHaveURL(/inventory/i);
      await page.getByRole('button', { name: 'Open Menu' }).first().click();
      await page.getByRole('link', { name: 'Logout' }).first().click();

      await expect(page).toHaveURL(/saucedemo/i);
      console.log('✓ User logged out successfully');
    } catch (error) {
      console.error('❌ Error in Test Case 5:', error);
      throw error;
    }
  });
});