const { test, expect } = require('@playwright/test');
const Ed68Page = require('../pages/ed-68.page');

test.describe('[UI] Verify welcome message on E-Shop homepage', () => {
  let pageEd68Page;

  test.beforeEach(async ({ page }) => {
    pageEd68Page = new Ed68Page(page);
    await pageEd68Page.goto();
    // Dismiss cookie / consent dialogs
    try { 
      await page.getByRole('button', { name: /accept|agree|consent|got it/i }).first().click({ timeout: 3000 }); 
      await page.waitForTimeout(1000);
    } catch (e) {}
  });

  test('Test Case 1: Verify page loads successfully', async ({ page }) => {
    try {
      await pageEd68Page.goto();
      await expect(page).toHaveURL(/ecomm-frontend-dvcdhygrandkdyhm/);
      await expect(page).toHaveTitle(/E-Shop/);
      console.log('✓ Page loads successfully');
    } catch (error) {
      console.error('❌ Test Case 1 failed:', error);
      throw error;
    }
  });

  test('Test Case 2: Verify welcome message text', async ({ page }) => {
    try {
      const titleText = await pageEd68Page.getHeroTitleText();
      expect(titleText).toBe('Welcome to E-Shop');
      console.log('✓ Welcome message text is correct');
    } catch (error) {
      console.error('❌ Test Case 2 failed:', error);
      throw error;
    }
  });

  test('Test Case 3: Verify welcome message visibility and location', async ({ page }) => {
    try {
      const isVisible = await pageEd68Page.isWelcomeMessageVisible();
      expect(isVisible).toBe(true);
      
      const isAboveFold = await pageEd68Page.isWelcomeMessageAboveFold();
      expect(isAboveFold).toBe(true);
      
      console.log('✓ Welcome message is visible and above fold');
    } catch (error) {
      console.error('❌ Test Case 3 failed:', error);
      throw error;
    }
  });
});