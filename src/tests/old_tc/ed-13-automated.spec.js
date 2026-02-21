const { test, expect } = require('@playwright/test');

test.describe('User Access to Facebook Website', () => {
  test('Verify User Access to Facebook Website', async ({ page }) => {
    try {
      // Navigate with timeout
      await page.goto('https://www.endpointclinical.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Find H1 element with flexible selectors
      const h1Element = page.locator('h1:has-text("hidden")').first();
      await expect(h1Element).toBeVisible({ timeout: 15000 });
      
      // Verify keywords individually
      await expect(h1Element).toHaveText(/hidden/, { timeout: 15000 });
      await expect(h1Element).toHaveText(/advantage/, { timeout: 15000 });
      await expect(h1Element).toHaveText(/RTSM/, { timeout: 15000 });
      
      console.log('✓ Test passed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});