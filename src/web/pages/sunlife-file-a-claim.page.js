// === FILE: src/web/pages/sunlife-file-a-claim.page.js ===
/**
 * Page object for the Sun Life PH File a Claim form.
 *
 * Navigation journey:
 *   1. Utility nav → "How to file a claim" → /en/about-us/how-to-file-a-claim-video/
 *   2. "File a claim now" link → /en/insurance/tools-and-services/file-a-claim/
 *
 * OR navigate directly to CLAIM_FORM_URL for form-focused tests.
 */

const loc = require('../locators/sunlife-file-a-claim.locators');

const HOW_TO_CLAIM_URL = 'https://www.sunlife.com.ph/en/about-us/how-to-file-a-claim-video/';
const CLAIM_FORM_URL   = 'https://www.sunlife.com.ph/en/insurance/tools-and-services/file-a-claim/';

class SunLifeFileAClaimPage {
  constructor(page) {
    this.page = page;
  }

  /** Navigate directly to the File a Claim form */
  async gotoForm() {
    await this.page.goto(CLAIM_FORM_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }

  /** Navigate via the full journey: homepage utility nav → How to File a Claim → form */
  async gotoViaJourney() {
    await this.page.goto('https://www.sunlife.com.ph/en/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Dismiss cookie consent if present
    try {
      await this.page.getByRole('button', { name: /i understand/i }).first().click({ timeout: 3000 });
    } catch {}
    // Click "How to file a claim" in utility nav (no hamburger needed — it's in top bar)
    await loc.howToFileAClaimUtilityLink(this.page).click();
    await this.page.waitForURL(/how-to-file-a-claim-video/, { timeout: 15000 });
    // Click "File a claim now"
    await loc.fileAClaimNowLink(this.page).click();
    await this.page.waitForURL(/file-a-claim/, { timeout: 15000 });
  }

  /** Fill all form fields with the provided test data object */
  async fillAllFields(data) {
    await loc.insuredLastName(this.page).fill(data.insuredLastName);
    await loc.insuredFirstName(this.page).fill(data.insuredFirstName);
    await loc.insuredMiddleName(this.page).fill(data.insuredMiddleName);
    await loc.policyPlanNo(this.page).fill(data.policyPlanNo);
    await loc.dateOfBirth(this.page).fill(data.dateOfBirth);
    await loc.email(this.page).fill(data.email);
    await loc.message(this.page).fill(data.message);
    await loc.contactLastName(this.page).fill(data.contactLastName);
    await loc.contactFirstName(this.page).fill(data.contactFirstName);
    await loc.contactMiddleName(this.page).fill(data.contactMiddleName);
    await loc.contactMobileNo(this.page).fill(data.contactMobileNo);
    await loc.contactEmail(this.page).fill(data.contactEmail);
    // Select claim type — custom combobox (div, not select), must click to open then click option
    if (data.claimType) {
      await loc.claimTypeDropdown(this.page).click();
      await this.page.locator('#listbox-aclaimType').waitFor({ state: 'visible', timeout: 5000 });
      await this.page.locator('[role="option"]', { hasText: data.claimType }).click();
    }
    // Check privacy checkbox
    if (data.checkPrivacy) {
      const cb = loc.privacyCheckbox(this.page);
      const checked = await cb.isChecked();
      if (!checked) await cb.check();
    }
  }

  /** Click the Reset button */
  async clickReset() {
    await loc.resetButton(this.page).click();
  }

  /** Click the Submit button */
  async clickSubmit() {
    await loc.submitButton(this.page).click();
  }

  /** Return true if a text field is empty (value === '') */
  async isTextFieldEmpty(locatorFn) {
    const value = await locatorFn(this.page).inputValue();
    return value === '';
  }

  /** Return true if the claim type dropdown shows placeholder (no option selected) */
  async isClaimTypeAtDefault() {
    const text = await loc.claimTypeDropdown(this.page).textContent();
    return text?.trim() === 'Please select a claim type';
  }

  /** Return the current value of a text field */
  async getFieldValue(locatorFn) {
    return await locatorFn(this.page).inputValue();
  }
}

module.exports = SunLifeFileAClaimPage;
