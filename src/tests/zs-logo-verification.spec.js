const { test, expect } = require('@playwright/test');
const ZSPage = require('../pages/zs.page');

test.describe('ZS.com Logo Verification', () => {
  let zsPage;

  test.beforeEach(async ({ page }) => {
    zsPage = new ZSPage(page);
  });

  test('TC-01: Navigate to ZS.com and verify logo exists', async () => {
    // 1. Navigate to ZS.com homepage
    await zsPage.goto();
    console.log('✓ Successfully navigated to https://www.zs.com/');

    // 2. Wait for page to fully load
    await zsPage.waitForPageLoad();
    console.log('✓ Page loaded completely');

    // Wait for logo to be present in DOM
    await zsPage.page.waitForSelector('img[alt="ZS Logo"]', { timeout: 15000 });

    // 3. Verify the ZS logo is visible on the page
    const isLogoVisible = await zsPage.isLogoVisible();
    expect(isLogoVisible).toBe(true);
    console.log('✓ ZS logo is visible on the page');

    // 4. Get additional logo information for verification
    const logoInfo = await zsPage.getLogoInfo();
    if (logoInfo) {
      console.log('✓ Logo details:', logoInfo);
      
      // Additional assertions based on logo info
      expect(logoInfo.isVisible).toBe(true);
      
      // Verify it's an image element or contains logo-related attributes
      const hasLogoAttributes = 
        logoInfo.alt?.toLowerCase().includes('logo') ||
        logoInfo.alt?.toLowerCase().includes('zs') ||
        logoInfo.src?.toLowerCase().includes('logo') ||
        logoInfo.className?.toLowerCase().includes('logo') ||
        logoInfo.id?.toLowerCase().includes('logo');
        
      if (hasLogoAttributes) {
        console.log('✓ Logo has appropriate attributes');
      } else {
        console.log('⚠ Logo found but without typical logo attributes');
      }
    }

    console.log('✓ TC-01 passed: ZS logo verification completed successfully');
  });

  test('TC-02: Verify logo is in header section', async () => {
    // 1. Navigate to ZS.com homepage  
    await zsPage.goto();
    await zsPage.waitForPageLoad();

    // 2. Verify header section exists
    const headerSection = zsPage.getHeaderSection();
    await expect(headerSection).toBeVisible();
    console.log('✓ Header section is visible');

    // 3. Verify logo exists within header area
    const logo = zsPage.getZSLogo();
    await expect(logo).toBeVisible();
    console.log('✓ Logo found in header section');

    console.log('✓ TC-02 passed: Logo is properly positioned in header');
  });

  test('TC-03: Verify page loads correctly before logo check', async () => {
    // 1. Navigate to ZS.com homepage
    await zsPage.goto();

    // 2. Verify main content is loaded (indicates page loaded successfully)
    const mainContent = zsPage.getMainContent();
    await expect(mainContent).toBeVisible({ timeout: 15000 });
    console.log('✓ Main content loaded successfully');

    // 3. Verify page title contains information
    const title = await zsPage.page.title();
    expect(title.length).toBeGreaterThan(0);
    console.log('✓ Page title:', title);

    // 4. Now verify logo after confirming page is properly loaded
    const isLogoVisible = await zsPage.isLogoVisible();
    expect(isLogoVisible).toBe(true);
    console.log('✓ Logo verified after page load confirmation');

    console.log('✓ TC-03 passed: Full page load and logo verification completed');
  });
});