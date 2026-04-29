/**
 * Test Spec: CAP1-1 TS-005 TC-001
 * Verify budget context (department, time period, currency, plan version) and Target Revenue sheet loads
 * @group regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayNavPage = require('../../pages/workday-nav.page');
const WorkdayBudgetTabsPage = require('../../pages/workday-budget-tabs.page');
const WorkdayBudgetHeaderPage = require('../../pages/workday-budget-header.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-005: Budget Context and Target Revenue Sheet Verification', () => {
  test('TC-001: Verify budget context is set correctly and Target Revenue sheet loads for Sales department', async ({ page }) => {
    console.log('Starting test: CAP1-1 TS-005 TC-001');

    const loginPage = new WorkdayLoginPage(page);
    const dashboardPage = new WorkdayDashboardPage(page);
    const navPage = new WorkdayNavPage(page);
    const budgetTabsPage = new WorkdayBudgetTabsPage(page);
    const budgetHeaderPage = new WorkdayBudgetHeaderPage(page);

    try {
      // Step 1: Launch the application and login as Sales Budget Owner
      console.log('Step 1: Launching application and logging in');
      await loginPage.goto();
      await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
      await dashboardPage.waitForLoad();
      const isDashboardLoaded = await dashboardPage.isLoaded();
      expect(isDashboardLoaded).toBeTruthy();
      console.log('User logged in successfully');

      // Step 2: Navigate to Budget Entry - Sales page
      console.log('Step 2: Navigating to Budget Entry - Sales page');
      await navPage.navigateToBudgetEntrySales();
      await budgetTabsPage.waitForTabStripLoad();
      const isInstructionsActive = await budgetTabsPage.isInstructionsTabActive();
      expect(isInstructionsActive).toBeTruthy();
      console.log('Budget Entry - Sales page loads with Instructions tab active');

      // Step 3: Verify the department context is set
      console.log('Step 3: Verifying department context');
      const pageTitle = await budgetHeaderPage.getPageTitle();
      expect(pageTitle).toContain(TD.budgetContext.department);
      console.log('Department is set to Sales');

      // Step 4: Verify the time period context is set
      console.log('Step 4: Verifying time period context');
      const timePeriod = await budgetHeaderPage.getTimePeriod();
      expect(timePeriod).toContain(TD.budgetContext.timePeriod);
      console.log('Time period is set to Q1');

      // Step 5: Verify the currency context is set
      console.log('Step 5: Verifying currency context');
      const currency = await budgetHeaderPage.getCurrency();
      expect(currency).toContain(TD.budgetContext.currency);
      console.log('Currency is set to USD');

      // Step 6: Verify the plan version context is set
      console.log('Step 6: Verifying plan version context');
      const planVersion = await budgetHeaderPage.getPlanVersion();
      expect(planVersion).toContain(TD.budgetContext.planVersion);
      console.log('Plan version is set to Initial');

      // Step 7: Click on the Target Revenue tab
      console.log('Step 7: Clicking on Target Revenue tab');
      await budgetTabsPage.clickTab(TD.tabNames.targetRevenue);
      const activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName.trim()).toBe(TD.tabNames.targetRevenue);
      const ariaSelected = await budgetTabsPage.getTabAriaSelected(TD.tabNames.targetRevenue);
      expect(ariaSelected).toBe('true');
      console.log('Target Revenue tab becomes active and is highlighted');

      // Step 8: Verify the Target Revenue budget input sheet loads
      console.log('Step 8: Verifying Target Revenue budget input sheet loads');
      const isContentVisible = await budgetTabsPage.isTabContentVisible();
      expect(isContentVisible).toBeTruthy();
      console.log('Target Revenue budget input sheet is displayed with fields for entering department\'s revenue figures');

      // Step 9: Verify the sheet displays data for the correct department
      console.log('Step 9: Verifying sheet displays data for Sales department');
      const titleCheck = await budgetHeaderPage.getPageTitle();
      expect(titleCheck).toContain(TD.budgetContext.department);
      console.log('Budget input sheet shows data specific to Sales department');

      console.log('Test CAP1-1 TS-005 TC-001 completed successfully');
    } catch (error) {
      console.error('Test failed with error:', error.message);
      throw error;
    }
  });
});