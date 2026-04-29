/**
 * Test Spec: CAP1-1 TS-001 TC-001
 * Verify Instructions tab is selected by default on Budget Entry - Sales page
 * @group regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayNavPage = require('../../pages/workday-nav.page');
const WorkdayBudgetTabsPage = require('../../pages/workday-budget-tabs.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-001: Default Tab Selection on Budget Entry - Sales', () => {
  test('TC-001: Verify Instructions tab is highlighted by default and content is displayed', async ({ page }) => {
    console.log('Starting test: CAP1-1 TS-001 TC-001');

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

      // Step 2: Enter valid Sales Budget Owner credentials
      console.log('Step 2: Entering credentials');
      await loginPage.enterUsername(TD.credentials.salesBudgetOwner.username);
      await loginPage.enterPassword(TD.credentials.salesBudgetOwner.password);
      console.log('Credentials entered successfully');

      // Step 3: Click on Login button
      console.log('Step 3: Clicking login button');
      await loginPage.clickSignIn();
      await dashboardPage.waitForLoad();
      const isDashboardLoaded = await dashboardPage.isLoaded();
      expect(isDashboardLoaded).toBeTruthy();
      console.log('User logged in and dashboard loaded successfully');

      // Step 4: Navigate to Budget Entry - Sales page
      console.log('Step 4: Navigating to Budget Entry - Sales page');
      await navPage.navigateToBudgetEntrySales();
      await budgetTabsPage.waitForTabStripLoad();
      console.log('Budget Entry - Sales page loaded successfully');

      // Step 5: Verify the default selected tab
      console.log('Step 5: Verifying default selected tab');
      const isInstructionsActive = await budgetTabsPage.isInstructionsTabActive();
      expect(isInstructionsActive).toBeTruthy();
      
      const activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName.trim()).toBe(TD.tabNames.instructions);
      console.log('Instructions tab is highlighted as active by default');

      // Step 6: Verify the content displayed
      console.log('Step 6: Verifying content is displayed');
      const isContentVisible = await budgetTabsPage.isTabContentVisible();
      expect(isContentVisible).toBeTruthy();
      console.log('Instructions section content is displayed');

      console.log('Test CAP1-1 TS-001 TC-001 completed successfully');
    } catch (error) {
      console.error('Test failed with error:', error.message);
      throw error;
    }
  });
});