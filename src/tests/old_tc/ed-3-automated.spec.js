const { test, expect } = require('@playwright/test');

test.describe('Welcome Message Test Suite', () => {
  test('Display Welcome Message on Ascendion Homepage', async ({ page }) => {
    try {
      // Navigate with timeout
      await page.goto('https://www.endpointclinical.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Find H1 element with flexible selector
      const h1Element = page.locator('h1:has-text("hiddenadvantagein RTSM")').first();
      await expect(h1Element).toBeVisible({ timeout: 15000 });
      
      // Verify keywords individually
      const keywords = ['hidden', 'advantage', 'RTSM'];
      for (const keyword of keywords) {
        const keywordLocator = page.locator(`h1:has-text("${keyword}")`).first();
        await expect(keywordLocator).toBeVisible({ timeout: 15000 });
      }
      
      console.log('✓ Test passed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});