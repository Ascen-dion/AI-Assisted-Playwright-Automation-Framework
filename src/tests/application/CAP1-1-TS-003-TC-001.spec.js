/**
 * Test Spec: CAP1-1 TS-003 TC-001
 * Description: Verify tab highlighting behavior when switching between tabs
 * Test Scenario: TS-003
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1: Budget Entry - Sales Tab Highlighting Verification', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navPage;
  let dashboardPage;
  let budgetTabsPage;

  test('[CAP1-1 TS-003 TC-001] Verify only one tab is highlighted at any given time', async ({ page }) => {
    // Initialize page objects
    loginPage = new AdaptiveLoginPage(page);
    navPage = new AdaptiveNavigationPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application and login as Sales Budget Owner
    await test.step('Step 1: Login as Sales Budget Owner', async () => {
      await loginPage.goto(TD.urls.baseUrl + TD.urls.loginPage);
      await loginPage.login(TD.users.salesBudgetOwner.username, TD.users.salesBudgetOwner.password);
      await dashboardPage.waitForDashboardToLoad();
      expect(await dashboardPage.isDashboardLoaded()).toBeTruthy();
    });

    // Step 2: Navigate to Budget Entry - Sales page
    await test.step('Step 2: Navigate to Budget Entry - Sales page', async () => {
      await navPage.navigateToBudgetEntrySales();
      await budgetTabsPage.waitForTabsToLoad();
    });

    // Step 3: Verify Instructions tab is highlighted as active
    await test.step('Step 3: Verify Instructions tab is highlighted', async () => {
      const activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName).toBe('Instructions');
      expect(await budgetTabsPage.isOnlyOneTabHighlighted()).toBeTruthy();
    });

    // Step 4: Click on Target Revenue tab
    await test.step('Step 4: Click Target Revenue tab and verify highlighting', async () => {
      await budgetTabsPage.clickTab('Target Revenue');
      const activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName).toBe('Target Revenue');
      expect(await budgetTabsPage.isTabActive('Target Revenue')).toBeTruthy();
      expect(await budgetTabsPage.isTabActive('Instructions')).toBeFalsy();
      expect(await budgetTabsPage.isTabContentVisible()).toBeTruthy();
    });

    // Step 5: Click on Workforce tab
    await test.step('Step 5: Click Workforce tab and verify highlighting', async () => {
      await budgetTabsPage.clickTab('Workforce');
      const activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName).toBe('Workforce');
      expect(await budgetTabsPage.isTabActive('Workforce')).toBeTruthy();
      expect(await budgetTabsPage.isTabActive('Target Revenue')).toBeFalsy();
      expect(await budgetTabsPage.isTabContentVisible()).toBeTruthy();
    });

    // Step 6: Click on Pipeline tab
    await test.step('Step 6: Click Pipeline tab and verify highlighting', async () => {
      await budgetTabsPage.clickTab('Pipeline');
      const activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName).toBe('Pipeline');
      expect(await budgetTabsPage.isTabActive('Pipeline')).toBeTruthy();
      expect(await budgetTabsPage.isTabActive('Workforce')).toBeFalsy();
      expect(await budgetTabsPage.isTabContentVisible()).toBeTruthy();
    });

    // Step 7: Click on Review tab
    await test.step('Step 7: Click Review tab and verify highlighting', async () => {
      await budgetTabsPage.clickTab('Review');
      const activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName).toBe('Review');
      expect(await budgetTabsPage.isTabActive('Review')).toBeTruthy();
      expect(await budgetTabsPage.isTabActive('Pipeline')).toBeFalsy();
      expect(await budgetTabsPage.isTabContentVisible()).toBeTruthy();
    });

    // Step 8: Verify only one tab is highlighted at any given time
    await test.step('Step 8: Verify only one tab is highlighted', async () => {
      expect(await budgetTabsPage.isOnlyOneTabHighlighted()).toBeTruthy();
      const activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName).toBe('Review');
    });
  });
});