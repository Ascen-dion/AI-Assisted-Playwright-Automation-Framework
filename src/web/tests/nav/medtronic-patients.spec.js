// === FILE: src/web/tests/nav/medtronic-patients.spec.js ===
/**
 * Automated spec for Medtronic India Patients & Caregivers page smoke tests.
 *
 * Test Cases:
 *   TC1: Verify Patients page loads and displays "FIND YOUR CONDITION" CTA
 *   TC2: Verify "SELECT OPTIONS" treatment CTA is visible
 *   TC3: Verify "CONTACT PATIENT SERVICES" CTA is visible
 *   TC4: Verify Response Care section is visible
 *   TC5: Verify Stay Heart Safe section is visible
 *   TC6: Navigate to Conditions page via "FIND YOUR CONDITION" CTA
 *   TC7: Navigate to Treatments page via "SELECT OPTIONS" CTA
 */

const { test, expect } = require('../../../shared/fixtures');
const MedtronicPatientsPage = require('../../pages/medtronic-patients.page');
const TD = require('../../../shared/data/medtronic-test-data');

test.describe('[UI] Medtronic Patients & Caregivers', { tag: ['@smoke', '@medtronic'] }, () => {
  let patientsPage;

  test.beforeEach(async ({ page }) => {
    patientsPage = new MedtronicPatientsPage(page);
    await patientsPage.goto();
  });

  test('[C56] Test Case 1: Verify Patients page loads and FIND YOUR CONDITION CTA is visible', async ({ page }) => {
    // Assert — correct page loaded
    await expect(page).toHaveURL(TD.urlPatterns.patients, { timeout: 15000 });

    // Assert — FIND YOUR CONDITION CTA is visible
    const findConditionVisible = await patientsPage.isFindConditionVisible();
    expect(findConditionVisible).toBe(true);
  });

  test('[C57] Test Case 2: Verify SELECT OPTIONS treatment CTA is visible', async ({ page }) => {
    // Assert — SELECT OPTIONS CTA is visible
    const selectOptionsVisible = await patientsPage.isSelectOptionsVisible();
    expect(selectOptionsVisible).toBe(true);
  });

  test('[C58] Test Case 3: Verify CONTACT PATIENT SERVICES CTA is visible', async ({ page }) => {
    // Assert — CONTACT PATIENT SERVICES CTA is visible
    const contactServicesVisible = await patientsPage.isContactPatientServicesVisible();
    expect(contactServicesVisible).toBe(true);
  });

  test('[C59] Test Case 4: Verify Response Care section is visible', async ({ page }) => {
    // Assert — Response Care section heading is visible
    const responseCareVisible = await patientsPage.isResponseCareVisible();
    expect(responseCareVisible).toBe(true);
  });

  test('[C60] Test Case 5: Verify Stay Heart Safe section is visible', async ({ page }) => {
    // Assert — Stay Heart Safe section heading is visible
    const heartSafeVisible = await patientsPage.isHeartSafeVisible();
    expect(heartSafeVisible).toBe(true);
  });
});

test.describe('[UI] Medtronic Patients Navigation', { tag: ['@regression', '@medtronic'] }, () => {
  let patientsPage;

  test.beforeEach(async ({ page }) => {
    patientsPage = new MedtronicPatientsPage(page);
    await patientsPage.goto();
  });

  test('[C61] Test Case 6: Navigate to Conditions page via FIND YOUR CONDITION CTA', async ({ page }) => {
    // Act — click FIND YOUR CONDITION
    await patientsPage.clickFindCondition();

    // Assert — navigated to Conditions page
    await expect(page).toHaveURL(TD.urlPatterns.patientsConditions, { timeout: 15000 });
  });

  test('[C62] Test Case 7: Navigate to Treatments page via SELECT OPTIONS CTA', async ({ page }) => {
    // Act — click SELECT OPTIONS
    await patientsPage.clickSelectOptions();

    // Assert — navigated to Treatments page
    await expect(page).toHaveURL(TD.urlPatterns.patientsTreatments, { timeout: 15000 });
  });
});
