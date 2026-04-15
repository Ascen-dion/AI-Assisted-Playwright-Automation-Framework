// === FILE: src/tests/nav/starhub-enterprise-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const StarhubPersonalNavPage = require('../../pages/starhub-personal-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] AC12: Enterprise Link Top Navigation', { tag: ['@smoke', '@regression'] }, () => {
  let pageObj;

  test.beforeEach(async ({ page }) => {
    pageObj = new StarhubPersonalNavPage(page);
    await pageObj.goto();
    try {
      await page.getByRole('button', { name: /got it/i }).first().click({ timeout: 3000 });
    } catch {}
  });

  test('[C584] Test Case 12: Navigate to Enterprise page via Enterprise link in top navigation', async ({ page }) => {
    // Act
    await pageObj.clickEnterpriseLink();

    // Assert — URL navigates to Enterprise (business) page
    await expect(page).toHaveURL(TD.urls.enterprise, { timeout: 15000 });

    // Assert — page title confirms correct destination
    await expect(page).toHaveTitle(TD.pageTitles.enterprise, { timeout: 15000 });
  });
});
