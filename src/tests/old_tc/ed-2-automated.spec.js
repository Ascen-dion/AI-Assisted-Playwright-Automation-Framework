const { test, expect } = require('@playwright/test');

test.describe('ED-2 Test Suite', () => {
  test('Add “Your hidden advantage in RTSM” headline', async ({ page }) => {
    try {
      // Navigate with timeout
      await page.goto('https://www.endpointclinical.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Verify the H1 element contains the required keywords
      const h1Element = page.locator('h1').first();
      await expect(h1Element).toBeVisible({ timeout: 15000 });
      
      const h1Text = await h1Element.innerText();
      expect(h1Text).toContain('hidden');
      expect(h1Text).toContain('advantage');
      expect(h1Text).toContain('RTSM');
      
      console.log('✓ Test passed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});