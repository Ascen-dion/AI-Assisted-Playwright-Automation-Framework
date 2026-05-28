// === FILE: src/web/tests/nav/medtronic-homepage.spec.js ===
/**
 * Automated spec for Medtronic India Homepage smoke tests.
 *
 * Test Cases:
 *   TC1:  Verify homepage loads and displays the hero CTA
 *   TC2:  Verify MEIC section heading is visible
 *   TC3:  Verify Healthcare Professionals section is visible
 *   TC4:  Verify Impact section is visible
 *   TC5:  Verify Careers section is visible
 *   TC6:  Verify footer sections are visible
 *   TC7:  Navigate to Our Company via hero "See how" CTA
 *   TC8:  Navigate to MEIC page via "Learn more" CTA
 *   TC9:  Navigate to Careers page via "Join us" CTA
 *   TC10: Verify Healthcare Professionals menu item is displayed in header
 *   TC11: Verify Patients & Caregivers menu item is displayed in header
 *   TC12: Verify Our Company menu item is displayed in header
 *   TC13: Verify Our Impact menu item is displayed in header
 *   TC14: Verify Careers section is displayed on the homepage
 */

const { test, expect } = require('../../../shared/fixtures');
const MedtronicHomePage = require('../../pages/medtronic-homepage.page');
const TD = require('../../../shared/data/medtronic-test-data');

test.describe('[UI] Medtronic India Homepage', { tag: ['@smoke', '@medtronic'] }, () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new MedtronicHomePage(page);
    await homePage.goto();
  });

  test('[C47] Test Case 1: Verify homepage loads and displays the hero CTA', async ({ page }) => {
    // Assert — correct page loaded
    await expect(page).toHaveURL(TD.urlPatterns.homepage, { timeout: 15000 });
    await expect(page).toHaveTitle(TD.pageTitles.homepage, { timeout: 15000 });

    // Assert — hero "See how" CTA is visible
    const heroVisible = await homePage.isHeroCtaVisible();
    expect(heroVisible).toBe(true);
  });

  test('[C48] Test Case 2: Verify MEIC section heading is visible on homepage', async ({ page }) => {
    // Assert — MEIC heading is displayed
    const meicHeading = await homePage.getMeicHeading();
    await expect(meicHeading).toBeVisible();
    await expect(meicHeading).toContainText(TD.homepage.meicHeading);
  });

  test('[C49] Test Case 3: Verify Healthcare Professionals section is visible', async ({ page }) => {
    // Assert — HCP section heading is visible
    const hcpVisible = await homePage.isHcpHeadingVisible();
    expect(hcpVisible).toBe(true);
  });

  test('[C50] Test Case 4: Verify Impact section is visible on homepage', async ({ page }) => {
    // Assert — Impact section heading is visible
    const impactVisible = await homePage.isImpactHeadingVisible();
    expect(impactVisible).toBe(true);
  });

  test('[C51] Test Case 5: Verify Careers section is visible on homepage', async ({ page }) => {
    // Assert — Careers section heading is visible
    const careersVisible = await homePage.isCareersHeadingVisible();
    expect(careersVisible).toBe(true);
  });

  test('[C52] Test Case 6: Verify footer sections are visible', async ({ page }) => {
    // Assert — footer section headers are visible
    const patientsFooter = await homePage.isFooterPatientsSectionVisible();
    expect(patientsFooter).toBe(true);

    const companyFooter = await homePage.isFooterCompanySectionVisible();
    expect(companyFooter).toBe(true);

    const impactFooter = await homePage.isFooterImpactSectionVisible();
    expect(impactFooter).toBe(true);
  });

  test('[C53] Test Case 7: Navigate to Our Company page via hero "See how" CTA', async ({ page }) => {
    // Act — click the hero CTA
    await homePage.clickHeroCta();

    // Assert — navigated to Our Company page
    await expect(page).toHaveURL(TD.urlPatterns.ourCompany, { timeout: 15000 });
  });

  test('[C54] Test Case 8: Navigate to MEIC page via "Learn more" CTA', async ({ page }) => {
    // Act — click MEIC Learn more
    await homePage.clickMeicLearnMore();

    // Assert — navigated to MEIC page
    await expect(page).toHaveURL(TD.urlPatterns.meic, { timeout: 15000 });
  });

  test('[C55] Test Case 9: Navigate to Careers page via "Join us" CTA', async ({ page }) => {
    // Act — click Careers Join us
    await homePage.clickCareersJoinUs();

    // Assert — navigated to Careers page
    await expect(page).toHaveURL(TD.urlPatterns.careers, { timeout: 15000 });
  });

  test('[C81] Test Case 10: Verify Healthcare Professionals menu item is displayed in header', async ({ page }) => {
    // Assert — nav link is visible in the header navigation
    const isVisible = await homePage.isNavHealthcareProfessionalsVisible();
    expect(isVisible).toBe(true);
  });

  test('[C82] Test Case 11: Verify Patients & Caregivers menu item is displayed in header', async ({ page }) => {
    // Assert — nav link is visible in the header navigation
    const isVisible = await homePage.isNavPatientsAndCaregiversVisible();
    expect(isVisible).toBe(true);
  });

  test('[C83] Test Case 12: Verify Our Company menu item is displayed in header', async ({ page }) => {
    // Assert — nav link is visible in the header navigation
    const isVisible = await homePage.isNavOurCompanyVisible();
    expect(isVisible).toBe(true);
  });

  test('[C84] Test Case 13: Verify Our Impact menu item is displayed in header', async ({ page }) => {
    // Assert — nav link is visible in the header navigation
    const isVisible = await homePage.isNavOurImpactVisible();
    expect(isVisible).toBe(true);
  });

  test('[C85] Test Case 14: Verify Careers section is displayed on the homepage', async ({ page }) => {
    // Assert — Careers section heading is visible on the homepage body
    await expect(page.getByRole('heading', { name: TD.homepage.careersHeading, exact: false })).toBeVisible({ timeout: 15000 });
  });
});