// === FILE: src/web/tests/nav/sunlife-careers.spec.js ===
/**
 * ED-88 — Careers
 * Verifies the "Careers" utility nav link is visible on the Sun Life PH homepage
 * and points to the correct careers URL.
 *
 * TestRail: C1862, C1863
 */

const { test, expect }  = require('../../../shared/fixtures');
const SunLifeHomePage   = require('../../pages/sunlife-homepage.page');
const TD                = require('../../../shared/data/test-data');

test.describe.configure({ mode: 'serial' }); // MANDATORY — prevents Kasada rate limiting

test.describe('[UI] ED-88: Careers link visibility on homepage', { tag: ['@smoke'] }, () => {
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

  test('[C1862] Test Case 1: Verify Careers link is visible in the utility nav on the homepage', async ({ page }) => {
    const isVisible = await homePage.isCareersLinkVisible();
    expect(isVisible).toBe(true);
  });

  test('[C1863] Test Case 2: Verify Careers link points to the careers page', async ({ page }) => {
    const href = await homePage.getCareersLinkHref();
    expect(href).toContain(TD.sunlife.urls.careers.replace('https://www.sunlife.com.ph', ''));
  });
});
