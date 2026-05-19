// === FILE: src/web/tests/nav/sunlife-advisor-list.spec.js ===
/**
 * ED-87 — Advisor list
 * Verifies the "Advisor list" utility nav link is visible on the Sun Life PH homepage
 * and points to the correct corporate governance URL.
 *
 * TestRail: C1860, C1861
 */

const { test, expect }  = require('../../../shared/fixtures');
const SunLifeHomePage   = require('../../pages/sunlife-homepage.page');
const TD                = require('../../../shared/data/test-data');

test.describe.configure({ mode: 'serial' }); // MANDATORY — prevents Kasada rate limiting

test.describe('[UI] ED-87: Advisor list link visibility on homepage', { tag: ['@smoke'] }, () => {
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

  test('[C1860] Test Case 1: Verify Advisor list link is visible in the utility nav on the homepage', async ({ page }) => {
    const isVisible = await homePage.isAdvisorListLinkVisible();
    expect(isVisible).toBe(true);
  });

  test('[C1861] Test Case 2: Verify Advisor list link points to the corporate governance page', async ({ page }) => {
    const href = await homePage.getAdvisorListLinkHref();
    expect(href).toContain(TD.sunlife.urls.advisorList.replace('https://www.sunlife.com.ph', ''));
  });
});
