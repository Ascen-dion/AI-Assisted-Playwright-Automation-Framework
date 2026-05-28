// === FILE: src/web/locators/medtronic-our-impact.locators.js ===
/**
 * Locators for the Medtronic India Our Impact page.
 *
 * Target: https://www.medtronic.com/in-en/our-impact.html
 *
 * Selector strategy:
 *   1. ARIA role + accessible name
 *   2. Visible text
 *   3. Stable CSS selector
 */

const locators = {
  /** Health Equity navigation link */
  healthEquityLink: (page) =>
    page.getByRole('link', { name: /Health Equity/i }).first(),

  /** Inclusion, Diversity & Equity navigation link */
  inclusionDiversityLink: (page) =>
    page.getByRole('link', { name: /Inclusion.*Diversity/i }).first(),

  /** Planet / Protecting Our Planet navigation link */
  planetLink: (page) =>
    page.getByRole('link', { name: /Planet|Protecting Our Planet/i }).first(),

  /** Communities navigation link */
  communitiesLink: (page) =>
    page.getByRole('link', { name: /Communities/i }).first(),
};

module.exports = locators;
