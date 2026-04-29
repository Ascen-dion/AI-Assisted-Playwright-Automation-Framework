/**
 * Test Spec: CAP1-1 TS-003 TC-001
 * Description: Verify tab highlighting behavior when switching between tabs
 * @regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayBudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-003: Tab Highlighting Behavior', () => {
  test('CAP1-1 TS-003 TC-001: Verify only one tab is highlighted at a time @regression', async ({ page }) => {
    const loginPage = new WorkdayLoginPage(page);
    const dashboardPage = new WorkdayDashboardPage(page);
    const budgetSalesPage = new WorkdayBudgetSalesPage(page);

    // Step 1: Launch the application and login as Sales Budget Owner
    await test.step('Launch application and login', async () => {
      await loginPage.navigateToApp(TD.appUrl);
      await loginPage.verifyLoginPageLoaded();
      await loginPage.login(TD.salesBudgetOwner.username, TD.salesBudgetOwner.password);
      await dashboardPage.verifyUserLoggedIn();
    });

    // Step 2: Navigate to Budget Entry - Sales page
    await test.step('Navigate to Budget Entry - Sales page', async () => {
      await dashboardPage.navigateToBudgetEntrySales();
      await budgetSalesPage.verifyPageLoaded();
    });

    // Step 3: Verify Instructions tab is highlighted as active
    await test.step('Verify Instructions tab is highlighted', async () => {
      await budgetSalesPage.verifyInstructionsTabActive();
      await budgetSalesPage.verifyOnlyOneTabHighlighted();
    });

    // Step 4: Click on Target Revenue tab
    await test.step('Click on Target Revenue tab', async () => {
      await budgetSalesPage.clickTab('Target Revenue');
      await budgetSalesPage.verifyTabIsActive('Target Revenue');
      await budgetSalesPage.verifyTabContentLoads('Target Revenue');
      await budgetSalesPage.verifyOnlyOneTabHighlighted();
    });

    // Step 5: Click on Workforce tab
    await test.step('Click on Workforce tab', async () => {
      await budgetSalesPage.clickTab('Workforce');
      await budgetSalesPage.verifyTabIsActive('Workforce');
      await budgetSalesPage.verifyTabContentLoads('Workforce');
      await budgetSalesPage.verifyOnlyOneTabHighlighted();
    });

    // Step 6: Click on Pipeline tab
    await test.step('Click on Pipeline tab', async () => {
      await budgetSalesPage.clickTab('Pipeline');
      await budgetSalesPage.verifyTabIsActive('Pipeline');
      await budgetSalesPage.verifyTabContentLoads('Pipeline');
      await budgetSalesPage.verifyOnlyOneTabHighlighted();
    });

    // Step 7: Click on Review tab
    await test.step('Click on Review tab', async () => {
      await budgetSalesPage.clickTab('Review');
      await budgetSalesPage.verifyTabIsActive('Review');
      await budgetSalesPage.verifyTabContentLoads('Review');
      await budgetSalesPage.verifyOnlyOneTabHighlighted();
    });

    // Step 8: Verify only one tab is highlighted at any given time
    await test.step('Final verification - only Review tab is highlighted', async () => {
      await budgetSalesPage.verifyTabIsActive('Review');
      await budgetSalesPage.verifyOnlyOneTabHighlighted();
    });
  });
});