// === FILE: mobile/tests/golfgalaxy-smoke.spec.js ===
/**
 * Golf Galaxy Android — Smoke Tests
 *
 * Tags:
 *   @smoke      — fast visibility checks; run on every push
 *
 * Requires: Android emulator booted with com.dcsg.golfgalaxy.qa installed.
 * Run:  npx mobilewright test mobile/tests/golfgalaxy-smoke.spec.js
 */
const { test, expect } = require('@mobilewright/test');
const GolfGalaxyHomePage = require('../pages/golfgalaxy-home.page');
const TD = require('../data/golfgalaxy-test-data');

test.use({ platform: 'android', bundleId: TD.app.bundleId });

test.describe('[Mobile][Smoke] Golf Galaxy Android App', () => {
  test.setTimeout(60000);

  // ─────────────────────────────────────────────────────────────────
  // Home Screen
  // ─────────────────────────────────────────────────────────────────
  test.describe('Home Screen', () => {

    test('[C993] @smoke Test Case 1: App launches and Welcome text is visible on top left', async ({ device, screen }) => {
      const homePage = new GolfGalaxyHomePage(device, screen);
      await homePage.goto();

      await expect(homePage.welcomeText())
        .toBeVisible({ timeout: TD.timeouts.appLaunch });

      await expect(homePage.welcomeText())
        .toHaveText(TD.home.welcomeText);
    });

    test('[C994] @smoke Test Case 2: Shop tab is visible below Welcome text', async ({ device, screen }) => {
      const homePage = new GolfGalaxyHomePage(device, screen);
      await homePage.goto();

      await expect(screen.getByText(TD.home.shopTab))
        .toBeVisible({ timeout: TD.timeouts.screenTransition });
    });

    test('[C995] @smoke Test Case 3: Hot Deals tab is visible below Welcome text', async ({ device, screen }) => {
      const homePage = new GolfGalaxyHomePage(device, screen);
      await homePage.goto();

      await expect(screen.getByText(TD.home.hotDealsTab))
        .toBeVisible({ timeout: TD.timeouts.screenTransition });
    });

  });

});
