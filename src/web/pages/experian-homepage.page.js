// === FILE: src/web/pages/experian-homepage.page.js ===
/**
 * Page object for the Experian homepage.
 * Target URL: https://www.experian.com/
 *
 * Covers:
 *   - Homepage hero section verification
 *   - Hero tabs interaction
 *   - BFF (Big Financial Friend) section
 *   - How can we help section
 *   - Header navigation visibility
 *   - Footer links navigation
 */

const BasePage = require('./base.page');
const loc = require('../locators/experian-homepage.locators');

const HOMEPAGE_URL = 'https://www.experian.com/';

class ExperianHomePage extends BasePage {
  /**
   * Navigate to the Experian homepage.
   */
  async goto() {
    await super.goto(HOMEPAGE_URL);
  }

  // ── Hero Section ──────────────────────────────────────────────────────

  /**
   * Returns the hero heading locator.
   */
  async getHeroHeading() {
    await loc.heroHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.heroHeading(this.page);
  }

  /**
   * Clicks the "Let's get started" CTA on the hero section.
   */
  async clickHeroCta() {
    await loc.heroCtaLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.heroCtaLink(this.page).click();
  }

  /**
   * Returns whether the hero heading is visible.
   * @returns {Promise<boolean>}
   */
  async isHeroHeadingVisible() {
    await loc.heroHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.heroHeading(this.page).isVisible();
  }

  // ── Hero Tabs ─────────────────────────────────────────────────────────

  /**
   * Returns whether the Credit Score tab is visible.
   */
  async isCreditScoreTabVisible() {
    await loc.creditScoreTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.creditScoreTab(this.page).isVisible();
  }

  /**
   * Returns whether the No Ding Decline tab is visible.
   */
  async isNoDingTabVisible() {
    await loc.noDingTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.noDingTab(this.page).isVisible();
  }

  /**
   * Returns whether the Save on bills tab is visible.
   */
  async isSaveBillsTabVisible() {
    await loc.saveBillsTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.saveBillsTab(this.page).isVisible();
  }

  /**
   * Returns whether the Car insurance tab is visible.
   */
  async isCarInsuranceTabVisible() {
    await loc.carInsuranceTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.carInsuranceTab(this.page).isVisible();
  }

  /**
   * Returns whether the Smart Money tab is visible.
   */
  async isSmartMoneyTabVisible() {
    await loc.smartMoneyTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.smartMoneyTab(this.page).isVisible();
  }

  // ── BFF Section ───────────────────────────────────────────────────────

  /**
   * Returns the BFF section heading locator.
   */
  async getBffHeading() {
    await loc.bffHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.bffHeading(this.page);
  }

  /**
   * Returns whether the BFF section heading is visible.
   */
  async isBffHeadingVisible() {
    await loc.bffHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.bffHeading(this.page).isVisible();
  }

  /**
   * Clicks the "Explore the Experian app" link.
   */
  async clickExploreApp() {
    await loc.exploreAppLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.exploreAppLink(this.page).click();
  }

  // ── How Can We Help Section ───────────────────────────────────────────

  /**
   * Returns whether the "How can we help?" heading is visible.
   */
  async isHowCanWeHelpVisible() {
    await loc.howCanWeHelpHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.howCanWeHelpHeading(this.page).isVisible();
  }

  /**
   * Clicks the Security freeze link.
   */
  async clickSecurityFreeze() {
    await loc.securityFreezeLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.securityFreezeLink(this.page).click();
  }

  /**
   * Clicks the Disputes link.
   */
  async clickDisputes() {
    await loc.disputesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.disputesLink(this.page).click();
  }

  /**
   * Clicks the Fraud alert link.
   */
  async clickFraudAlert() {
    await loc.fraudAlertLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.fraudAlertLink(this.page).click();
  }

  /**
   * Clicks the "See all credit support" link.
   */
  async clickSeeAllCreditSupport() {
    await loc.seeAllCreditSupportLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.seeAllCreditSupportLink(this.page).click();
  }

  // ── Header Navigation Menu ────────────────────────────────────────────

  /**
   * Returns whether the Credit nav button is visible.
   */
  async isNavCreditVisible() {
    await loc.navCredit(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.navCredit(this.page).isVisible();
  }

  /**
   * Returns whether the Protection nav button is visible.
   */
  async isNavProtectionVisible() {
    await loc.navProtection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.navProtection(this.page).isVisible();
  }

  /**
   * Returns whether the Money nav button is visible.
   */
  async isNavMoneyVisible() {
    await loc.navMoney(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.navMoney(this.page).isVisible();
  }

  /**
   * Returns whether the Credit Cards nav button is visible.
   */
  async isNavCreditCardsVisible() {
    await loc.navCreditCards(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.navCreditCards(this.page).isVisible();
  }

  /**
   * Returns whether the Loans nav button is visible.
   */
  async isNavLoansVisible() {
    await loc.navLoans(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.navLoans(this.page).isVisible();
  }

  /**
   * Returns whether the Insurance nav button is visible.
   */
  async isNavInsuranceVisible() {
    await loc.navInsurance(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.navInsurance(this.page).isVisible();
  }

  // ── Footer ────────────────────────────────────────────────────────────

  /**
   * Returns whether the footer Support section header is visible.
   */
  async isFooterSupportSectionVisible() {
    await loc.footerSupportSection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.footerSupportSection(this.page).isVisible();
  }

  /**
   * Returns whether the footer Education section header is visible.
   */
  async isFooterEducationSectionVisible() {
    await loc.footerEducationSection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.footerEducationSection(this.page).isVisible();
  }

  /**
   * Returns whether the footer Credit Resources section header is visible.
   */
  async isFooterCreditResourcesSectionVisible() {
    await loc.footerCreditResourcesSection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.footerCreditResourcesSection(this.page).isVisible();
  }

  /**
   * Returns whether the footer Business section header is visible.
   */
  async isFooterBusinessSectionVisible() {
    await loc.footerBusinessSection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.footerBusinessSection(this.page).isVisible();
  }

  /**
   * Clicks the Legal Terms link in the footer.
   */
  async clickFooterLegalTerms() {
    await loc.footerLegalTermsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.footerLegalTermsLink(this.page).click();
  }

  /**
   * Clicks the Privacy Center link in the footer.
   */
  async clickFooterPrivacyCenter() {
    await loc.footerPrivacyCenterLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.footerPrivacyCenterLink(this.page).click();
  }

  /**
   * Clicks the Contact Us link in the footer.
   */
  async clickFooterContactUs() {
    await loc.footerContactUsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.footerContactUsLink(this.page).click();
  }
}

module.exports = ExperianHomePage;
