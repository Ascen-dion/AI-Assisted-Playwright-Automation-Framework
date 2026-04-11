const { test, expect } = require('@playwright/test');
const StarHubMobileNavPage = require('../pages/starhub-mobile-nav.page');

test.describe('[UI] AC1: Navigate to Mobile Devices Listing', () => {
  let navPage;

  test.beforeEach(async ({ page }) => {
    navPage = new StarHubMobileNavPage(page);
    await navPage.goto();
    try {
      await page.getByRole('button', { name: /got it/i }).first().click({ timeout: 3000 });
    } catch { /* consent already dismissed */ }
  });

  test('AC1: Navigating Mobiles > All Phones displays the device listing page', async ({ page }) => {
    try {
      await navPage.clickAllPhones();
      console.log('✓ Clicked All Phones in the Mobile nav dropdown');

      const isLoaded = await navPage.isDeviceListingLoaded();
      expect(isLoaded).toBe(true);
      console.log('✓ Device listing page loaded — URL and device items confirmed visible');

      await expect(page).toHaveURL(/mobile|phone/i);
      console.log('✓ URL confirms navigation to mobile devices listing');
    } catch (error) {
      console.error('✗ AC1 failed:', error.message);
      throw error;
    }
  });
});
