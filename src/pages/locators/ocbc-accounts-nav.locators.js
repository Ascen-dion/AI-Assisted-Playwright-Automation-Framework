// === FILE: src/pages/locators/ocbc-accounts-nav.locators.js ===
/**
 * Locators for OCBC Accounts navigation dropdown.
 * Selectors to be confirmed via live DOM inspection (Phase 4).
 */
const locators = {
  accountsTab: (page) => page.getByRole('link', { name: /^Accounts$/i }).first(),
  savingsAccountsLink: (page) => page.getByRole('link', { name: /Savings Accounts/i }).first(),
  currentAccountsLink: (page) => page.getByRole('link', { name: /Current Accounts/i }).first(),
  fixedDepositsLink: (page) => page.getByRole('link', { name: /Fixed Deposits/i }).first(),
  account360Link: (page) => page.getByRole('link', { name: /360 Account/i }).first(),
  compareAccountsLink: (page) => page.getByRole('link', { name: /Compare Accounts/i }).first(),

  // 360 Account page — confirmed via live DOM inspection 2026-04-20
  // <a class="button button--primary button--red2 ... d-block" href="#apply-online">Apply online</a>
  applyOnlineButton: (page) => page.getByRole('link', { name: 'Apply online' }).first(),
};

module.exports = locators;
