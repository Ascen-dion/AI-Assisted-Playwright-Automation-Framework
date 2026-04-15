// === FILE: src/tests/nav/starhub-sme-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const StarhubPersonalNavPage = require('../../pages/starhub-personal-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] AC11: SME Link Top Navigation', { tag: ['@smoke', '@regression'] }, () => {
  let pageObj;

  test.beforeEach(async ({ page }) => {
    pageObj = new StarhubPersonalNavPage(page);
    await pageObj.goto();
  });

  test('[C583] Test Case 11: Navigate to SME page via SME link in top navigation', async ({ page }) => {
    // Act
    await pageObj.clickSMELink();

    // Assert — URL navigates to SME page
    await expect(page).toHaveURL(TD.urls.sme, { timeout: 15000 });

    // Assert — page title confirms correct destination
    await expect(page).toHaveTitle(TD.pageTitles.sme, { timeout: 15000 });
  });
});
