// === FILE: src/bdd/steps/navigation/navigation.steps.js ===
/**
 * Navigation Step Definitions — steps specific to StarHub website navigation.
 *
 * Common navigation and assertion steps are in ../common.steps.js.
 */

const { Then } = require('../../support/fixtures');
const { expect } = require('@playwright/test');

// ──────────────────────────────────────────────────────────
// THEN — Navigation-specific assertions
// ──────────────────────────────────────────────────────────

Then('the {string} link should be visible in the navigation', async ({ starhubPage }, linkName) => {
  const visible = await starhubPage.isSupportLinkVisible();
  expect(visible).toBe(true);
});
