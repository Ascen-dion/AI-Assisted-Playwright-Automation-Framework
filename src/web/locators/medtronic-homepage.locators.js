// === FILE: src/web/locators/medtronic-homepage.locators.js ===
/**
 * Locators for the Medtronic India homepage.
 *
 * Target: https://www.medtronic.com/in-en/index.html
 *
 * Selector strategy:
 *   1. ARIA role + accessible name
 *   2. Visible text
 *   3. Stable CSS selector
 */

const locators = {
  /** Medtronic logo in the header — links to homepage */
  logo: (page) =>
    page.locator('a[aria-label*="Medtronic"], a.medtronic-logo, header a[href*="index.html"]').first(),

  /** "See how" CTA link on the hero banner */
  heroCtaLink: (page) =>
    page.getByRole('link', { name: /See how/i }).first(),

  /** MEIC section heading */
  meicHeading: (page) =>
    page.getByText('Medtronic Engineering & Innovation Center', { exact: false }).first(),

  /** "Learn more" CTA link in the MEIC section */
  meicLearnMoreLink: (page) =>
    page.getByRole('link', { name: /Learn more/i }).first(),

  /** Healthcare Professionals section heading */
  hcpHeading: (page) =>
    page.getByText('Creating connections to optimize healthcare systems', { exact: false }).first(),

  /** "Read more" CTA for Healthcare Professionals */
  hcpReadMoreLink: (page) =>
    page.getByRole('link', { name: /Read more/i }).first(),

  /** Impact section heading */
  impactHeading: (page) =>
    page.getByText('Impact with purpose', { exact: false }).first(),

  /** Careers section heading */
  careersHeading: (page) =>
    page.getByText('Join the team that powers the extraordinary', { exact: false }).first(),

  /** "Join us" CTA link in the Careers section */
  careersJoinUsLink: (page) =>
    page.getByRole('link', { name: /Join us/i }).first(),

  /** Cookie consent "Okay" button */
  cookieOkayButton: (page) =>
    page.getByRole('button', { name: /Okay/i }).first(),

  /** Footer Privacy Statement link */
  footerPrivacyLink: (page) =>
    page.getByRole('link', { name: /Privacy Statement/i }).first(),

  /** Footer Terms of Use link */
  footerTermsLink: (page) =>
    page.getByRole('link', { name: /Terms of Use/i }).first(),

  /** Footer Contact link */
  footerContactLink: (page) =>
    page.getByRole('link', { name: /^Contact$/i }).first(),

  /** Footer "PATIENTS AND CAREGIVERS" section header */
  footerPatientsSection: (page) =>
    page.getByText('PATIENTS AND CAREGIVERS', { exact: false }).first(),

  /** Footer "OUR COMPANY" section header */
  footerCompanySection: (page) =>
    page.getByText('OUR COMPANY', { exact: false }).first(),

  /** Footer "OUR IMPACT" section header */
  footerImpactSection: (page) =>
    page.getByText('OUR IMPACT', { exact: false }).first(),
};

module.exports = locators;
