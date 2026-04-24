// === FILE: src/pages/ud-loans-guide.page.js ===
/**
 * Page object for the UD Loans Payment Guide content page.
 * Target URL: https://uniondigitalbank.io/en/guides-ud-loans
 *
 * Covers ED-74: Validate that the accordion expand "+" icon is visible
 * on the "How To Pay Your UD Loans" section.
 */

const BasePage = require('./base.page');
const loc = require('./locators/ud-loans-guide.locators');

const PAGE_URL = 'https://uniondigitalbank.io/en/guides-ud-loans';

class UdLoansGuidePage extends BasePage {
  /**
   * Navigate directly to the UD Loans Payment Guide page.
   */
  async goto() {
    await super.goto(PAGE_URL);
  }

  /**
   * Returns the page heading element ("UD LOANS PAYMENT GUIDES").
   * Waits for it to be visible before returning.
   */
  async getPageHeading() {
    await loc.pageHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.pageHeading(this.page);
  }

  /**
   * Returns the "How To Pay Your UD Loans" accordion button element.
   * Waits for it to be visible before returning.
   */
  async getHowToPayAccordionButton() {
    await loc.howToPayAccordionButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.howToPayAccordionButton(this.page);
  }

  /**
   * Returns the aria-expanded attribute value of the "How To Pay Your UD Loans"
   * accordion button. Returns 'true' when expanded (showing "-"), 'false' when
   * collapsed (showing "+" icon).
   * @returns {Promise<string>} 'true' or 'false'
   */
  async getHowToPayExpandedState() {
    const btn = await this.getHowToPayAccordionButton();
    return btn.getAttribute('aria-expanded');
  }

  /**
   * Expands the "How To Pay Your UD Loans" accordion by clicking the button.
   * Waits for the accordion to reach expanded state before resolving.
   */
  async expandHowToPayAccordion() {
    const btn = await this.getHowToPayAccordionButton();
    await btn.click();
    await btn.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * ED-76: Returns the UPAY section text element.
   * "2. Pay through your other bank accounts or e-wallets via UPAY."
   * Only visible after the accordion is expanded.
   */
  async getUpaySectionText() {
    await loc.upaySectionText(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.upaySectionText(this.page);
  }

  /**
   * ED-76: Returns the "Click here to pay via UPAY" link element.
   * Only visible after the accordion is expanded.
   */
  async getUpayLink() {
    await loc.upayLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.upayLink(this.page);
  }
}

module.exports = UdLoansGuidePage;
