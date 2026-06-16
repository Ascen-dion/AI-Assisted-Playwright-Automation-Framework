// === FILE: src/web/pages/ksirs-admission-form.page.js ===
/**
 * Page object for Ksirs Admission Application Form (Step 1).
 * Extends BasePage — inherits constructor(page), goto(url), getPageUrl(), getPageTitle().
 *
 * Step 1 fields: Academic Year, Country Code, Primary phone number, Student DOB, Board, Grade
 * Clicking Next (#BtnGet) either shows a validation dialog or proceeds to OTP verification.
 */

const BasePage = require('./base.page');
const loc      = require('../locators/ksirs-admission-form.locators');

const FORM_URL = 'https://corp49.myclassboard.com/ApplicationForm_Custom/3268E71E-BD48-4243-BEBA-0B28912E91C2/1/0';

class KsirsAdmissionFormPage extends BasePage {
  async goto() {
    await super.goto(FORM_URL);
    // Wait for the primary Next button to confirm the form is ready
    await loc.nextButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }

  // ── Visibility checks ───────────────────────────────────────────────────

  async isPageHeadingVisible() {
    await loc.pageHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.pageHeading(this.page).isVisible();
  }

  async isSchoolNameVisible() {
    await loc.schoolName(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.schoolName(this.page).isVisible();
  }

  async isAcademicYearVisible() {
    return loc.academicYearSelect(this.page).isVisible();
  }

  async isCountryCodeVisible() {
    return loc.countryCodeSelect(this.page).isVisible();
  }

  async isPhoneNumberFieldVisible() {
    return loc.phoneNumberInput(this.page).isVisible();
  }

  async isStudentDobFieldVisible() {
    return loc.studentDobInput(this.page).isVisible();
  }

  async isBoardSelectVisible() {
    // Board (#divboard) is shown by JavaScript after page fully renders
    try {
      await loc.boardSelect(this.page).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async isGradeSelectVisible() {
    return loc.gradeSelect(this.page).isVisible();
  }

  async isNextButtonVisible() {
    return loc.nextButton(this.page).isVisible();
  }

  // ── Field interactions ──────────────────────────────────────────────────

  async selectAcademicYear(label) {
    await loc.academicYearSelect(this.page).selectOption({ label });
  }

  async enterPhoneNumber(phone) {
    await loc.phoneNumberInput(this.page).fill(phone);
  }

  async setStudentDobViaJs(dateString) {
    // DOB field is readonly (date picker) — set value via JavaScript
    await this.page.evaluate((date) => {
      const el = document.getElementById('DOB');
      if (!el) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(el, date);
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, dateString);
  }

  async selectBoard(label) {
    // Board (#divboard) becomes visible after DOB is filled — wait for it
    await loc.boardSelect(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.boardSelect(this.page).selectOption({ label });
  }

  async selectGrade(label) {
    await loc.gradeSelect(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.gradeSelect(this.page).selectOption({ label });
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  async clickNext() {
    await loc.nextButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.nextButton(this.page).click();
  }

  // ── Validation dialog ───────────────────────────────────────────────────

  async getValidationHeadingText() {
    await loc.validationHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return loc.validationHeading(this.page).textContent();
  }

  async dismissValidationDialog() {
    await loc.validationOkButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.validationOkButton(this.page).click();
  }

  async isValidationDialogVisible() {
    try {
      await loc.validationDialog(this.page).waitFor({ state: 'visible', timeout: 8000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Next step detection ─────────────────────────────────────────────────

  async isOtpModalVisible() {
    try {
      await loc.otpModalHeader(this.page).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async isTermsAndConditionsVisible() {
    // After Step 1 Next click, the T&C step appears on the same page
    try {
      await loc.termsHeading(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async isLoadingModalVisible() {
    try {
      await loc.loadingModal(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Composite helpers ────────────────────────────────────────────────────

  /**
   * Fill all Step 1 mandatory fields with valid test data.
   * @param {Object} data  — from TD.ksirs.validFormData
   */
  async fillValidFormData(data) {
    await this.selectAcademicYear(data.academicYear);
    await this.enterPhoneNumber(data.phoneNumber);
    await this.setStudentDobViaJs(data.dob);

    // DOBChange() triggers an AJAX call (BindAgesettings_Academicwise) that reloads
    // Grade options. Wait for the loading modal to hide BEFORE selecting Board/Grade,
    // otherwise the Grade selection will be overwritten by the AJAX response.
    await this.page.locator('#loading').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});

    await this.selectBoard(data.board);
    await this.selectGrade(data.grade);
  }
}

module.exports = KsirsAdmissionFormPage;
