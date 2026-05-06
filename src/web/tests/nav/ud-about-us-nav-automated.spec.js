// === FILE: src/tests/nav/ud-about-us-nav-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const UdAboutUsNavPage = require('../../pages/ud-about-us-nav.page');
const TD = require('../../data/test-data');

test.describe('[UI] ED-80: About Us page navigation', { tag: ['@smoke', '@regression'] }, () => {
  let pageObj;

  test.beforeEach(async ({ page }) => {
    pageObj = new UdAboutUsNavPage(page);
    await pageObj.goto();
    try { await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 }); } catch {}
  });

  test('[C361] Test Case 1: Navigate to About Us page via top navigation bar', async ({ page }) => {
    await pageObj.clickAboutUsNav();
    await expect(page).toHaveURL(TD.urlPatterns.aboutUs, { timeout: 15000 });
    await expect(page).toHaveTitle(TD.pageTitles.aboutUs);
  });

  test('[C362] Test Case 2: Verify About Us page displays hero heading', async ({ page }) => {
    await pageObj.gotoAboutUs();
    try { await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 }); } catch {}
    await expect(page.getByRole('heading', { name: TD.aboutUsPage.heroHeading })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('heading', { name: TD.aboutUsPage.valuesHeading })).toBeVisible({ timeout: 15000 });
  });
});
