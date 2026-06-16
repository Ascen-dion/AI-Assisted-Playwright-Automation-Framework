// === FILE: src/web/locators/ksirs-admission-form.locators.js ===
/**
 * Locators for Ksirs Admission Application Form
 * Target: https://corp49.myclassboard.com/ApplicationForm_Custom/3268E71E-BD48-4243-BEBA-0B28912E91C2/1/0
 *
 * Selector strategy: ID attributes (most stable) > ARIA role > visible text
 * All selectors verified via live DOM inspection on 2026-06-16.
 */

const locators = {
  // ── Page header ───────────────────────────────────────────────────────────
  pageHeading:        (page) => page.locator('h3').filter({ hasText: 'Application' }).first(),
  schoolName:         (page) => page.locator('text=Ksirs International School').first(),

  // ── Form fields (Step 1) ──────────────────────────────────────────────────
  academicYearSelect: (page) => page.locator('#ddl12AcademicYearId'),
  countryCodeSelect:  (page) => page.locator('#countryCodeID'),
  phoneNumberInput:   (page) => page.locator('#txtmobileno'),
  studentDobInput:    (page) => page.locator('#DOB'),
  boardSelect:        (page) => page.locator('#boardid'),
  gradeSelect:        (page) => page.locator('#Classes'),

  // ── Navigation button ─────────────────────────────────────────────────────
  // #BtnGet is the primary "Next" button on Step 1 (before T&C)
  nextButton:         (page) => page.locator('#BtnGet'),

  // ── Validation (SweetAlert v1 dialog) ─────────────────────────────────────
  // Appears when required fields are missing — uses SweetAlert 1.x, class = .sweet-alert
  validationDialog:   (page) => page.locator('.sweet-alert.showSweetAlert').first(),
  validationHeading:  (page) => page.locator('.sweet-alert h2').first(),
  validationOkButton: (page) => page.locator('.sweet-alert button.confirm').first(),

  // ── Loading indicator (appears briefly after valid Next click) ────────────
  loadingModal:       (page) => page.locator('.modal-header').filter({ hasText: 'Loading...' }).first(),

  // ── OTP step (appears after T&C acceptance and second Next click) ─────────────
  otpModalHeader:     (page) => page.locator('.modal-header').filter({ hasText: /Please validate the 6 digit OTP/i }).first(),
  otpInput:           (page) => page.locator('#txtotp'),
  validateOtpButton:  (page) => page.locator('#BtnValidate'),

  // ── Terms & Conditions step (Step 2 — appears after successful Step 1 Next click) ───
  termsHeading:       (page) => page.locator('text=Terms & Conditions').first(),
  termsCheckbox:      (page) => page.locator('#terms').first(),
  termsNextButton:    (page) => page.locator('#BtnTandC'),
};

module.exports = locators;
