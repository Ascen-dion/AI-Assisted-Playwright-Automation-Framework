/**
 * Test Spec: CAP1-1 TS-001 TC-001
 * Description: Verify Instructions tab is selected by default on Budget Entry - Sales page
 * @regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayBudgetSalesPage = require('../../pages/workday-budget-sales.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-001: Default Tab Selection', () => {
  test('CAP1-1 TS-001 TC-001: Verify Instructions tab is selected by default @regression', async ({ page }) => {
    const loginPage = new WorkdayLoginPage(page);
    const dashboardPage = new WorkdayDashboardPage(page);
    const budgetSalesPage = new WorkdayBudgetSalesPage(page);

    // Step 1: Launch the application in a browser
    await test.step('Launch the application', async () => {
      await loginPage.navigateToApp(TD.appUrl);
      await loginPage.verifyLoginPageLoaded();
    });

    // Step 2: Enter valid Sales Budget Owner credentials
    await test.step('Enter valid Sales Budget Owner credentials', async () => {
      await loginPage.enterUsername(TD.salesBudgetOwner.username);
      await loginPage.enterPassword(TD.salesBudgetOwner.password);
      await loginPage.verifyCredentialsAccepted();
    });

    // Step 3: Click on Login button
    await test.step('Click on Login button', async () => {
      await loginPage.clickLogin();
      await dashboardPage.verifyUserLoggedIn();
    });

    // Step 4: Navigate to Budget Entry - Sales page
    await test.step('Navigate to Budget Entry - Sales page', async () => {
      await dashboardPage.navigateToBudgetEntrySales();
      await budgetSalesPage.verifyPageLoaded();
    });

    // Step 5: Verify the default selected tab
    await test.step('Verify Instructions tab is highlighted as active by default', async () => {
      await budgetSalesPage.verifyDefaultTabIsInstructions();
      await budgetSalesPage.verifyInstructionsTabActive();
    });

    // Step 6: Verify the content displayed
    await test.step('Verify Instructions content is displayed', async () => {
      await budgetSalesPage.verifyInstructionsContentDisplayed();
    });
  });
});