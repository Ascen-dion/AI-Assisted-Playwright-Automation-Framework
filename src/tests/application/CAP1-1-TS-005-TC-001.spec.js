/**
 * Test Spec: CAP1-1 TS-005 TC-001
 * Description: Verify budget context and Target Revenue sheet loads correctly
 * Test Scenario: TS-005
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const AdaptiveBudgetHeaderPage = require('../../pages/adaptive-budget-header.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1: Budget Entry - Sales Context and Target Revenue Verification', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navPage;
  let dashboardPage;
  let budgetTabsPage;
  let budgetHeaderPage;

  test('[CAP1-1 TS-005 TC-001] Verify budget context and Target Revenue sheet loads', async ({ page }) => {
    // Initialize page objects
    loginPage = new AdaptiveLoginPage(page);
    navPage = new AdaptiveNavigationPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);
    budgetHeaderPage = new AdaptiveBudgetHeaderPage(page);

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
      const activeTab = await budgetTabsPage.getActiveTabName();
      expect(activeTab).toBe('Instructions');
    });

    // Step 3: Verify the department context is set
    await test.step('Step 3: Verify department context is Sales', async () => {
      const pageTitle = await budgetHeaderPage.getPageTitle();
      expect(pageTitle).toContain(TD.context.department);
    });

    // Step 4: Verify the time period context is set
    await test.step('Step 4: Verify time period is Q1', async () => {
      const timePeriod = await budgetHeaderPage.getSelectedTimePeriod();
      expect(timePeriod).toContain(TD.context.timePeriod);
    });

    // Step 5: Verify the currency context is set
    await test.step('Step 5: Verify currency is USD', async () => {
      const currency = await budgetHeaderPage.getSelectedCurrency();
      expect(currency).toContain(TD.context.currency);
    });

    // Step 6: Verify the plan version context is set
    await test.step('Step 6: Verify plan version is Initial', async () => {
      const contextValid = await budgetHeaderPage.verifyContext(TD.context);
      expect(contextValid).toBeTruthy();
    });

    // Step 7: Click on the Target Revenue tab
    await test.step('Step 7: Click Target Revenue tab', async () => {
      await budgetTabsPage.clickTab('Target Revenue');
      const activeTab = await budgetTabsPage.getActiveTabName();
      expect(activeTab).toBe('Target Revenue');
      expect(await budgetTabsPage.isTabActive('Target Revenue')).toBeTruthy();
    });

    // Step 8: Verify the Target Revenue budget input sheet loads
    await test.step('Step 8: Verify Target Revenue sheet loads', async () => {
      const isContentVisible = await budgetTabsPage.isTabContentVisible();
      expect(isContentVisible).toBeTruthy();
    });

    // Step 9: Verify the sheet displays data for the correct department
    await test.step('Step 9: Verify sheet shows Sales department data', async () => {
      const pageTitle = await budgetHeaderPage.getPageTitle();
      expect(pageTitle).toContain(TD.context.department);
      
      const contextValid = await budgetHeaderPage.verifyContext({
        department: TD.context.department
      });
      expect(contextValid).toBeTruthy();
    });
  });
});