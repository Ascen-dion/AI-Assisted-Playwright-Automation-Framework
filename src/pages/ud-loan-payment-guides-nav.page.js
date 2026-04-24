// === FILE: src/pages/ud-loan-payment-guides-nav.page.js ===
/**
 * Page object for the Loan Payment Guides nav dropdown.
 *
 * Covers:
 *   - Opening the Loan Payment Guides dropdown from any page on the site
 *   - Clicking through to UD Loans and UD Cash Loans guide pages
 */

const BasePage = require('./base.page');
const loc = require('./locators/ud-loan-payment-guides-nav.locators');

const HOMEPAGE_URL = 'https://uniondigitalbank.io/en';

class UdLoanPaymentGuidesNavPage extends BasePage {
  /**
   * Navigate to the UnionDigital Bank homepage.
   */
  async goto() {
    await super.goto(HOMEPAGE_URL);
  }

  /**
   * Click the "Loan Payment Guides" nav trigger to reveal the dropdown.
   */
  async clickLoanPaymentGuidesNav() {
    await loc.loanPaymentGuidesNavTrigger(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.loanPaymentGuidesNavTrigger(this.page).click();
  }

  /**
   * Click "UD Loans" inside the Loan Payment Guides dropdown.
   * Call clickLoanPaymentGuidesNav() first to open the dropdown.
   */
  async clickUdLoansLink() {
    await loc.udLoansLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.udLoansLink(this.page).click();
  }

  /**
   * Click "UD Cash Loans" inside the Loan Payment Guides dropdown.
   * Call clickLoanPaymentGuidesNav() first to open the dropdown.
   */
  async clickUdCashLoansLink() {
    await loc.udCashLoansLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.udCashLoansLink(this.page).click();
  }

  /**
   * Full flow: open dropdown → click UD Loans.
   */
  async navigateToUdLoans() {
    await this.clickLoanPaymentGuidesNav();
    await this.clickUdLoansLink();
  }
}

module.exports = UdLoanPaymentGuidesNavPage;
