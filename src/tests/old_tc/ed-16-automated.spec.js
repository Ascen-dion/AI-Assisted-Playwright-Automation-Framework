const { test, expect } = require('@playwright/test');

test.describe('Facebook Access Test Suite', () => {
  test('Test Case 1: [UI] Verify access to Facebook website', async ({ page }) => {
    try {
      // Navigate with timeout
      await page.goto('https://www.facebook.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Find elements with flexible selectors
      const element = page.locator('text="Facebook"').first();
      await expect(element).toBeVisible({ timeout: 15000 });
      
      console.log('✓ Test passed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});