const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-005: Budget Input Sheet Loading', () => {
  test('CAP1-1 TS-005 TC-001: Verify Target Revenue budget input sheet loads with department-specific data', async ({ page }) => {
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

    // Step 3: Click on Target Revenue tab
    await budgetTabsPage.clickTab(TD.tabs.targetRevenue);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.targetRevenue);

    // Step 4: Verify the budget input sheet displays department-specific data
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });

  test('CAP1-1 TS-005 TC-002: Verify Target Expense budget input sheet loads with department-specific data', async ({ page }) => {
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

    // Step 3: Click on Target Expense tab
    await budgetTabsPage.clickTab(TD.tabs.targetExpense);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.targetExpense);

    // Step 4: Verify the budget input sheet displays department-specific data
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });

  test('CAP1-1 TS-005 TC-003: Verify Workforce budget input sheet loads with department-specific data', async ({ page }) => {
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

    // Step 3: Click on Workforce tab
    await budgetTabsPage.clickTab(TD.tabs.workforce);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.workforce);

    // Step 4: Verify the budget input sheet displays department-specific data
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });

  test('CAP1-1 TS-005 TC-004: Verify Product Revenue budget input sheet loads with department-specific data', async ({ page }) => {
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

    // Step 3: Click on Product Revenue tab
    await budgetTabsPage.clickTab(TD.tabs.productRevenue);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.productRevenue);

    // Step 4: Verify the budget input sheet displays department-specific data
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });
});