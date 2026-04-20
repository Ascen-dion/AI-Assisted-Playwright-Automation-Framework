// === FILE: src/pages/locators/ocbc-cards-nav.locators.js ===
/**
 * Locators for OCBC Cards navigation dropdown.
 * Selectors to be confirmed via live DOM inspection (Phase 4).
 */
const locators = {
  cardsTab: (page) => page.getByRole('button', { name: /Cards/i }).first(),
  creditCardsLink: (page) => page.getByRole('link', { name: /Credit Cards/i }).first(),
  debitCardsLink: (page) => page.getByRole('link', { name: /Debit Cards/i }).first(),
  card365Link: (page) => page.getByRole('link', { name: /365 Credit Card/i }).first(),
  titaniumRewardsLink: (page) => page.getByRole('link', { name: /Titanium Rewards/i }).first(),
  card90NLink: (page) => page.getByRole('link', { name: /90.*N Card/i }).first(),
  compareCardsLink: (page) => page.getByRole('link', { name: /Compare Cards/i }).first(),
};

module.exports = locators;
