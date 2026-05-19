// === FILE: src/web/tests/purchase/sunlife-file-a-claim.spec.js ===
/**
 * ED-85: Verify Reset Button Clears All Entered Data on File a Claim Form
 *
 * TestRail cases: C1842, C1843, C1844, C1845, C1846, C1847 (Section 46)
 * Jira story:     ED-85
 */

const { test, expect } = require('../../../shared/fixtures');
const SunLifeFileAClaimPage = require('../../pages/sunlife-file-a-claim.page');
const loc = require('../../locators/sunlife-file-a-claim.locators');
const TD = require('../../../shared/data/test-data');

const DATA = TD.sunlife.claimFormData;

test.describe('[UI] ED-85: Reset button clears all entered data on File a Claim form', { tag: ['@smoke', '@regression'] }, () => {
  // Serial mode — avoids simultaneous requests to sunlife.com.ph which triggers bot-detection
  test.describe.configure({ mode: 'serial' });

  let claimPage;

  test.beforeEach(async ({ page }) => {
    // Mask navigator.webdriver to bypass Kasada bot-detection on sunlife.com.ph
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });
    claimPage = new SunLifeFileAClaimPage(page);
    // Navigate directly to the form — no hamburger menu needed for this page
    await claimPage.gotoForm();
    // Dismiss Sun Life cookie consent banner — give it enough time to appear and be clickable
    try {
      const cookieBtn = page.getByRole('button', { name: /i understand/i }).first();
      await cookieBtn.waitFor({ state: 'visible', timeout: 10000 });
      await cookieBtn.click();
      await cookieBtn.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {}
    // Wait for Reset button to confirm form is fully rendered
    await loc.resetButton(page).waitFor({ state: 'visible', timeout: 20000 });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // C1842 — AC1: All entered text fields should be cleared
  // ─────────────────────────────────────────────────────────────────────────
  test('[C1842] Test Case 1: All entered text fields are cleared after clicking Reset', async ({ page }) => {
    // Arrange — fill all text fields
    await loc.insuredLastName(page).fill(DATA.insuredLastName);
    await loc.insuredFirstName(page).fill(DATA.insuredFirstName);
    await loc.insuredMiddleName(page).fill(DATA.insuredMiddleName);
    await loc.policyPlanNo(page).fill(DATA.policyPlanNo);
    await loc.email(page).fill(DATA.email);
    await loc.contactLastName(page).fill(DATA.contactLastName);
    await loc.contactFirstName(page).fill(DATA.contactFirstName);
    await loc.contactMiddleName(page).fill(DATA.contactMiddleName);
    await loc.contactMobileNo(page).fill(DATA.contactMobileNo);
    await loc.contactEmail(page).fill(DATA.contactEmail);

    // Act
    await claimPage.clickReset();

    // Assert — every text field is empty
    await expect(loc.insuredLastName(page)).toHaveValue('');
    await expect(loc.insuredFirstName(page)).toHaveValue('');
    await expect(loc.insuredMiddleName(page)).toHaveValue('');
    await expect(loc.policyPlanNo(page)).toHaveValue('');
    await expect(loc.email(page)).toHaveValue('');
    await expect(loc.contactLastName(page)).toHaveValue('');
    await expect(loc.contactFirstName(page)).toHaveValue('');
    await expect(loc.contactMiddleName(page)).toHaveValue('');
    await expect(loc.contactMobileNo(page)).toHaveValue('');
    await expect(loc.contactEmail(page)).toHaveValue('');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // C1843 — AC2: Date of birth field should be cleared
  // ─────────────────────────────────────────────────────────────────────────
  test('[C1843] Test Case 2: Date of birth field is cleared after clicking Reset', async ({ page }) => {
    // Arrange
    await loc.dateOfBirth(page).fill(DATA.dateOfBirth);
    await expect(loc.dateOfBirth(page)).not.toHaveValue('');

    // Act
    await claimPage.clickReset();

    // Assert
    await expect(loc.dateOfBirth(page)).toHaveValue('');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // C1844 — AC3: Claim Type dropdown resets to default
  // ─────────────────────────────────────────────────────────────────────────
  test('[C1844] Test Case 3: Claim Type dropdown resets to default value after clicking Reset', async ({ page }) => {
    // Arrange — open custom combobox and select first option "Death"
    await loc.claimTypeDropdown(page).click();
    await page.locator('#listbox-aclaimType').waitFor({ state: 'visible', timeout: 5000 });
    await page.locator('[role="option"]', { hasText: 'Death' }).click();
    // Verify something was selected (combobox should display "Death" in its text)
    await expect(loc.claimTypeDropdown(page)).toContainText('Death');

    // Act
    await claimPage.clickReset();

    // Assert — dropdown returns to placeholder text only (no option text visible)
    await expect(loc.claimTypeDropdown(page)).toHaveText('Please select a claim type');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // C1845 — AC4: Message field should be cleared
  // ─────────────────────────────────────────────────────────────────────────
  test('[C1845] Test Case 4: Message field is cleared after clicking Reset', async ({ page }) => {
    // Arrange
    await loc.message(page).fill(DATA.message);
    await expect(loc.message(page)).not.toHaveValue('');

    // Act
    await claimPage.clickReset();

    // Assert
    await expect(loc.message(page)).toHaveValue('');
  });

  // ─────────────────────────────────────────────────────────────────────────
  // C1846 — AC5: Privacy Statement checkbox should become unchecked
  // ─────────────────────────────────────────────────────────────────────────
  test('[C1846] Test Case 5: Privacy Statement checkbox is unchecked after clicking Reset', async ({ page }) => {
    // Arrange
    await loc.privacyCheckbox(page).check();
    await expect(loc.privacyCheckbox(page)).toBeChecked();

    // Act
    await claimPage.clickReset();

    // Assert
    await expect(loc.privacyCheckbox(page)).not.toBeChecked();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // C1847 — AC6: No entered data remains visible after Reset (full form)
  // ─────────────────────────────────────────────────────────────────────────
  test('[C1847] Test Case 6: No entered data remains visible after clicking Reset on fully filled form', async ({ page }) => {
    // Arrange — fill ALL fields
    await claimPage.fillAllFields(DATA);

    // Verify data was entered
    await expect(loc.insuredLastName(page)).not.toHaveValue('');
    await expect(loc.privacyCheckbox(page)).toBeChecked();

    // Act
    await claimPage.clickReset();

    // Assert — complete form reset
    await expect(loc.insuredLastName(page)).toHaveValue('');
    await expect(loc.insuredFirstName(page)).toHaveValue('');
    await expect(loc.insuredMiddleName(page)).toHaveValue('');
    await expect(loc.policyPlanNo(page)).toHaveValue('');
    await expect(loc.dateOfBirth(page)).toHaveValue('');
    await expect(loc.claimTypeDropdown(page)).toHaveText('Please select a claim type');
    await expect(loc.email(page)).toHaveValue('');
    await expect(loc.message(page)).toHaveValue('');
    await expect(loc.contactLastName(page)).toHaveValue('');
    await expect(loc.contactFirstName(page)).toHaveValue('');
    await expect(loc.contactMiddleName(page)).toHaveValue('');
    await expect(loc.contactMobileNo(page)).toHaveValue('');
    await expect(loc.contactEmail(page)).toHaveValue('');
    await expect(loc.privacyCheckbox(page)).not.toBeChecked();
  });
});
