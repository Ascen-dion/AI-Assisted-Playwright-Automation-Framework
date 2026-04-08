const { test, expect } = require('@playwright/test');
const Ed63Page = require('../pages/ed-63.page');

test.describe('[UI] Verify ZS logo on homepage', () => {
  let pageEd63Page;

  test.beforeEach(async ({ page }) => {
    pageEd63Page = new Ed63Page(page);
    await pageEd63Page.goto();
    // Dismiss cookie / consent dialogs
    try { 
      await page.getByRole('button', { name: /accept|agree|consent|got it/i }).first().click({ timeout: 3000 }); 
      await page.waitForTimeout(1000);
    } catch (e) {}
  });

  test('Test Case 1: Navigate to https://www.zs.com/ and verify the page loads successfully', async ({ page }) => {
    try {
      await pageEd63Page.goto();
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
      await pageEd63Page.goto();
      const isLogoVisible = await pageEd63Page.isLogoDisplayed();
      expect(isLogoVisible).toBe(true);
      console.log('✓ ZS logo is displayed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 3: Confirm the ZS logo is clickable and links to the homepage (https://www.zs.com/)', async ({ page }) => {
    try {
      await pageEd63Page.goto();
      const isClickable = await pageEd63Page.isLogoClickable();
      expect(isClickable).toBe(true);
      
      const href = await pageEd63Page.getLogoHref();
      expect(href).toMatch(/https:\/\/www\.zs\.com/i);
      
      console.log('✓ ZS logo is clickable and links to homepage');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });

  test('Test Case 4: Verify the ZS logo is visible above the fold without scrolling', async ({ page }) => {
    try {
      await pageEd63Page.goto();
      const isAboveFold = await pageEd63Page.isLogoAboveFold();
      expect(isAboveFold).toBe(true);
      console.log('✓ ZS logo is visible above the fold');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});