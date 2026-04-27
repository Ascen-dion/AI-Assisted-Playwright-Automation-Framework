const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-003: Tab Switching and Highlighting', () => {
  test('CAP1-1 TS-003 TC-001: Verify only one tab is highlighted at a time during navigation', async ({ page }) => {
    const loginPage = new AdaptiveLoginPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);
    const budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application and login with Sales Budget Owner credentials
    await loginPage.goto(TD.urls.login);
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await expect(dashboardPage.getDashboardContainer()).toBeVisible({ timeout: 15000 });

    // Step 2: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');
    await page.waitForLoadState('domcontentloaded');

    // Step 3: Verify Instructions tab is highlighted as active
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.instructions);
    await expect(budgetTabsPage.getTabContent()).toBeVisible();

    // Step 4: Click on Target Revenue tab
    await budgetTabsPage.clickTab(TD.tabs.targetRevenue);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.targetRevenue);
    await expect(budgetTabsPage.getTabContent()).toBeVisible();

    // Step 5: Click on Workforce tab
    await budgetTabsPage.clickTab(TD.tabs.workforce);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.workforce);
    await expect(budgetTabsPage.getTabContent()).toBeVisible();

    // Step 6: Click on Pipeline tab
    await budgetTabsPage.clickTab(TD.tabs.pipeline);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.pipeline);
    await expect(budgetTabsPage.getTabContent()).toBeVisible();

    // Step 7: Click on Expenses tab
    await budgetTabsPage.clickTab(TD.tabs.expenses);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.expenses);
    await expect(budgetTabsPage.getTabContent()).toBeVisible();

    // Step 8: Click on Review tab
    await budgetTabsPage.clickTab(TD.tabs.review);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.review);
    await expect(budgetTabsPage.getTabContent()).toBeVisible();

    // Step 9: Verify only one tab is highlighted at any given time
    const allActiveTabs = await page.locator('[role="tab"][aria-selected="true"]').count();
    expect(allActiveTabs).toBe(1);
  });
});