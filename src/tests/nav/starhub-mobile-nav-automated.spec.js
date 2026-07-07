// === FILE: src/tests/nav/starhub-mobile-nav-automated.spec.js ===
/**
 * [UI] StarHub Mobile Navigation - Verify navigation to mobile devices listing
 *
 * Target URL: https://www.starhub.com/personal.html
 * TestRail Case: C626
 * 
 * Test verifies successful navigation from StarHub homepage to the mobile devices
 * listing page via the Mobile dropdown menu.
 */
const { test, expect } = require('../../fixtures');
const StarhubMobileNavPage = require('../../pages/starhub-mobile-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] StarHub Mobile Navigation', { tag: ['@smoke'] }, () => {
  let pageObj;

  test.beforeEach(async ({ page }) => {
    pageObj = new StarhubMobileNavPage(page);
    await pageObj.goto();
    // Cookie consent is handled by globalSetup — do NOT call dismissCookieConsent() here
  });

  test('[C626] Test Case 1: Verify successful navigation to mobile devices listing page from StarHub homepage', async ({ page }) => {
    // Given: User is on the StarHub homepage
    // When: User hovers over the "Mobile" navigation button to open the dropdown
    await pageObj.openMobileDropdown();

    // And: User clicks the "All Phones" link
    await pageObj.clickAllPhones();

    // Wait for navigation to complete — consumer.starhub.com is a heavy React SPA
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Then: URL must resolve to the All Phones device listing page
    await expect(page).toHaveURL(TD.urlPatterns.allPhones, { timeout: 15000 });

    // And: Page title must match device listing page title
    await expect(page).toHaveTitle(/mobile phones|buy new mobile|devices/i, { timeout: 15000 });

    // And: Device listing page must display the item count (e.g. "40 items")
    const listingVisible = await pageObj.isDeviceListingPageDisplayed();
    expect(listingVisible).toBe(true);

    // And: Listing must show at least one device (count contains a number)
    const itemCountText = await pageObj.getDeviceItemCountText();
    expect(itemCountText).toMatch(TD.deviceListing.itemCountRegex);
  });

  test('[C627] Test Case 2: Verify user can select Samsung Galaxy A57 5G from All Phones listing and view device details', async ({ page }) => {
    // Given: User is on the StarHub homepage
    // When: User navigates to All Phones listing
    await pageObj.openMobileDropdown();
    await pageObj.clickAllPhones();

    // Wait for navigation to complete — consumer.starhub.com is a heavy React SPA
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // And: User clicks on Samsung Galaxy A57 5G device card
    await pageObj.clickGalaxyA57();
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    // Then: URL must resolve to the Galaxy A57 5G product detail page
    await expect(page).toHaveURL(TD.urlPatterns.galaxyA57, { timeout: 15000 });

    // And: Device details page must display the product breadcrumb title
    const pdpDisplayed = await pageObj.isGalaxyA57PDPDisplayed();
    expect(pdpDisplayed).toBe(true);
  });
});
