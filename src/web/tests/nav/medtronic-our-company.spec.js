// === FILE: src/web/tests/nav/medtronic-our-company.spec.js ===
/**
 * Automated spec for Medtronic India Our Company page smoke tests.
 *
 * Test Cases:
 *   TC1: Verify Our Company page loads successfully
 *   TC2: Navigate to Mission page
 *   TC3: Navigate to Key Facts page
 *   TC4: Navigate to History page
 *   TC5: Navigate to Medtronic in India page
 */

const { test, expect } = require('../../../shared/fixtures');
const MedtronicOurCompanyPage = require('../../pages/medtronic-our-company.page');
const TD = require('../../../shared/data/medtronic-test-data');

test.describe('[UI] Medtronic Our Company', { tag: ['@smoke', '@medtronic'] }, () => {
  let companyPage;

  test.beforeEach(async ({ page }) => {
    companyPage = new MedtronicOurCompanyPage(page);
    await companyPage.goto();
  });

  test('[C273] Test Case 1: Verify Our Company page loads successfully', async ({ page }) => {
    // Assert — correct page loaded
    await expect(page).toHaveURL(TD.urlPatterns.ourCompany, { timeout: 15000 });
    await expect(page).toHaveTitle(TD.pageTitles.ourCompany, { timeout: 15000 });
  });
});

test.describe('[UI] Medtronic Our Company Navigation', { tag: ['@regression', '@medtronic'] }, () => {
  let companyPage;

  test.beforeEach(async ({ page }) => {
    companyPage = new MedtronicOurCompanyPage(page);
    await companyPage.goto();
  });

  test('[C274] Test Case 2: Navigate to Mission page from Our Company', async ({ page }) => {
    // Act — click Mission link
    await companyPage.clickMission();

    // Assert — navigated to Mission page
    await expect(page).toHaveURL(TD.urlPatterns.mission, { timeout: 15000 });
  });

  test('[C275] Test Case 3: Navigate to Key Facts page from Our Company', async ({ page }) => {
    // Act — click Key Facts link
    await companyPage.clickKeyFacts();

    // Assert — navigated to Key Facts page
    await expect(page).toHaveURL(TD.urlPatterns.keyFacts, { timeout: 15000 });
  });

  test('[C276] Test Case 4: Navigate to History page from Our Company', async ({ page }) => {
    // Act — click History link
    await companyPage.clickHistory();

    // Assert — navigated to History page
    await expect(page).toHaveURL(TD.urlPatterns.history, { timeout: 15000 });
  });

  test('[C277] Test Case 5: Navigate to Medtronic in India page from Our Company', async ({ page }) => {
    // Act — click Medtronic in India link
    await companyPage.clickMedtronicIndia();

    // Assert — navigated to Medtronic in India page
    await expect(page).toHaveURL(TD.urlPatterns.medtronicIndia, { timeout: 15000 });
  });
});
