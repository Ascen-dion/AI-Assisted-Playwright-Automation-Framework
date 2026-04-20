// === FILE: src/pages/locators/ocbc-accounts-nav.locators.js ===
/**
 * Locators for OCBC Accounts navigation dropdown.
 * Selectors to be confirmed via live DOM inspection (Phase 4).
 */
const locators = {
  accountsTab: (page) => page.getByRole('button', { name: /Accounts/i }).first(),
  savingsAccountsLink: (page) => page.getByRole('link', { name: /Savings Accounts/i }).first(),
  currentAccountsLink: (page) => page.getByRole('link', { name: /Current Accounts/i }).first(),
  fixedDepositsLink: (page) => page.getByRole('link', { name: /Fixed Deposits/i }).first(),
  account360Link: (page) => page.getByRole('link', { name: /360 Account/i }).first(),
  compareAccountsLink: (page) => page.getByRole('link', { name: /Compare Accounts/i }).first(),
};

module.exports = locators;
