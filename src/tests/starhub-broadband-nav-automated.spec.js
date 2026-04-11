const { test, expect } = require('@playwright/test');
const StarHubBroadbandNavPage = require('../pages/starhub-broadband-nav.page');

test.describe('[UI] Navigate to Mobile Devices Listing', () => {
  let pomPage;

  test.beforeEach(async ({ page }) => {
    pomPage = new StarHubBroadbandNavPage(page);
    await pomPage.goto();
    try { await page.getByRole('button', { name: /accept|agree|consent|got it/i }).first().click({ timeout: 3000 }); } catch (e) {}
  });

  test('Test Case 1: Navigate to Mobile Devices Listing', async ({ page }) => {
    try {
      // Navigate to Mobile Devices Listing
      await pomPage.goto();
      await pomPage.dismissCookieConsent();
      await pomPage.openBroadbandDropdown();
      await pomPage.clickBroadbandPlans();

      console.log('✓ Test Case 1: Navigate to Mobile Devices Listing passed');
    } catch (error) {
      console.error('❌ Test Case 1 failed:', error);
      throw error;
    }
  });

  test('Test Case 2: Verify Page URL', async ({ page }) => {
    try {
      // Navigate to Mobile Devices Listing
      await pomPage.goto();
      await pomPage.dismissCookieConsent();
      await pomPage.openBroadbandDropdown();
      await pomPage.clickBroadbandPlans();

      // Verify Page URL
      await expect(page).toHaveURL(/broadband/i);

      console.log('✓ Test Case 2: Verify Page URL passed');
    } catch (error) {
      console.error('❌ Test Case 2 failed:', error);
      throw error;
    }
  });

  test('Test Case 3: Verify Page Title', async ({ page }) => {
    try {
      // Navigate to Mobile Devices Listing
      await pomPage.goto();
      await pomPage.dismissCookieConsent();
      await pomPage.openBroadbandDropdown();
      await pomPage.clickBroadbandPlans();

      // Verify Page Title
      await expect(page).toHaveTitle(/broadband/i);

      console.log('✓ Test Case 3: Verify Page Title passed');
    } catch (error) {
      console.error('❌ Test Case 3 failed:', error);
      throw error;
    }
  });

  test('Test Case 4: Verify Device Cards Display', async ({ page }) => {
    try {
      // Navigate to Mobile Devices Listing
      await pomPage.goto();
      await pomPage.dismissCookieConsent();
      await pomPage.openBroadbandDropdown();
      await pomPage.clickBroadbandPlans();

      // Verify Device Cards Display
      const deviceCards = page.locator('[class*="device-card"], [class*="product-card"], [class*="card"]');
      await expect(deviceCards).toBeVisible({ timeout: 15000 });

      console.log('✓ Test Case 4: Verify Device Cards Display passed');
    } catch (error) {
      console.error('❌ Test Case 4 failed:', error);
      throw error;
    }
  });
});