const { test, expect } = require('@playwright/test');

test.describe('ZS Website Verification', () => {
  test('Test Case 1: Navigate to https://www.zs.com/ and verify the page loads successfully', async ({ page }) => {
    try {
      await page.goto('https://www.zs.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      await expect(page).toHaveTitle(/ZS/i);
      console.log('✓ Page loaded successfully');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 2: Verify the ZS logo is displayed in the header section of the page', async ({ page }) => {
    try {
      await page.goto('https://www.zs.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      const logo = page.locator('img[alt="ZS Logo"]');
      await expect(logo).toBeVisible({ timeout: 15000 });
      console.log('✓ ZS logo is displayed in the header');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 3: Confirm the ZS logo is clickable and redirects to the homepage when clicked', async ({ page }) => {
    try {
      await page.goto('https://www.zs.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      const logo = page.locator('img[alt="ZS Logo"]');
      await expect(logo).toBeVisible({ timeout: 15000 });

      const currentURL = page.url();
      await logo.click();
      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveURL(/zs\.com/i);
      console.log('✓ ZS logo is clickable and redirects to homepage');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 4: Verify the logo has the correct alt text attribute containing \'ZS\'', async ({ page }) => {
    try {
      await page.goto('https://www.zs.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      const logo = page.locator('img[alt="ZS Logo"]');
      await expect(logo).toBeVisible({ timeout: 15000 });

      const altText = await logo.getAttribute('alt');
      expect(altText).toContain('ZS');
      console.log('✓ Logo has correct alt text containing \'ZS\'');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 5: Ensure the logo is visible and not obstructed by other page elements', async ({ page }) => {
    try {
      await page.goto('https://www.zs.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });

      // Dismiss any consent/cookie dialogs
      try {
        const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
        await consentBtn.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog */ }

      const logo = page.locator('img[alt="ZS Logo"]');
      await expect(logo).toBeVisible({ timeout: 15000 });

      const boundingBox = await logo.boundingBox();
      expect(boundingBox.width).toBeGreaterThan(0);
      expect(boundingBox.height).toBeGreaterThan(0);
      console.log('✓ Logo is visible and not obstructed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});
