// === FILE: src/web/locators/medtronic-patients.locators.js ===
/**
 * Locators for the Medtronic India Patients & Caregivers page.
 *
 * Target: https://www.medtronic.com/in-en/patients.html
 *
 * Selector strategy:
 *   1. ARIA role + accessible name
 *   2. Visible text
 *   3. Stable CSS selector
 */

const locators = {
  /** "FIND YOUR CONDITION" CTA link */
  findConditionLink: (page) =>
    page.getByRole('link', { name: /FIND YOUR CONDITION/i }).first(),

  /** "SELECT OPTIONS" CTA for treatments */
  selectOptionsLink: (page) =>
    page.getByRole('link', { name: /SELECT OPTIONS/i }).first(),

  /** "CONTACT PATIENT SERVICES" CTA */
  contactPatientServicesLink: (page) =>
    page.getByRole('link', { name: /CONTACT PATIENT SERVICES/i }).first(),

  /** Response Care section heading — visible H2 in page content, not hidden nav link */
  responseCareHeading: (page) =>
    page.locator('h2').filter({ hasText: /response/i }).first(),

  /** "LEARN MORE" link in Response Care section */
  responseCareLearnMoreLink: (page) =>
    page.locator('a[href*="Response-Care"], a[href*="response-care"]').first(),

  /** Stay Heart Safe section heading */
  heartSafeHeading: (page) =>
    page.getByText(/stay\s*heart\s*safe/i).first(),

  /** Conditions footer link */
  conditionsLink: (page) =>
    page.getByRole('link', { name: /^Conditions$/i }).first(),

  /** Treatments & Therapies footer link */
  treatmentsLink: (page) =>
    page.getByRole('link', { name: /Treatments & Therapies/i }).first(),
};

module.exports = locators;
