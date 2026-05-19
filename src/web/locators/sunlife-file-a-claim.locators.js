// === FILE: src/web/locators/sunlife-file-a-claim.locators.js ===
/**
 * Locators for the Sun Life PH File a Claim form page.
 * URL: https://www.sunlife.com.ph/en/insurance/tools-and-services/file-a-claim/
 * Reached via: utility nav "How to file a claim" → "File a claim now" link
 */

const locators = {
  // ── Utility nav (top bar — no hamburger required) ────────────────────────
  howToFileAClaimUtilityLink: (page) => page.getByRole('link', { name: 'How to file a claim' }).first(),

  // ── How to file a claim VIDEO page ────────────────────────────────────────
  fileAClaimNowLink: (page) => page.getByRole('link', { name: /File a claim now/i }),

  // ── File a Claim form — Insured Details ───────────────────────────────────
  insuredLastName:   (page) => page.getByRole('textbox', { name: 'Insured Last Name' }),
  insuredFirstName:  (page) => page.getByRole('textbox', { name: 'Insured First Name' }),
  insuredMiddleName: (page) => page.getByRole('textbox', { name: 'Insured Middle Name' }),
  policyPlanNo:      (page) => page.getByRole('textbox', { name: 'Policy/Plan no./s' }),
  dateOfBirth:       (page) => page.getByRole('textbox', { name: 'Date of birth' }),
  claimTypeDropdown: (page) => page.getByRole('combobox', { name: 'Please select a claim type' }),
  email:             (page) => page.locator('#email'),
  message:           (page) => page.getByRole('textbox', { name: 'Message' }),

  // ── File a Claim form — Contact Details ──────────────────────────────────
  contactLastName:   (page) => page.getByRole('textbox', { name: 'Contact person Last Name' }),
  contactFirstName:  (page) => page.getByRole('textbox', { name: 'Contact person First Name' }),
  contactMiddleName: (page) => page.getByRole('textbox', { name: 'Contact person Middle Name' }),
  contactMobileNo:   (page) => page.getByRole('textbox', { name: 'Contact person Mobile no.' }),
  contactEmail:      (page) => page.getByRole('textbox', { name: 'Contact person Email' }),

  // ── File a Claim form — Bottom section ────────────────────────────────────
  privacyCheckbox:   (page) => page.getByRole('checkbox', { name: 'Privacy Statement' }),
  resetButton:       (page) => page.getByRole('button', { name: 'Reset' }),
  submitButton:      (page) => page.getByRole('button', { name: 'Submit' }),
};

module.exports = locators;
