// === FILE: src/pages/locators/ud-loans-guide.locators.js ===
/**
 * Locators for the UD Loans Payment Guide page content.
 * Target URL: https://uniondigitalbank.io/en/guides-ud-loans
 *
 * ED-74: Validates expand accordion option on the UD Loans Payment Guide page.
 */

const locators = {
  /**
   * Main page heading: "UD LOANS PAYMENT GUIDES"
   * Uses the level-1 heading role for stability.
   */
  pageHeading: (page) =>
    page.getByRole('heading', { name: /UD LOANS PAYMENT GUIDES/i, level: 1 }).first(),

  /**
   * Accordion expand button for "How To Pay Your UD Loans".
   * The element uses data-accordion-component="AccordionItemButton" and role="button".
   * It starts in collapsed state (aria-expanded="false"), showing the "+" icon.
   */
  howToPayAccordionButton: (page) =>
    page
      .locator('[data-accordion-component="AccordionItemButton"]')
      .filter({ hasText: 'How To Pay Your UD Loans' })
      .first(),
};

module.exports = locators;
