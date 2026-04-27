const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-006: Planning View Loading', () => {
  test('CAP1-1 TS-006 TC-001: Verify Sensitivity Analysis planning view loads', async ({ page }) => {
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

    // Step 3: Click on Sensitivity Analysis tab
    await budgetTabsPage.clickTab(TD.tabs.sensitivityAnalysis);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.sensitivityAnalysis);

    // Step 4: Verify the planning view displays tools for modeling assumptions
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });

  test('CAP1-1 TS-006 TC-002: Verify Pipeline planning view loads', async ({ page }) => {
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

    // Step 3: Click on Pipeline tab
    await budgetTabsPage.clickTab(TD.tabs.pipeline);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.pipeline);

    // Step 4: Verify the planning view displays sales pipeline data
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });
});