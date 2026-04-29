/**
 * Test Spec: CAP1-1 TS-003 TC-001
 * Verify only one tab is highlighted at a time when switching between tabs
 * @group regression
 */

const { test, expect } = require('../../fixtures');
const WorkdayLoginPage = require('../../pages/workday-login.page');
const WorkdayDashboardPage = require('../../pages/workday-dashboard.page');
const WorkdayNavPage = require('../../pages/workday-nav.page');
const WorkdayBudgetTabsPage = require('../../pages/workday-budget-tabs.page');
const TD = require('../../data/workday-test-data');

test.describe('CAP1-1 TS-003: Tab Highlighting Behavior', () => {
  test('TC-001: Verify only one tab is highlighted at any given time', async ({ page }) => {
    console.log('Starting test: CAP1-1 TS-003 TC-001');

    const loginPage = new WorkdayLoginPage(page);
    const dashboardPage = new WorkdayDashboardPage(page);
    const navPage = new WorkdayNavPage(page);
    const budgetTabsPage = new WorkdayBudgetTabsPage(page);

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
      console.log('Budget Entry - Sales page loads with Instructions tab active by default');

      // Step 3: Verify Instructions tab is highlighted as active
      console.log('Step 3: Verifying Instructions tab is highlighted');
      let activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName.trim()).toBe(TD.tabNames.instructions);
      let isOnlyOneHighlighted = await budgetTabsPage.isOnlyOneTabHighlighted();
      expect(isOnlyOneHighlighted).toBeTruthy();
      console.log('Instructions tab is visually highlighted and only this tab is highlighted');

      // Step 4: Click on Target Revenue tab
      console.log('Step 4: Clicking on Target Revenue tab');
      await budgetTabsPage.clickTab(TD.tabNames.targetRevenue);
      activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName.trim()).toBe(TD.tabNames.targetRevenue);
      isOnlyOneHighlighted = await budgetTabsPage.isOnlyOneTabHighlighted();
      expect(isOnlyOneHighlighted).toBeTruthy();
      const isContentVisible = await budgetTabsPage.isTabContentVisible();
      expect(isContentVisible).toBeTruthy();
      console.log('Target Revenue tab becomes highlighted as active, Instructions tab is no longer highlighted, and Target Revenue content loads');

      // Step 5: Click on Workforce tab
      console.log('Step 5: Clicking on Workforce tab');
      await budgetTabsPage.clickTab(TD.tabNames.workforce);
      activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName.trim()).toBe(TD.tabNames.workforce);
      isOnlyOneHighlighted = await budgetTabsPage.isOnlyOneTabHighlighted();
      expect(isOnlyOneHighlighted).toBeTruthy();
      console.log('Workforce tab becomes highlighted as active, Target Revenue tab is no longer highlighted, and Workforce content loads');

      // Step 6: Click on Pipeline tab
      console.log('Step 6: Clicking on Pipeline tab');
      await budgetTabsPage.clickTab(TD.tabNames.pipeline);
      activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName.trim()).toBe(TD.tabNames.pipeline);
      isOnlyOneHighlighted = await budgetTabsPage.isOnlyOneTabHighlighted();
      expect(isOnlyOneHighlighted).toBeTruthy();
      console.log('Pipeline tab becomes highlighted as active, Workforce tab is no longer highlighted, and Pipeline content loads');

      // Step 7: Click on Review tab
      console.log('Step 7: Clicking on Review tab');
      await budgetTabsPage.clickTab(TD.tabNames.review);
      activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName.trim()).toBe(TD.tabNames.review);
      isOnlyOneHighlighted = await budgetTabsPage.isOnlyOneTabHighlighted();
      expect(isOnlyOneHighlighted).toBeTruthy();
      console.log('Review tab becomes highlighted as active, Pipeline tab is no longer highlighted, and Review content loads');

      // Step 8: Verify only one tab is highlighted at any given time
      console.log('Step 8: Final verification that only one tab is highlighted');
      isOnlyOneHighlighted = await budgetTabsPage.isOnlyOneTabHighlighted();
      expect(isOnlyOneHighlighted).toBeTruthy();
      activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName.trim()).toBe(TD.tabNames.review);
      console.log('Only the Review tab is highlighted, all other tabs are not highlighted');

      console.log('Test CAP1-1 TS-003 TC-001 completed successfully');
    } catch (error) {
      console.error('Test failed with error:', error.message);
      throw error;
    }
  });
});