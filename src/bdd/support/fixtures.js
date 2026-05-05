// === FILE: src/bdd/support/fixtures.js ===
/**
 * BDD Fixtures — extends playwright-bdd's base test with custom StarHub page objects.
 *
 * This is the single source of Given/When/Then for all step definitions.
 * Step files must import { Given, When, Then } from this file, NOT from
 * playwright-bdd or @cucumber/cucumber directly.
 *
 * Usage in step definitions:
 *   const { Given, When, Then } = require('../support/fixtures');
 *
 *   Given('the user navigates to the StarHub home page', async ({ starhubPage }) => {
 *     await starhubPage.gotoHome();
 *   });
 */

const { test: base, createBdd } = require('playwright-bdd');
const StarHubPage = require('../../pages/starhub.page');

// Extend the base playwright-bdd test with custom page object fixtures
const test = base.extend({
  starhubPage: async ({ page }, use) => {
    const starhubPage = new StarHubPage(page);
    await use(starhubPage);
  },
});

// Create Given/When/Then bound to the custom test (with fixtures)
const { Given, When, Then } = createBdd(test);

module.exports = { test, Given, When, Then };
