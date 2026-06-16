// === FILE: src/web/tests/application/ksirs-admission-form.spec.js ===
/**
 * [UI] Ksirs Admission Application Form Submission
 *
 * Story: As a prospective parent/applicant, I want to complete the admission
 *        application form with the required details and proceed to the next step,
 *        so that I can review and confirm my admission application.
 *
 * TestRail Section: Ksirs - Admission Application Form (Section ID: 77)
 * Cases: C1284, C1285, C1286, C1287, C1288
 */

const { test, expect } = require('../../../shared/fixtures');
const KsirsAdmissionFormPage = require('../../pages/ksirs-admission-form.page');
const TD = require('../../../shared/data/test-data');

test.describe('[UI] Ksirs Admission Application Form Submission', { tag: ['@regression'] }, () => {
  let formPage;

  test.beforeEach(async ({ page }) => {
    formPage = new KsirsAdmissionFormPage(page);
    await formPage.goto();
  });

  // ── AC1: Form loads with all required fields ──────────────────────────────

  test('[C1284] Test Case 1: Verify Admission Application Form Loads with All Required Fields', async ({ page }) => {
    // Assert page identity
    await expect(page).toHaveTitle(TD.ksirs.pageTitle, { timeout: 15000 });

    // Assert heading and school name
    const headingVisible = await formPage.isPageHeadingVisible();
    expect(headingVisible).toBe(true);

    const schoolNameVisible = await formPage.isSchoolNameVisible();
    expect(schoolNameVisible).toBe(true);

    // Assert all form fields are present
    expect(await formPage.isAcademicYearVisible()).toBe(true);
    expect(await formPage.isCountryCodeVisible()).toBe(true);
    expect(await formPage.isPhoneNumberFieldVisible()).toBe(true);
    expect(await formPage.isStudentDobFieldVisible()).toBe(true);
    expect(await formPage.isBoardSelectVisible()).toBe(true);
    expect(await formPage.isGradeSelectVisible()).toBe(true);

    // Assert Next button is present
    expect(await formPage.isNextButtonVisible()).toBe(true);
  });

  // ── AC2: Validation on blank mandatory field ──────────────────────────────

  test('[C1285] Test Case 2: Verify Validation Message Displayed When Mandatory Phone Field is Empty', async ({ page }) => {
    // Do NOT fill in the phone number — leave all fields blank
    await formPage.clickNext();

    // Assert SweetAlert2 validation dialog appears
    const dialogVisible = await formPage.isValidationDialogVisible();
    expect(dialogVisible).toBe(true);

    // Assert the validation message text
    const headingText = await formPage.getValidationHeadingText();
    expect(headingText.trim()).toBe(TD.ksirs.validationMessages.mobileRequired);

    // Assert we are still on the same page (form submission was prevented)
    await expect(page).toHaveURL(TD.ksirs.urlPattern, { timeout: 5000 });

    // Clean up — dismiss the dialog
    await formPage.dismissValidationDialog();
  });

  // ── AC3: Valid data accepted without errors ────────────────────────────────

  test('[C1286] Test Case 3: Verify Valid Data Entry is Accepted Without Validation Errors', async ({ page }) => {
    // Enter valid data in all mandatory fields
    await formPage.fillValidFormData(TD.ksirs.validFormData);

    // Assert no validation dialog appeared — the dialog should NOT be visible
    const dialogVisible = await formPage.isValidationDialogVisible();
    expect(dialogVisible).toBe(false);

    // Assert phone number field contains the entered value
    await expect(page.locator('#txtmobileno')).toHaveValue(TD.ksirs.validFormData.phoneNumber, { timeout: 5000 });

    // Assert Next button is still displayed and enabled
    expect(await formPage.isNextButtonVisible()).toBe(true);
  });

  // ── AC4: Next button triggers data save ──────────────────────────────────

  test('[C1287] Test Case 4: Verify Next Button Triggers Data Save After Valid Form Completion', async ({ page }) => {
    // Fill all mandatory fields with valid data
    await formPage.fillValidFormData(TD.ksirs.validFormData);

    // Click Next and observe the system response
    await formPage.clickNext();

    // Assert a Loading indicator OR the next step becomes visible within timeout
    // The system shows either a Loading modal or advances directly to OTP/next step
    const loadingShown  = await formPage.isLoadingModalVisible();
    const otpShown      = await formPage.isOtpModalVisible();

    // At least one of these must be true — either loading started or next step appeared
    expect(loadingShown || otpShown).toBe(true);
  });

  // ── AC5: Navigation to next step ─────────────────────────────────────────

  test('[C1288] Test Case 5: Verify Navigation to Next Step After Successful Form Completion', async ({ page }) => {
    // Fill all mandatory fields with valid data
    await formPage.fillValidFormData(TD.ksirs.validFormData);

    // Click Next to advance
    await formPage.clickNext();

    // Assert the Terms & Conditions step appears — this is the actual next step
    // in the admission journey shown after successful Step 1 completion
    const termsVisible = await formPage.isTermsAndConditionsVisible();
    expect(termsVisible).toBe(true);
  });
});
