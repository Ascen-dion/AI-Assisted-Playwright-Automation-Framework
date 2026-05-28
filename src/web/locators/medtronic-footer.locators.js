// === FILE: src/web/locators/medtronic-footer.locators.js ===
/**
 * Locators for the Medtronic India footer legal links.
 *
 * Target: https://www.medtronic.com/in-en/index.html (footer)
 *
 * Selector strategy:
 *   1. ARIA role + accessible name
 *   2. Visible text
 *   3. Stable CSS selector
 */

const locators = {
  /** Footer Privacy Statement link */
  privacyStatementLink: (page) =>
    page.getByRole('link', { name: /Privacy Statement/i }).first(),

  /** Footer Terms of Use link */
  termsOfUseLink: (page) =>
    page.getByRole('link', { name: /Terms of Use/i }).first(),

  /** Footer Contact link */
  contactLink: (page) =>
    page.getByRole('link', { name: /^Contact$/i }).first(),
};

module.exports = locators;
