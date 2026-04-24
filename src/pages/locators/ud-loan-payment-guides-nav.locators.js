// === FILE: src/pages/locators/ud-loan-payment-guides-nav.locators.js ===
/**
 * Locators for the Loan Payment Guides nav dropdown on the UnionDigital Bank site.
 *
 * Selector strategy:
 *   1. Visible text (trigger is a div, not an <a> — same pattern as Products nav)
 *   2. Role + accessible name for dropdown links (rendered after trigger click)
 */

const locators = {
  /** Nav trigger div that opens the Loan Payment Guides dropdown */
  loanPaymentGuidesNavTrigger: (page) =>
    page.getByText('Loan Payment Guides').first(),

  /** "UD Loans" dropdown link — visible after clicking the nav trigger */
  udLoansLink: (page) =>
    page.getByRole('link', { name: 'UD Loans' }).first(),

  /** "UD Cash Loans" dropdown link — visible after clicking the nav trigger */
  udCashLoansLink: (page) =>
    page.getByRole('link', { name: 'UD Cash Loans' }).first(),
};

module.exports = locators;
