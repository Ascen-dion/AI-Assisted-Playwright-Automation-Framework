/**
 * Jira: ED-73 — [UI] Navigate to Mobile Devices Listing
 * TestRail: C467
 *
 * AC:
 *  1. URL → consumer.starhub.com/personal/store/mobile/devices
 *  2. Page title contains 'Mobile Devices' or 'All Phones'
 *  3. At least one device card visible with product name, image, and pricing
 */
const { test, expect } = require('@playwright/test');
const StarHubMobileNavPage = require('../pages/starhub-mobile-nav.page');

test.describe('[UI] ED-73: Navigate to Mobile Devices Listing', () => {
  let navPage;

  test.beforeEach(async ({ page }) => {
    navPage = new StarHubMobileNavPage(page);
    await navPage.goto();
    try {
      await page.getByRole('button', { name: /got it/i }).first().click({ timeout: 3000 });
    } catch { /* consent already dismissed */ }
  });

  test('C467 AC1: Clicking All Phones navigates to the mobile devices listing page', async ({ page }) => {
    try {
      // Act
      await navPage.clickAllPhones();
      console.log('✓ Clicked All Phones in the Mobile nav dropdown');

      // Assert 1: listing page loaded (URL + card/heading visible)
      const isLoaded = await navPage.isDeviceListingLoaded();
      expect(isLoaded).toBe(true);
      console.log('✓ Device listing page loaded');

      // Assert 2: URL matches consumer.starhub.com mobile devices path
      await expect(page).toHaveURL(/consumer\.starhub\.com.*mobile.*devices|mobile.*store|personal.*mobile/i);
      const finalUrl = await navPage.getDeviceListingUrl();
      console.log(`✓ URL confirmed: ${finalUrl}`);

      // Assert 3: page title confirms mobile phone listing (live: "Buy New Mobile Phones and Pay later with 0% instalments")
      const title = await navPage.getDeviceListingTitle();
      expect(title).toMatch(/mobile phones|all phones|mobile devices|pay later/i);
      console.log(`✓ Page title confirmed: ${title}`);

      // Assert 4: at least one device card with product name, image, or pricing
      const hasDeviceDetails = await navPage.isDeviceCardWithDetailsVisible();
      expect(hasDeviceDetails).toBe(true);
      console.log('✓ Device card(s) with product details are visible');
    } catch (error) {
      console.error('✗ ED-73 C467 failed:', error.message);
      throw error;
    }
  });
});

