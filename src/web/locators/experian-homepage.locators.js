// === FILE: src/web/locators/experian-homepage.locators.js ===
/**
 * Locators for the Experian homepage.
 *
 * Target: https://www.experian.com/
 *
 * Selector strategy:
 *   1. ARIA role + accessible name
 *   2. Visible text
 *   3. Stable CSS selector
 */

const locators = {
  /** Experian logo in the header — links to homepage */
  logo: (page) =>
    page.locator('a[aria-label*="Experian logo"], header a[href="/"]').first(),

  /** Hero heading "Reach your credit and money goals" */
  heroHeading: (page) =>
    page.getByRole('heading', { name: /Reach your credit and money goals/i, level: 1 }).first(),

  /** "Let's get started" CTA link on the hero section */
  heroCtaLink: (page) =>
    page.getByRole('link', { name: /Let's get started/i }).first(),

  /** Credit Score tab in the hero tablist */
  creditScoreTab: (page) =>
    page.getByRole('tab', { name: /Get a credit report/i }).first(),

  /** No Ding Decline tab */
  noDingTab: (page) =>
    page.getByRole('tab', { name: /No Ding Decline/i }).first(),

  /** Save on bills tab */
  saveBillsTab: (page) =>
    page.getByRole('tab', { name: /Save over.*bills/i }).first(),

  /** Car insurance tab */
  carInsuranceTab: (page) =>
    page.getByRole('tab', { name: /Save on car insurance/i }).first(),

  /** Smart Money tab */
  smartMoneyTab: (page) =>
    page.getByRole('tab', { name: /Build credit with digital checking/i }).first(),

  /** BFF section heading */
  bffHeading: (page) =>
    page.getByRole('heading', { name: /Say hi to your Big Financial Friend/i }).first(),

  /** "Explore the Experian app" CTA link */
  exploreAppLink: (page) =>
    page.getByRole('link', { name: /Explore the Experian app/i }).first(),

  /** "How can we help?" section heading */
  howCanWeHelpHeading: (page) =>
    page.getByRole('heading', { name: /How can we help/i }).first(),

  /** Security freeze card link */
  securityFreezeLink: (page) =>
    page.getByRole('link', { name: /Security freeze/i }).first(),

  /** Disputes card link */
  disputesLink: (page) =>
    page.getByRole('link', { name: /Disputes/i }).first(),

  /** Fraud alert card link */
  fraudAlertLink: (page) =>
    page.getByRole('link', { name: /Fraud alert/i }).first(),

  /** "See all credit support" link */
  seeAllCreditSupportLink: (page) =>
    page.getByRole('link', { name: /See all credit support/i }).first(),

  // ── Header Navigation Menu Items ────────────────────────────────────────

  /** "Credit" button in the top-level header navigation */
  navCredit: (page) =>
    page.getByRole('button', { name: /^Credit$/i }).first(),

  /** "Protection" button in the top-level header navigation */
  navProtection: (page) =>
    page.getByRole('button', { name: /^Protection$/i }).first(),

  /** "Money" button in the top-level header navigation */
  navMoney: (page) =>
    page.getByRole('button', { name: /^Money$/i }).first(),

  /** "Credit Cards" button in the top-level header navigation */
  navCreditCards: (page) =>
    page.getByRole('button', { name: /^Credit Cards$/i }).first(),

  /** "Loans" button in the top-level header navigation */
  navLoans: (page) =>
    page.getByRole('button', { name: /^Loans$/i }).first(),

  /** "Insurance" button in the top-level header navigation */
  navInsurance: (page) =>
    page.getByRole('button', { name: /^Insurance$/i }).first(),

  /** "Sign in" link in the header */
  signInLink: (page) =>
    page.getByRole('link', { name: /Sign in/i }).first(),

  /** Search button in the header */
  searchButton: (page) =>
    page.getByRole('button', { name: /Search/i }).first(),

  // ── Top Bar Links ───────────────────────────────────────────────────────

  /** "Consumer" link in the top bar */
  topBarConsumer: (page) =>
    page.getByRole('link', { name: /^Consumer$/i }).first(),

  /** "Small Business" link in the top bar */
  topBarSmallBusiness: (page) =>
    page.getByRole('link', { name: /^Small Business$/i }).first(),

  /** "Business" link in the top bar */
  topBarBusiness: (page) =>
    page.getByRole('link', { name: /^Business$/i }).first(),

  // ── Footer Links ────────────────────────────────────────────────────────

  /** Footer "Support" section header */
  footerSupportSection: (page) =>
    page.locator('footer, [role="contentinfo"]').getByText('Support', { exact: true }).first(),

  /** Footer "Education & advice" section header */
  footerEducationSection: (page) =>
    page.locator('footer, [role="contentinfo"]').getByText('Education & advice', { exact: false }).first(),

  /** Footer "Credit resources" section header */
  footerCreditResourcesSection: (page) =>
    page.locator('footer, [role="contentinfo"]').getByText('Credit resources', { exact: false }).first(),

  /** Footer "Experian for businesses" section header */
  footerBusinessSection: (page) =>
    page.locator('footer, [role="contentinfo"]').getByText('Experian for businesses', { exact: false }).first(),

  /** Footer "Legal terms & conditions" link */
  footerLegalTermsLink: (page) =>
    page.getByRole('link', { name: /Legal terms & conditions/i }).first(),

  /** Footer "Privacy center" link */
  footerPrivacyCenterLink: (page) =>
    page.getByRole('link', { name: /Privacy center/i }).first(),

  /** Footer "Careers" link */
  footerCareersLink: (page) =>
    page.getByRole('link', { name: /^Careers$/i }).first(),

  /** Footer "Contact us" link */
  footerContactUsLink: (page) =>
    page.getByRole('link', { name: /^Contact us$/i }).first(),
};

module.exports = locators;
