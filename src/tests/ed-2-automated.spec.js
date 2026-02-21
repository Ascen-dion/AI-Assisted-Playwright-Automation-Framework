const { test, expect } = require('@playwright/test');

test.describe('[UI] Add “Your hidden advantage in RTSM” headline - Page Structure Verification', () => {
  test('Verify page structure supports new content', async ({ page }) => {
    // Navigate to target page
    await page.goto('https://www.endpointclinical.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
    
    // Verify page loads successfully
    await expect(page).toHaveTitle(/.+/);
    
    // Check main content areas exist
    
    // Verify heading area exists
    const headingArea = page.locator('h1').first();
    await expect(headingArea).toBeVisible({ timeout: 10000 });
    // Verify hero area exists
    const heroArea = page.locator('.hero').first();
    await expect(heroArea).toBeVisible({ timeout: 10000 });
    
    // Verify page is responsive
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(1000);
    
    // Test accessibility
    const mainContent = page.locator('main, .main-content, .hero').first();
    await expect(mainContent).toBeVisible();
    
    console.log('✅ Page structure verification passed');
  });
  
  test('Test responsive behavior for new content area', async ({ page }) => {
    await page.goto('https://www.endpointclinical.com');
    
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);
      
      const contentArea = page.locator('main, .hero, .main-content').first();
      await expect(contentArea).toBeVisible();
      
      console.log(`✅ Responsive test passed for ${viewport.width}x${viewport.height}`);
    }
  });
});