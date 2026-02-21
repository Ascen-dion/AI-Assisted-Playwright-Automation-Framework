const { test, expect } = require('@playwright/test');

test.describe('Google Homepage Access Test Suite', () => {
  test('Test Case 1: [UI] Verify access to Google homepage', async ({ page }) => {
    try {
      // Navigate with timeout
      await page.goto('https://www.google.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Wait for the logo to be visible
      const logo = page.locator('text="Google"').first();
      await expect(logo).toBeVisible({ timeout: 15000 });
      
      console.log('✓ Test passed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});