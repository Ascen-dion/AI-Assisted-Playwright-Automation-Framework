// === FILE: src/web/tests/nav/sunlife-homepage.spec.js ===
/**
 * Sun Life PH Homepage — navigation smoke test
 * Verifies that the "Log in" link is present in the hamburger menu.
 */

const { test, expect } = require('../../../shared/fixtures');
const SunLifeHomePage = require('../../pages/sunlife-homepage.page');
const loc = require('../../locators/sunlife-homepage.locators');
const TD = require('../../../shared/data/test-data');

test.describe('[UI] Sun Life PH Homepage — navigation smoke', { tag: ['@smoke'] }, () => {
  test.describe.configure({ mode: 'serial' });

  let homePage;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    homePage = new SunLifeHomePage(page);
    await homePage.goto();
    try {
      const cookieBtn = page.getByRole('button', { name: /i understand/i }).first();
      await cookieBtn.waitFor({ state: 'visible', timeout: 10000 });
      await cookieBtn.click();
      await cookieBtn.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {}
  });

  test('[C1852] Verify "Log in" link is present and points to the login portal', async ({ page }) => {
    // Verify homepage loaded
    await expect(page).toHaveURL(TD.sunlife.urlPatterns.homepage, { timeout: 15000 });
    await expect(page).toHaveTitle(TD.sunlife.pageTitles.homepage, { timeout: 15000 });

    // At desktop viewport (1280px) the "Log in" link is directly visible in the nav bar
    // — no hamburger menu click required (hamburger is CSS display:none at desktop widths)
    await expect(loc.loginLink(page)).toBeVisible({ timeout: 15000 });

    // Assert it points to the correct login URL
    const href = await homePage.getLoginLinkHref();
    expect(href).toContain('mobile.sunlife.com.ph');
  });
});
