// === FILE: src/bdd/steps/common.steps.js ===
/**
 * Common Step Definitions — shared Given/When/Then steps reusable across all StarHub features.
 *
 * This file contains step definitions for:
 * - Navigation (navigating to pages)
 * - Cookie consent handling
 * - Generic assertions (visibility, text, URL, title)
 *
 * Domain-specific steps should NOT be placed here.
 * Instead, create a dedicated step file under src/bdd/steps/<domain>/<feature>.steps.js
 */

const { Given, When, Then } = require('../support/fixtures');
const { expect } = require('@playwright/test');

// ──────────────────────────────────────────────────────────
// GIVEN — Preconditions / Navigation
// ──────────────────────────────────────────────────────────

Given('the user navigates to the StarHub home page', async ({ starhubPage }) => {
  await starhubPage.gotoHome();
});

Given('the user navigates to {string}', async ({ page }, url) => {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
});

Given('the cookie consent is dismissed', async ({ starhubPage }) => {
  await starhubPage.dismissCookieConsent();
});

// ──────────────────────────────────────────────────────────
// WHEN — Actions
// ──────────────────────────────────────────────────────────

When('the user clicks the {string} top nav link', async ({ starhubPage }, linkName) => {
  await starhubPage.clickTopNavLink(linkName);
});

When('the user clicks the {string} menu button', async ({ starhubPage }, buttonName) => {
  await starhubPage.clickMainNavButton(buttonName);
});

When('the user clicks the StarHub logo', async ({ page }) => {
  await page.locator('nav').locator('a').first().click();
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
});

When('the user waits for the page to load', async ({ page }) => {
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
});

// ──────────────────────────────────────────────────────────
// THEN — Assertions
// ──────────────────────────────────────────────────────────

Then('the page title should contain {string}', async ({ page }, expectedTitle) => {
  await expect(page).toHaveTitle(new RegExp(expectedTitle, 'i'));
});

Then('the page URL should contain {string}', async ({ page }, urlPart) => {
  await expect(page).toHaveURL(new RegExp(urlPart));
});
