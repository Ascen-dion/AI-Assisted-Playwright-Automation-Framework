// === FILE: src/pages/locators/ud-products-nav.locators.js ===
/**
 * Locators for UnionDigital Bank Products dropdown navigation.
 *
 * DOM evidence (inspected 2026-04-24):
 *   Products dropdown trigger: <div class="styles_menu_item_anchor__f62GR">Products</div>
 *   Once open, dropdown links become visible:
 *     <a href="/en/products-savings">UD Save</a>
 *     <a href="/en/products-time-deposit">UD Time Deposit</a>
 *     <a href="/en/products-ud-loan-protect-insurance">UD Loan Protect Insurance</a>
 *     <a href="/en/products-inapp-ticket">In App Helpdesk</a>
 *     <a href="/en/product-rates-fees">Rates & Fees</a>
 */
const locators = {
  // ── Products dropdown trigger ──────────────────────────────────────────────
  productsDropdownTrigger: (page) =>
    page.getByText('Products').first(),

  // ── Products dropdown links (visible after clicking trigger) ──────────────
  udSaveLink: (page) =>
    page.getByRole('link', { name: 'UD Save' }).first(),

  udTimeDepositLink: (page) =>
    page.getByRole('link', { name: 'UD Time Deposit' }).first(),

  udLoanProtectLink: (page) =>
    page.getByRole('link', { name: 'UD Loan Protect Insurance' }).first(),

  inAppHelpdeskLink: (page) =>
    page.getByRole('link', { name: 'In App Helpdesk' }).first(),

  ratesAndFeesLink: (page) =>
    page.getByRole('link', { name: 'Rates & Fees' }).first(),
};

module.exports = locators;
