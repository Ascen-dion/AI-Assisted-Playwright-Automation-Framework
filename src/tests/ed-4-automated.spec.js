const { test, expect } = require('@playwright/test');

test.describe('Yahoo Homepage Tests', () => {
  test('Verify Sign In Button on Yahoo Homepage', async ({ page }) => {
    try {
      // Navigate with timeout
      await page.goto('https://www.yahoo.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Verify page loads successfully
      expect(page.url()).toBe('https://www.yahoo.com');

      // Check that the Sign in button exists
      const signInButton = page.locator('text="Sign in"').first();
      await expect(signInButton).toBeVisible({ timeout: 15000 });

      // Verify that the Sign in button is enabled and clickable
      await expect(signInButton).toBeEnabled();

      // Ensure the Sign in button has the correct label
      await expect(signInButton).toHaveText('Sign in');

      // Confirm that the Sign in button is positioned correctly within the layout
      const buttonBox = await signInButton.boundingBox();
      console.log('Sign in button position:', buttonBox);

      console.log('✓ Test passed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});