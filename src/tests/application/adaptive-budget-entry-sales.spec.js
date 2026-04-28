/**
 * Test Suite: Budget Entry - Sales Page Tests
 * Story: CAP1-1
 * @tags @smoke @regression @capital-one @adaptive-planning
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const AdaptiveBudgetHeaderPage = require('../../pages/adaptive-budget-header.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1: Budget Entry - Sales Page Tab Navigation', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let navPage;
  let tabsPage;
  let headerPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdaptiveLoginPage(page);
    navPage = new AdaptiveNavigationPage(page);
    tabsPage = new AdaptiveBudgetTabsPage(page);
    headerPage = new AdaptiveBudgetHeaderPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
  });

  test('[CAP1-1 TS-001 TC-001] Verify Instructions tab is selected by default', async ({ page }) => {
    // Step 1: Launch the application
    await loginPage.goto();
    await loginPage.verifyLoginPageLoaded();

    // Step 2-3: Enter credentials and login
    await loginPage.login(TD.SALES_BUDGET_OWNER.username, TD.SALES_BUDGET_OWNER.password);
    await dashboardPage.verifyUserLoggedIn();

    // Step 4: Navigate to Budget Entry - Sales page
    await navPage.navigateToBudgetEntrySales();

    // Step 5: Verify Instructions tab is highlighted as active by default
    await tabsPage.verifyTabIsActive('Instructions');
    const activeTab = await tabsPage.getActiveTabName();
    expect(activeTab).toBe('Instructions');

    // Step 6: Verify Instructions content is displayed
    await tabsPage.verifyInstructionsContent();
    await tabsPage.verifyTabContentDisplayed();
  });

  test('[CAP1-1 TS-002 TC-001] Verify all 12 tabs are present in correct order', async ({ page }) => {
    // Step 1: Launch the application
    await loginPage.goto();
    await loginPage.verifyLoginPageLoaded();

    // Step 2: Login with valid credentials
    await loginPage.login(TD.SALES_BUDGET_OWNER.username, TD.SALES_BUDGET_OWNER.password);
    await dashboardPage.verifyUserLoggedIn();

    // Step 3: Navigate to Budget Entry - Sales page
    await navPage.navigateToBudgetEntrySales();

    // Step 4-5: Verify presence and order of all tabs
    const actualTabNames = await tabsPage.getAllTabNames();
    expect(actualTabNames.length).toBe(12);
    
    // Verify each tab name matches expected
    for (let i = 0; i < TD.TAB_NAMES.length; i++) {
      expect(actualTabNames[i]).toBe(TD.TAB_NAMES[i]);
    }
  });

  test('[CAP1-1 TS-003 TC-001] Verify tab highlighting switches correctly when clicking different tabs', async ({ page }) => {
    // Step 1: Login as Sales Budget Owner
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER.username, TD.SALES_BUDGET_OWNER.password);
    await dashboardPage.verifyUserLoggedIn();

    // Step 2: Navigate to Budget Entry - Sales page
    await navPage.navigateToBudgetEntrySales();

    // Step 3: Verify Instructions tab is highlighted
    await tabsPage.verifyTabIsActive('Instructions');
    await tabsPage.verifyOnlyOneTabIsActive();

    // Step 4: Click Target Revenue tab
    await tabsPage.clickTab('Target Revenue');
    await tabsPage.verifyTabIsActive('Target Revenue');
    await tabsPage.verifyOnlyOneTabIsActive();
    await tabsPage.verifyTabContentDisplayed();

    // Step 5: Click Workforce tab
    await tabsPage.clickTab('Workforce');
    await tabsPage.verifyTabIsActive('Workforce');
    await tabsPage.verifyOnlyOneTabIsActive();
    await tabsPage.verifyTabContentDisplayed();

    // Step 6: Click Pipeline tab
    await tabsPage.clickTab('Pipeline');
    await tabsPage.verifyTabIsActive('Pipeline');
    await tabsPage.verifyOnlyOneTabIsActive();
    await tabsPage.verifyTabContentDisplayed();

    // Step 7: Click Review tab
    await tabsPage.clickTab('Review');
    await tabsPage.verifyTabIsActive('Review');
    await tabsPage.verifyOnlyOneTabIsActive();
    await tabsPage.verifyTabContentDisplayed();

    // Step 8: Verify only Review tab is highlighted
    const activeTab = await tabsPage.getActiveTabName();
    expect(activeTab).toBe('Review');
    await tabsPage.verifyOnlyOneTabIsActive();
  });

  test('[CAP1-1 TS-004 TC-001] Verify tab scroll arrows functionality', async ({ page }) => {
    // Step 1: Login as Sales Budget Owner
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER.username, TD.SALES_BUDGET_OWNER.password);
    await dashboardPage.verifyUserLoggedIn();

    // Step 2: Navigate to Budget Entry - Sales page
    await navPage.navigateToBudgetEntrySales();

    // Step 3: Resize browser window to restrict tab display
    await page.setViewportSize(TD.VIEWPORT_SIZES.NARROW);
    await page.waitForTimeout(500); // Allow UI to adjust

    // Step 4: Verify scroll arrows are visible
    await tabsPage.verifyScrollButtonsVisible();

    // Step 5: Verify left arrow is disabled when on first tab
    await tabsPage.verifyScrollLeftDisabled();

    // Step 6: Click right scroll arrow
    await tabsPage.clickScrollRight();
    await tabsPage.verifyScrollLeftEnabled();

    // Step 7: Click left scroll arrow
    await tabsPage.clickScrollLeft();

    // Step 8: Continue clicking left until first tab and verify left arrow is disabled
    await tabsPage.clickScrollLeft();
    await tabsPage.verifyScrollLeftDisabled();
  });

  test('[CAP1-1 TS-005 TC-001] Verify context and Target Revenue tab loads correctly', async ({ page }) => {
    // Step 1: Login as Sales Budget Owner
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER.username, TD.SALES_BUDGET_OWNER.password);
    await dashboardPage.verifyUserLoggedIn();

    // Step 2: Navigate to Budget Entry - Sales page
    await navPage.navigateToBudgetEntrySales();

    // Step 3-6: Verify context is set correctly
    await headerPage.verifyDepartmentContext(TD.DEPARTMENT);
    await headerPage.verifyTimePeriodContext(TD.TIME_PERIOD);
    await headerPage.verifyCurrencyContext(TD.CURRENCY);
    await headerPage.verifyPlanVersionContext(TD.PLAN_VERSION);

    // Step 7: Click Target Revenue tab
    await tabsPage.clickTab('Target Revenue');
    await tabsPage.verifyTabIsActive('Target Revenue');

    // Step 8-9: Verify Target Revenue sheet loads with correct department data
    await tabsPage.verifyTabContentDisplayed();
    await headerPage.verifyDepartmentContext(TD.DEPARTMENT);
  });
});