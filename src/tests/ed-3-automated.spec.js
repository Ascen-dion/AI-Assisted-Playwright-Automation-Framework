const { test, expect } = require('@playwright/test');

test.describe('ED-3: Ascendion Homepage Tests', () => {
  
  test('Test Case 1: [UI] Display Welcome Message on Ascendion Homepage', async ({ page }) => {
    try {
      console.log('Starting test for Ascendion Homepage...');
      
      // Navigate to the target URL with networkidle
      await page.goto('https://ascendion.com', { 
        waitUntil: 'networkidle', 
        timeout: 60000 
      });
      console.log('✓ Navigated to Ascendion Homepage.');

      // Verify the welcome message text is visible
      const welcomeMessage = page.locator('text="AI is Everywhere. Value Isn\'t—Until You Engineer It."');
      await expect(welcomeMessage).toBeVisible({ timeout: 15000 });
      console.log('✓ Welcome message is visible on the homepage.');

      // Verify page title contains Ascendion
      const title = await page.title();
      expect(title).toContain('Ascendion');
      console.log(`✓ Page title verified: ${title}`);

    } catch (error) {
      console.error('❌ Error during test execution:', error);
      throw error;
    }
  });
});