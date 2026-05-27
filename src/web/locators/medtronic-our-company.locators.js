// === FILE: src/web/locators/medtronic-our-company.locators.js ===
/**
 * Locators for the Medtronic India Our Company page.
 *
 * Target: https://www.medtronic.com/in-en/our-company.html
 *
 * Selector strategy:
 *   1. ARIA role + accessible name
 *   2. Visible text
 *   3. Stable CSS selector
 */

const locators = {
  /** Mission link in the company nav */
  missionLink: (page) =>
    page.getByRole('link', { name: /^Mission$/i }).first(),

  /** Leadership link */
  leadershipLink: (page) =>
    page.getByRole('link', { name: /^Leadership$/i }).first(),

  /** Key Facts link */
  keyFactsLink: (page) =>
    page.getByRole('link', { name: /^Key Facts$/i }).first(),

  /** History link */
  historyLink: (page) =>
    page.getByRole('link', { name: /^History$/i }).first(),

  /** Medtronic in India link */
  medtronicIndiaLink: (page) =>
    page.getByRole('link', { name: /Medtronic in India/i }).first(),

  /** Research & Development (MEIC) link */
  meicLink: (page) =>
    page.getByRole('link', { name: /Research & Development|MEIC/i }).first(),

  /** Careers link */
  careersLink: (page) =>
    page.getByRole('link', { name: /^Careers$/i }).first(),
};

module.exports = locators;
