// === FILE: src/web/pages/medtronic-homepage.page.js ===
/**
 * Page object for the Medtronic India homepage.
 * Target URL: https://www.medtronic.com/in-en/index.html
 *
 * Covers:
 *   - Homepage hero banner verification
 *   - MEIC section visibility and navigation
 *   - HCP section visibility and navigation
 *   - Impact section visibility
 *   - Careers section visibility and navigation
 *   - Footer links navigation
 */

const BasePage = require('./base.page');
const loc = require('../locators/medtronic-homepage.locators');

const HOMEPAGE_URL = 'https://www.medtronic.com/in-en/index.html';

class MedtronicHomePage extends BasePage {
  /**
   * Navigate to the Medtronic India homepage.
   */
  async goto() {
    await super.goto(HOMEPAGE_URL);
  }

  // ── Hero Section ──────────────────────────────────────────────────────

  /**
   * Clicks the "See how" CTA on the hero banner.
   */
  async clickHeroCta() {
    await loc.heroCtaLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.heroCtaLink(this.page).click();
  }

  /**
   * Returns whether the hero "See how" CTA link is visible.
   * @returns {Promise<boolean>}
   */
  async isHeroCtaVisible() {
    await loc.heroCtaLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.heroCtaLink(this.page).isVisible();
  }

  // ── MEIC Section ──────────────────────────────────────────────────────

  /**
   * Returns the MEIC heading locator.
   * @returns {Promise<import('@playwright/test').Locator>}
   */
  async getMeicHeading() {
    await loc.meicHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.meicHeading(this.page);
  }

  /**
   * Clicks the "Learn more" link in the MEIC section.
   */
  async clickMeicLearnMore() {
    await loc.meicLearnMoreLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.meicLearnMoreLink(this.page).click();
  }

  // ── Healthcare Professionals Section ──────────────────────────────────

  /**
   * Returns whether the HCP section heading is visible.
   * @returns {Promise<boolean>}
   */
  async isHcpHeadingVisible() {
    await loc.hcpHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.hcpHeading(this.page).isVisible();
  }

  /**
   * Clicks the "Read more" link in the HCP section.
   */
  async clickHcpReadMore() {
    await loc.hcpReadMoreLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.hcpReadMoreLink(this.page).click();
  }

  // ── Impact Section ────────────────────────────────────────────────────

  /**
   * Returns whether the Impact section heading is visible.
   * @returns {Promise<boolean>}
   */
  async isImpactHeadingVisible() {
    await loc.impactHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.impactHeading(this.page).isVisible();
  }

  // ── Careers Section ───────────────────────────────────────────────────

  /**
   * Returns whether the Careers section heading is visible.
   * @returns {Promise<boolean>}
   */
  async isCareersHeadingVisible() {
    await loc.careersHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.careersHeading(this.page).isVisible();
  }

  /**
   * Clicks the "Join us" CTA link in the Careers section.
   */
  async clickCareersJoinUs() {
    await loc.careersJoinUsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.careersJoinUsLink(this.page).click();
  }

  // ── Footer ────────────────────────────────────────────────────────────

  /**
   * Returns whether the footer Patients section header is visible.
   * @returns {Promise<boolean>}
   */
  async isFooterPatientsSectionVisible() {
    await loc.footerPatientsSection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.footerPatientsSection(this.page).isVisible();
  }

  /**
   * Returns whether the footer Company section header is visible.
   * @returns {Promise<boolean>}
   */
  async isFooterCompanySectionVisible() {
    await loc.footerCompanySection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.footerCompanySection(this.page).isVisible();
  }

  /**
   * Returns whether the footer Impact section header is visible.
   * @returns {Promise<boolean>}
   */
  async isFooterImpactSectionVisible() {
    await loc.footerImpactSection(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.footerImpactSection(this.page).isVisible();
  }

  /**
   * Clicks the Privacy Statement link in the footer.
   */
  async clickFooterPrivacy() {
    await loc.footerPrivacyLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.footerPrivacyLink(this.page).click();
  }

  /**
   * Clicks the Terms of Use link in the footer.
   */
  async clickFooterTerms() {
    await loc.footerTermsLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.footerTermsLink(this.page).click();
  }

  /**
   * Clicks the Contact link in the footer.
   */
  async clickFooterContact() {
    await loc.footerContactLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.footerContactLink(this.page).click();
  }
}

module.exports = MedtronicHomePage;
