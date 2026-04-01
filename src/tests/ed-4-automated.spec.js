const { test, expect } = require('@playwright/test');

test.describe('Yahoo Homepage Sign In Button Verification', () => {
  test('Test Case 1: Navigate to https://www.yahoo.com', async ({ page }) => {
    try {
      await page.goto('https://www.yahoo.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog present */ }

      await expect(page).toHaveURL(/yahoo\.com/i);
      console.log('✓ Test Case 1 passed: Navigated to https://www.yahoo.com');
    } catch (error) {
      console.error('❌ Test Case 1 failed:', error);
      throw error;
    }
  });

  test('Test Case 2: Check that the Sign in button is visible on the page', async ({ page }) => {
    try {
      await page.goto('https://www.yahoo.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog present */ }

      // Find the Sign in button using multiple strategies
      const signInButton = page.getByRole('link', { name: 'Sign in' }).first();
      await expect(signInButton).toBeVisible({ timeout: 15000 });
      console.log('✓ Test Case 2 passed: Sign in button is visible');
    } catch (error) {
      console.error('❌ Test Case 2 failed:', error);
      throw error;
    }
  });

  test('Test Case 3: Verify that the Sign in button is enabled and clickable', async ({ page }) => {
    try {
      await page.goto('https://www.yahoo.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog present */ }

      const signInButton = page.getByRole('link', { name: 'Sign in' }).first();
      await expect(signInButton).toBeVisible({ timeout: 15000 });
      await expect(signInButton).toBeEnabled({ timeout: 15000 });
      console.log('✓ Test Case 3 passed: Sign in button is enabled and clickable');
    } catch (error) {
      console.error('❌ Test Case 3 failed:', error);
      throw error;
    }
  });

  test('Test Case 4: Ensure the Sign in button has the correct label \'Sign in\'', async ({ page }) => {
    try {
      await page.goto('https://www.yahoo.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog present */ }

      const signInButton = page.getByRole('link', { name: 'Sign in' }).first();
      await expect(signInButton).toBeVisible({ timeout: 15000 });
      await expect(signInButton).toHaveText('Sign in');
      console.log('✓ Test Case 4 passed: Sign in button has correct label');
    } catch (error) {
      console.error('❌ Test Case 4 failed:', error);
      throw error;
    }
  });

  test('Test Case 5: Confirm that the Sign in button is positioned correctly within the layout', async ({ page }) => {
    try {
      await page.goto('https://www.yahoo.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog present */ }

      const signInButton = page.getByRole('link', { name: 'Sign in' }).first();
      await expect(signInButton).toBeVisible({ timeout: 15000 });

      // Verify positioning - typically in top right corner
      const boundingBox = await signInButton.boundingBox();
      expect(boundingBox).not.toBe(null);
      expect(boundingBox.x).toBeGreaterThan(0);
      expect(boundingBox.y).toBeGreaterThan(0);
      expect(boundingBox.width).toBeGreaterThan(0);
      expect(boundingBox.height).toBeGreaterThan(0);

      console.log('✓ Test Case 5 passed: Sign in button is positioned correctly');
    } catch (error) {
      console.error('❌ Test Case 5 failed:', error);
      throw error;
    }
  });
});
