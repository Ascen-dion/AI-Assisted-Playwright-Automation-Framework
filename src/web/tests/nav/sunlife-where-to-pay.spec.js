// === FILE: src/web/tests/nav/sunlife-where-to-pay.spec.js ===
/**
 * ED-86 — Where to pay
 * Verifies the "Where to pay" utility nav link is visible on the Sun Life PH homepage
 * and points to the correct payment channels URL.
 *
 * TestRail: C1858, C1859
 */

const { test, expect }    = require('../../../shared/fixtures');
const SunLifeHomePage     = require('../../pages/sunlife-homepage.page');
const TD                  = require('../../../shared/data/test-data');

test.describe.configure({ mode: 'serial' }); // MANDATORY — prevents Kasada rate limiting

test.describe('[UI] ED-86: Where to pay link visibility on homepage', { tag: ['@smoke'] }, () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {   // Bypass Kasada bot detection
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    homePage = new SunLifeHomePage(page);
    await homePage.goto();
    try {
      await page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 10000 });
    } catch {}
  });

  test('[C1858] Test Case 1: Verify Where to pay link is visible in the utility nav on the homepage', async ({ page }) => {
    const isVisible = await homePage.isWhereToPayLinkVisible();
    expect(isVisible).toBe(true);
  });

  test('[C1859] Test Case 2: Verify Where to pay link points to the payment channels page', async ({ page }) => {
    const href = await homePage.getWhereToPayLinkHref();
    expect(href).toContain(TD.sunlife.urls.paymentChannels.replace('https://www.sunlife.com.ph', ''));
  });
});
