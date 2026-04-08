const { test, expect } = require('@playwright/test');
const PageObject = require('../pages/ed-64.page');

test.describe('ZS.com Logo and Responsive Design Test Suite', () => {
  let pageEd64Page;

  test.beforeEach(async ({ page }) => {
    pageEd64Page = new PageObject(page);
  });

  test('Test Case 1: Navigate to https://www.zs.com/ and verify the page loads successfully', async ({ page }) => {
    try {
      await page.goto('https://www.zs.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

      // Dismiss any consent/cookie dialogs
      try {
        const consentButton = page.getByRole('button', { name: /accept|agree|consent|got it/i }).first();
        await consentButton.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog present */ }

      await expect(page).toHaveURL(/zs\.com/i);
      await expect(page).toHaveTitle(/ZS/i);
      console.log('✓ Page loaded successfully');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 2: Verify the ZS logo is displayed in the header section of the page', async ({ page }) => {
    try {
      await page.goto('https://www.zs.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

      // Dismiss any consent/cookie dialogs
      try {
        const consentButton = page.getByRole('button', { name: /accept|agree|consent|got it/i }).first();
        await consentButton.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog present */ }

      const logo = page.locator('img[alt="ZS Logo"]').first();
      await expect(logo).toBeVisible({ timeout: 15000 });
      console.log('✓ ZS logo is displayed in the header section');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 3: Confirm the ZS logo is clickable and links to the homepage (https://www.zs.com/)', async ({ page }) => {
    try {
      await page.goto('https://www.zs.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

      // Dismiss any consent/cookie dialogs
      try {
        const consentButton = page.getByRole('button', { name: /accept|agree|consent|got it/i }).first();
        await consentButton.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog present */ }

      const logoLink = page.locator('a[href="/"]').first();
      await expect(logoLink).toBeVisible({ timeout: 15000 });

      await logoLink.click();
      await expect(page).toHaveURL(/zs\.com/i);
      console.log('✓ ZS logo is clickable and links to the homepage');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 4: Verify the ZS logo is visible on all screen sizes (desktop, tablet, mobile)', async ({ page }) => {
    try {
      const viewports = [
        { name: 'Desktop', width: 1920, height: 1080 },
        { name: 'Tablet', width: 768, height: 1024 },
        { name: 'Mobile', width: 375, height: 667 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('https://www.zs.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Dismiss any consent/cookie dialogs
        try {
          const consentButton = page.getByRole('button', { name: /accept|agree|consent|got it/i }).first();
          await consentButton.click({ timeout: 5000 });
          await page.waitForTimeout(1000);
        } catch (e) { /* No consent dialog present */ }

        const logo = page.locator('img[alt="ZS Logo"]').first();
        await expect(logo).toBeVisible({ timeout: 15000 });
        console.log(`✓ ZS logo is visible on ${viewport.name} viewport`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 5: Responsive Design Verification', async ({ page }) => {
    try {
      await page.goto('https://www.zs.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

      // Dismiss any consent/cookie dialogs
      try {
        const consentButton = page.getByRole('button', { name: /accept|agree|consent|got it/i }).first();
        await consentButton.click({ timeout: 5000 });
        await page.waitForTimeout(1000);
      } catch (e) { /* No consent dialog present */ }

      const isContentResponsive = await pageEd64Page.isContentVisibleOnAllScreenSizes();
      expect(isContentResponsive).toBe(true);
      console.log('✓ Page content is properly displayed and formatted across all device sizes');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});