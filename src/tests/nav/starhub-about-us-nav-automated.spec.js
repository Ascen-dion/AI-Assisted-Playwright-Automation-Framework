// === FILE: src/tests/nav/starhub-about-us-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const StarhubAboutUsNavPage = require('../../pages/starhub-about-us-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] AC10: About Us Footer Link Navigation', { tag: ['@smoke', '@regression'] }, () => {
  let pageObj;

  test.beforeEach(async ({ page }) => {
    pageObj = new StarhubAboutUsNavPage(page);
    await pageObj.goto();
    try {
      await page.getByRole('button', { name: /got it/i }).first().click({ timeout: 3000 });
    } catch {}
  });

  test('[C573] Test Case 10: Navigate to About Us page via About Us footer link', async ({ page }) => {
    await pageObj.clickAboutUsLink();
    await expect(page).toHaveURL(TD.urlPatterns.aboutUs, { timeout: 15000 });
  });
});
