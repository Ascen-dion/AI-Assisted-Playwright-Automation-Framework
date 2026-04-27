const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-008: Summary View Loading', () => {
  test('CAP1-1 TS-008 TC-001: Verify Variances summary view displays budget performance data', async ({ page }) => {
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

    // Step 3: Click on Variances tab
    await budgetTabsPage.clickTab(TD.tabs.variances);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.variances);

    // Step 4: Verify the summary view displays budget performance data
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });

  test('CAP1-1 TS-008 TC-002: Verify Review summary view displays comprehensive budget information', async ({ page }) => {
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

    // Step 3: Click on Review tab
    await budgetTabsPage.clickTab(TD.tabs.review);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    expect(await budgetTabsPage.getActiveTabName()).toBe(TD.tabs.review);

    // Step 4: Verify the summary view displays comprehensive budget information from all sections
    await expect(budgetTabsPage.getTabContent()).toBeVisible();

    // Step 5: Verify the presence of submit functionality
    const submitButton = page.locator('button:has-text("Submit"), button:has-text("Save"), [aria-label*="Submit"]').first();
    await expect(submitButton).toBeVisible();
  });
});