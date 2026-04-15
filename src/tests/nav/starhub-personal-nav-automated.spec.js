// === FILE: src/tests/nav/starhub-personal-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const StarhubPersonalNavPage = require('../../pages/starhub-personal-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] AC9: Personal Link Top Navigation', { tag: ['@skip'] }, () => {
  let pageObj;

  test.beforeEach(async ({ page }) => {
    pageObj = new StarhubPersonalNavPage(page);
    await pageObj.goto();
  });

  test('[C574] Test Case 9: Navigate to Personal page via Personal link in top navigation', async ({ page }) => {
    await pageObj.clickPersonalLink();
    await expect(page).toHaveURL(TD.urls.homepage, { timeout: 15000 });
  });
});
