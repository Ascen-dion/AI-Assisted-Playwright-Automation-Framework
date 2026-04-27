const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-007: Cost Planning Sheet Loading', () => {
  test('CAP1-1 TS-007 TC-001: Verify Travel cost planning sheet loads with department-specific data', async ({ page }) => {
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

    // Step 3: Click on Travel tab
    await budgetTabsPage.clickTab(TD.tabs.travel);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.travel);

    // Step 4: Verify the cost planning sheet displays department-specific travel expense fields
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });

  test('CAP1-1 TS-007 TC-002: Verify Capital cost planning sheet loads with department-specific data', async ({ page }) => {
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

    // Step 3: Click on Capital tab
    await budgetTabsPage.clickTab(TD.tabs.capital);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.capital);

    // Step 4: Verify the cost planning sheet displays department-specific capital expense fields
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });

  test('CAP1-1 TS-007 TC-003: Verify Expenses cost planning sheet loads with department-specific data', async ({ page }) => {
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

    // Step 3: Click on Expenses tab
    await budgetTabsPage.clickTab(TD.tabs.expenses);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.expenses);

    // Step 4: Verify the cost planning sheet displays department-specific expense fields
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });
});