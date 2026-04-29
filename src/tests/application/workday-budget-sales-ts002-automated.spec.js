/**
 * Test Spec: CAP1-1 TS-002 TC-001
 * Description: Verify all 12 tabs are present in correct order
 * @regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayBudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-002: Tab Presence and Order', () => {
  test('CAP1-1 TS-002 TC-001: Verify all 12 tabs are present in correct order @regression', async ({ page }) => {
    const loginPage = new WorkdayLoginPage(page);
    const dashboardPage = new WorkdayDashboardPage(page);
    const budgetSalesPage = new WorkdayBudgetSalesPage(page);

    // Step 1: Launch the application in a browser
    await test.step('Launch the application', async () => {
      await loginPage.navigateToApp(TD.appUrl);
      await loginPage.verifyLoginPageLoaded();
    });

    // Step 2: Enter valid Sales Budget Owner credentials and login
    await test.step('Enter credentials and login', async () => {
      await loginPage.login(TD.salesBudgetOwner.username, TD.salesBudgetOwner.password);
      await dashboardPage.verifyUserLoggedIn();
    });

    // Step 3: Navigate to Budget Entry - Sales page
    await test.step('Navigate to Budget Entry - Sales page', async () => {
      await dashboardPage.navigateToBudgetEntrySales();
      await budgetSalesPage.verifyPageLoaded();
    });

    // Step 4: Verify the presence and order of all tabs
    await test.step('Verify all 12 tabs are visible in correct order', async () => {
      await budgetSalesPage.verifyAllTabsPresent();
    });

    // Step 5: Verify each tab label matches the expected name
    await test.step('Verify each tab label is correct', async () => {
      await budgetSalesPage.verifyTabLabels();
    });
  });
});