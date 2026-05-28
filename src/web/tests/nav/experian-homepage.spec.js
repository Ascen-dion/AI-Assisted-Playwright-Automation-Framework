// === FILE: src/web/tests/nav/experian-homepage.spec.js ===
/**
 * Automated spec for Experian Homepage smoke tests.
 *
 * Test Cases:
 *   TC1:  Verify homepage loads and displays the hero heading
 *   TC2:  Verify Credit Score tab is visible on hero section
 *   TC3:  Verify BFF (Big Financial Friend) section is visible
 *   TC4:  Verify "How can we help?" section is visible
 *   TC5:  Verify footer sections are visible (Support, Education, Credit Resources, Business)
 *   TC6:  Navigate to Security Freeze page via credit support card
 *   TC7:  Navigate to Disputes page via credit support card
 *   TC8:  Navigate to Fraud Alert page via credit support card
 *   TC9:  Verify Credit menu item is displayed in header
 *   TC10: Verify Protection menu item is displayed in header
 *   TC11: Verify Money menu item is displayed in header
 *   TC12: Verify Credit Cards menu item is displayed in header
 *   TC13: Verify Loans menu item is displayed in header
 *   TC14: Verify Insurance menu item is displayed in header
 */

const { test, expect } = require('../../../shared/fixtures');
const ExperianHomePage = require('../../pages/experian-homepage.page');
const TD = require('../../../shared/data/experian-test-data');

test.describe('[UI] Experian Homepage', { tag: ['@smoke', '@experian'] }, () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new ExperianHomePage(page);
    await homePage.goto();
  });

  test('[C86] Test Case 1: Verify homepage loads and displays the hero heading', async ({ page }) => {
    // Assert — correct page loaded
    await expect(page).toHaveURL(TD.urlPatterns.homepage, { timeout: 15000 });
    await expect(page).toHaveTitle(TD.pageTitles.homepage, { timeout: 15000 });

    // Assert — hero heading is visible
    const heroVisible = await homePage.isHeroHeadingVisible();
    expect(heroVisible).toBe(true);
  });

  test('[C87] Test Case 2: Verify Credit Score tab is visible on hero section', async ({ page }) => {
    // Assert — Credit Score tab is displayed
    const tabVisible = await homePage.isCreditScoreTabVisible();
    expect(tabVisible).toBe(true);
  });

  test('[C88] Test Case 3: Verify BFF section is visible on homepage', async ({ page }) => {
    // Assert — BFF section heading is visible
    const bffVisible = await homePage.isBffHeadingVisible();
    expect(bffVisible).toBe(true);
  });

  test('[C89] Test Case 4: Verify "How can we help?" section is visible', async ({ page }) => {
    // Assert — How can we help section heading is visible
    const helpVisible = await homePage.isHowCanWeHelpVisible();
    expect(helpVisible).toBe(true);
  });

  test('[C90] Test Case 5: Verify footer sections are visible', async ({ page }) => {
    // Assert — footer section headers are visible
    const supportFooter = await homePage.isFooterSupportSectionVisible();
    expect(supportFooter).toBe(true);

    const educationFooter = await homePage.isFooterEducationSectionVisible();
    expect(educationFooter).toBe(true);

    const creditResourcesFooter = await homePage.isFooterCreditResourcesSectionVisible();
    expect(creditResourcesFooter).toBe(true);

    const businessFooter = await homePage.isFooterBusinessSectionVisible();
    expect(businessFooter).toBe(true);
  });

  test('[C91] Test Case 6: Navigate to Security Freeze page', async ({ page }) => {
    // Act — click Security freeze card
    await homePage.clickSecurityFreeze();

    // Assert — navigated to Security Freeze page
    await expect(page).toHaveURL(TD.urlPatterns.securityFreeze, { timeout: 15000 });
  });

  test('[C92] Test Case 7: Navigate to Disputes page', async ({ page }) => {
    // Act — click Disputes card
    await homePage.clickDisputes();

    // Assert — navigated to Disputes page
    await expect(page).toHaveURL(TD.urlPatterns.disputes, { timeout: 15000 });
  });

  test('[C93] Test Case 8: Navigate to Fraud Alert page', async ({ page }) => {
    // Act — click Fraud alert card
    await homePage.clickFraudAlert();

    // Assert — navigated to Fraud Alert page
    await expect(page).toHaveURL(TD.urlPatterns.fraudAlert, { timeout: 15000 });
  });

  test('[C94] Test Case 9: Verify Credit menu item is displayed in header', async ({ page }) => {
    // Assert — nav button is visible in the header navigation
    const isVisible = await homePage.isNavCreditVisible();
    expect(isVisible).toBe(true);
  });

  test('[C95] Test Case 10: Verify Protection menu item is displayed in header', async ({ page }) => {
    // Assert — nav button is visible in the header navigation
    const isVisible = await homePage.isNavProtectionVisible();
    expect(isVisible).toBe(true);
  });

  test('[C96] Test Case 11: Verify Money menu item is displayed in header', async ({ page }) => {
    // Assert — nav button is visible in the header navigation
    const isVisible = await homePage.isNavMoneyVisible();
    expect(isVisible).toBe(true);
  });

  test('[C97] Test Case 12: Verify Credit Cards menu item is displayed in header', async ({ page }) => {
    // Assert — nav button is visible in the header navigation
    const isVisible = await homePage.isNavCreditCardsVisible();
    expect(isVisible).toBe(true);
  });

  test('[C98] Test Case 13: Verify Loans menu item is displayed in header', async ({ page }) => {
    // Assert — nav button is visible in the header navigation
    const isVisible = await homePage.isNavLoansVisible();
    expect(isVisible).toBe(true);
  });

  test('[C99] Test Case 14: Verify Insurance menu item is displayed in header', async ({ page }) => {
    // Assert — nav button is visible in the header navigation
    const isVisible = await homePage.isNavInsuranceVisible();
    expect(isVisible).toBe(true);
  });
});
