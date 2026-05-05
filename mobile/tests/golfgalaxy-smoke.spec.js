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

    test('[GG-01] @smoke App launches and Welcome text is displayed at the top', async ({ device, screen }) => {
      const homePage = new GolfGalaxyHomePage(device, screen);
      await homePage.goto();

      await expect(homePage.welcomeText())
        .toBeVisible({ timeout: TD.timeouts.appLaunch });

      await expect(homePage.welcomeText())
        .toHaveText(TD.home.welcomeText);
    });

  });

});
