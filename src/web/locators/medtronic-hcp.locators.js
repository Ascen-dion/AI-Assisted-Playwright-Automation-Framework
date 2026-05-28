// === FILE: src/web/locators/medtronic-hcp.locators.js ===
/**
 * Locators for the Medtronic India Healthcare Professionals page.
 *
 * Target: https://www.medtronic.com/in-en/healthcare-professionals.html
 *
 * Selector strategy:
 *   1. ARIA role + accessible name
 *   2. Visible text
 *   3. Stable CSS selector
 */

const locators = {
  /** Main heading or hero content on the HCP page */
  mainHeading: (page) =>
    page.locator('h1, h2').first(),

  /** "Therapies & procedures" link in the main content area */
  therapiesHeading: (page) =>
    page.getByRole('link', { name: /Therapies & procedures/i }).first(),
};

module.exports = locators;
