// === FILE: src/tests/nav/starhub-entertainment-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const StarhubEntertainmentNavPage = require('../../pages/starhub-entertainment-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] AC7: Entertainment Tab Navigation to Entertainment Overview', { tag: ['@smoke', '@skip'] }, () => {
  let entertainmentNavPage;

  test.beforeEach(async ({ page }) => {
    entertainmentNavPage = new StarhubEntertainmentNavPage(page);
    await entertainmentNavPage.goto();
  });

  test('[C536] Test Case 7: Navigate to Entertainment overview via Entertainment dropdown', async ({ page }) => {
    // Act
    await entertainmentNavPage.openEntertainmentDropdown();
    await entertainmentNavPage.clickEntertainmentOverview();

    // Assert — URL navigates to Entertainment overview page
    await expect(page).toHaveURL(TD.urls.entertainment, { timeout: 15000 });

    // Assert — page title confirms correct destination
    await expect(page).toHaveTitle(TD.pageTitles.entertainment, { timeout: 15000 });
  });
});
