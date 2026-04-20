// === FILE: src/pages/locators/ocbc-gateway-nav.locators.js ===
/**
 * Locators for OCBC gateway page (https://www.ocbc.com/group/gateway).
 * Selectors confirmed via live DOM inspection (Phase 4) on 2026-04-20.
 *
 * DOM evidence:
 *   link "Banking for individuals" [ref=e37] → href="#banking-for-individuals" (nav anchor)
 *   link "Personal Banking " [ref=e146]       → href="https://www.ocbc.com/personal-banking"
 */
const locators = {
  bankingForIndividualsNavLink: (page) =>
    page.getByRole('link', { name: 'Banking for individuals' }).first(),

  personalBankingLink: (page) =>
    page.getByRole('link', { name: /Personal Banking/ }).first(),
};

module.exports = locators;
