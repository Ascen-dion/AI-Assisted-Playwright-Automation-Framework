// === FILE: src/tests/starhub-entertainment-nav-automated.spec.js ===
const { test, expect } = require('@playwright/test');
const StarhubEntertainmentNavPage = require('../../pages/starhub-entertainment-nav.page');

test.describe('[UI] AC7: Entertainment Tab Navigation to Entertainment Overview', { tag: ['@smoke', '@regression'] }, () => {
  let entertainmentNavPage;

  test.beforeEach(async ({ page }) => {
    entertainmentNavPage = new StarhubEntertainmentNavPage(page);
    await entertainmentNavPage.goto();
    await entertainmentNavPage.dismissCookieConsent();
  });

  test('[C536] Test Case 7: Navigate to Entertainment overview via Entertainment dropdown', async ({ page }) => {
    // Act
    await entertainmentNavPage.openEntertainmentDropdown();
    await entertainmentNavPage.clickEntertainmentOverview();

    // Assert — URL navigates to Entertainment overview page
    await expect(page).toHaveURL('https://www.starhub.com/personal/tvplus/passes.html', { timeout: 15000 });

    // Assert — page title confirms correct destination
    await expect(page).toHaveTitle(/entertainment|tv\+/i, { timeout: 15000 });
  });
});
