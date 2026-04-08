const { test, expect } = require('@playwright/test');
const PageObject = require('../pages/ed-63.page');

test.describe('ZS.com Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    const ed63Page = new PageObject(page);
    await ed63Page.goto();
  });

  test('Test Case 1: Navigate to https://www.zs.com/ and verify the page loads successfully', async ({ page }) => {
    try {
      await expect(page).toHaveURL(/zs\.com/i);
      await expect(page).toHaveTitle(/ZS: Global management consulting and technology firm/i);
      console.log('✓ Test Case 1 passed');
    } catch (error) {
      console.error('❌ Test Case 1 failed:', error);
      throw error;
    }
  });

  test('Test Case 2: Verify the ZS logo is displayed in the header section of the page', async ({ page }) => {
    try {
      const ed63Page = new PageObject(page);
      const logoDisplayed = await ed63Page.isLogoDisplayed();
      const logoInHeader = await ed63Page.isLogoInHeader();
      
      expect(logoDisplayed).toBe(true);
      expect(logoInHeader).toBe(true);
      
      console.log('✓ Test Case 2 passed');
    } catch (error) {
      console.error('❌ Test Case 2 failed:', error);
      throw error;
    }
  });

  test('Test Case 3: Confirm the ZS logo is clickable and links to the homepage (https://www.zs.com/)', async ({ page }) => {
    try {
      const ed63Page = new PageObject(page);
      const isClickable = await ed63Page.isLogoClickable();
      
      expect(isClickable).toBe(true);
      
      console.log('✓ Test Case 3 passed');
    } catch (error) {
      console.error('❌ Test Case 3 failed:', error);
      throw error;
    }
  });

  test('Test Case 4: Verify the ZS logo is visible above the fold without scrolling', async ({ page }) => {
    try {
      const ed63Page = new PageObject(page);
      const isAboveFold = await ed63Page.isLogoAboveFold();
      
      expect(isAboveFold).toBe(true);
      
      console.log('✓ Test Case 4 passed');
    } catch (error) {
      console.error('❌ Test Case 4 failed:', error);
      throw error;
    }
  });
});