/**
 * Test Spec: CAP1-1 TS-002 TC-001
 * Verify all 12 tabs are present in correct order on Budget Entry - Sales page
 * @group regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayNavPage = require('../../pages/workday-nav.page');
const WorkdayBudgetTabsPage = require('../../pages/workday-budget-tabs.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-002: Tab Presence and Order Verification', () => {
  test('TC-001: Verify all 12 tabs are visible in correct order with correct labels', async ({ page }) => {
    console.log('Starting test: CAP1-1 TS-002 TC-001');

    const loginPage = new WorkdayLoginPage(page);
    const dashboardPage = new WorkdayDashboardPage(page);
    const navPage = new WorkdayNavPage(page);
    const budgetTabsPage = new WorkdayBudgetTabsPage(page);

    try {
      // Step 1: Launch the application in a browser
      console.log('Step 1: Launching application');
      await loginPage.goto();
      const isLoginPageLoaded = await loginPage.isLoaded();
      expect(isLoginPageLoaded).toBeTruthy();
      console.log('Application login page loaded successfully');

      // Step 2: Enter valid Sales Budget Owner credentials and login
      console.log('Step 2: Logging in with Sales Budget Owner credentials');
      await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
      await dashboardPage.waitForLoad();
      const isDashboardLoaded = await dashboardPage.isLoaded();
      expect(isDashboardLoaded).toBeTruthy();
      console.log('User logged in successfully');

      // Step 3: Navigate to Budget Entry - Sales page
      console.log('Step 3: Navigating to Budget Entry - Sales page');
      await navPage.navigateToBudgetEntrySales();
      await budgetTabsPage.waitForTabStripLoad();
      console.log('Budget Entry - Sales page loaded successfully');

      // Step 4: Verify the presence and order of all tabs
      console.log('Step 4: Verifying presence and order of all 12 tabs');
      const actualTabNames = await budgetTabsPage.getAllTabNames();
      
      expect(actualTabNames.length).toBe(12);
      console.log('All 12 tabs are visible');

      // Verify order
      for (let i = 0; i < TD.expectedTabOrder.length; i++) {
        expect(actualTabNames[i]).toBe(TD.expectedTabOrder[i]);
      }
      console.log('All tabs are in the correct order: 1. Instructions, 2. Target Revenue, 3. Target Expense, 4. Workforce, 5. Product Revenue, 6. Sensitivity Analysis, 7. Pipeline, 8. Travel, 9. Capital, 10. Expenses, 11. Variances, 12. Review');

      // Step 5: Verify each tab label matches the expected name
      console.log('Step 5: Verifying each tab label');
      for (const tabName of TD.expectedTabOrder) {
        const isVisible = await budgetTabsPage.isTabVisible(tabName);
        expect(isVisible).toBeTruthy();
      }
      console.log('Each tab is labeled correctly as per the specified order');

      console.log('Test CAP1-1 TS-002 TC-001 completed successfully');
    } catch (error) {
      console.error('Test failed with error:', error.message);
      throw error;
    }
  });
});