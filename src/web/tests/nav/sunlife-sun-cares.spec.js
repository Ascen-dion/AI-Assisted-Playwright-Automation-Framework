// === FILE: src/web/tests/nav/sunlife-sun-cares.spec.js ===
/**
 * ED-89 — Sun Cares
 * Verifies the "Sun Cares" utility nav link is visible on the Sun Life PH homepage
 * and points to the correct Sun Cares URL.
 *
 * TestRail: C1981, C1982
 */

const { test, expect }  = require('../../../shared/fixtures');
const SunLifeHomePage   = require('../../pages/sunlife-homepage.page');
const TD                = require('../../../shared/data/test-data');

test.describe.configure({ mode: 'serial' }); // MANDATORY — prevents Kasada rate limiting

test.describe('[UI] ED-89: Sun Cares link visibility on homepage', { tag: ['@smoke'] }, () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {   // Bypass Kasada bot detection
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    homePage = new SunLifeHomePage(page);
    await homePage.goto();
    try {
      await page.getByRole('button', { name: 'Close' }).first().click({ timeout: 10000 });
    } catch {}
  });

  test('[C1981] Test Case 1: Verify Sun Cares link is visible in the utility nav on the homepage', async ({ page }) => {
    const isVisible = await homePage.isSunCaresLinkVisible();
    expect(isVisible).toBe(true);
  });

  test('[C1982] Test Case 2: Verify Sun Cares link points to the Sun Cares page', async ({ page }) => {
    const href = await homePage.getSunCaresLinkHref();
    expect(href).toContain(TD.sunlife.urls.sunCares.replace('https://www.sunlife.com.ph', ''));
  });
});
