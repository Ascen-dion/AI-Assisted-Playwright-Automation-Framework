const { test, expect } = require('@playwright/test');

test.describe('ED-12 Test Suite', () => {
  test('Verify User Can Open Facebook Website', async ({ page }) => {
    try {
      // Navigate with timeout
      await page.goto('https://www.endpointclinical.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Verify H1 element contains required keywords
      const h1Element = page.locator('h1').first();
      await expect(h1Element).toBeVisible({ timeout: 15000 });
      
      const textContent = await h1Element.textContent();
      const keywords = ['hidden', 'advantage', 'RTSM'];
      
      keywords.forEach(keyword => {
        expect(textContent).toContain(keyword);
      });

      console.log('✓ Test passed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});