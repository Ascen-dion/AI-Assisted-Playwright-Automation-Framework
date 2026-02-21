const { test, expect } = require('@playwright/test');

test.describe('Amazon Website Launch Verification', () => {
  test('Verify Amazon website loads successfully and displays content', async ({ page }) => {
    try {
      // Navigate with timeout
      await page.goto('https://www.endpointclinical.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      
      // Verify page loads successfully
      expect(page.url()).toBe('https://www.endpointclinical.com');

      // Check for Amazon logo
      const logo = page.locator('text="Amazon"').first();
      await expect(logo).toBeVisible({ timeout: 15000 });

      // Check for navigation menu
      const navMenu = page.locator('text="Navigation"').first(); // Adjust text as necessary
      await expect(navMenu).toBeVisible({ timeout: 15000 });

      // Check page load time (not directly testable, but can be inferred)
      const startTime = Date.now();
      await page.reload();
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Check if page loads within 3 seconds

      // Test responsiveness on mobile viewport
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile size
      await page.goto('https://www.endpointclinical.com', { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      });
      await expect(logo).toBeVisible({ timeout: 15000 });
      await expect(navMenu).toBeVisible({ timeout: 15000 });

      console.log('✓ Test passed');
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  });
});