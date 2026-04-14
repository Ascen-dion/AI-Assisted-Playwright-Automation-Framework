// === FILE: src/tests/starhub-broadband-nav-automated.spec.js ===
const { test, expect } = require('@playwright/test');
const StarhubBroadbandNavPage = require('../../pages/starhub-broadband-nav.page');

test.describe('[UI] AC6: Broadband Tab Navigation to Broadband Overview', { tag: ['@smoke', '@regression'] }, () => {
  let broadbandNavPage;

  test.beforeEach(async ({ page }) => {
    broadbandNavPage = new StarhubBroadbandNavPage(page);
    await broadbandNavPage.goto();
    await broadbandNavPage.dismissCookieConsent();
  });

  test('[C504] Test Case 6: Navigate to Broadband overview via Broadband dropdown', async ({ page }) => {
    // Act
    await broadbandNavPage.openBroadbandDropdown();
    await broadbandNavPage.clickBroadbandOverview();

    // Assert — URL navigates to Broadband overview page
    await expect(page).toHaveURL('https://www.starhub.com/personal/broadband.html', { timeout: 15000 });

    // Assert — page title confirms correct destination
    await expect(page).toHaveTitle(/broadband/i, { timeout: 15000 });
  });
});
