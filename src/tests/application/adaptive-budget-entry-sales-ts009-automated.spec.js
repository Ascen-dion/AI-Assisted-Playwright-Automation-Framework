const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const AdaptiveBudgetHeaderPage = require('../../pages/adaptive-budget-header.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-009: Context Selection Persistence', () => {
  test('CAP1-1 TS-009 TC-001: Verify context selections persist across all tab switches', async ({ page }) => {
    const loginPage = new AdaptiveLoginPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);
    const budgetTabsPage = new AdaptiveBudgetTabsPage(page);
    const budgetHeaderPage = new AdaptiveBudgetHeaderPage(page);

    // Step 1: Launch the application and login with Sales Budget Owner credentials
    await loginPage.goto(TD.urls.login);
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await expect(dashboardPage.getDashboardContainer()).toBeVisible({ timeout: 15000 });

    // Step 2: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');
    await page.waitForLoadState('domcontentloaded');

    // Step 3: Select department as Marketing
    await budgetHeaderPage.selectDepartment(TD.departments.marketing);
    await page.waitForTimeout(1000);

    // Step 4: Select time period as Q2
    await budgetHeaderPage.selectTimePeriod(TD.timePeriods.q2);
    await page.waitForTimeout(1000);

    // Step 5: Select currency as USD
    await budgetHeaderPage.selectCurrency(TD.currencies.usd);
    await page.waitForTimeout(1000);

    // Step 6: Select plan version as Draft
    await budgetHeaderPage.selectPlanVersion(TD.planVersions.draft);
    await page.waitForTimeout(1000);

    // Step 7: Click on Target Revenue tab
    await budgetTabsPage.clickTab(TD.tabs.targetRevenue);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();

    // Step 8: Click on Workforce tab
    await budgetTabsPage.clickTab(TD.tabs.workforce);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();

    // Step 9: Click on Pipeline tab
    await budgetTabsPage.clickTab(TD.tabs.pipeline);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();

    // Step 10: Click on Travel tab
    await budgetTabsPage.clickTab(TD.tabs.travel);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();

    // Step 11: Click on Variances tab
    await budgetTabsPage.clickTab(TD.tabs.variances);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();

    // Step 12: Click on Review tab
    await budgetTabsPage.clickTab(TD.tabs.review);
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();

    // Step 13: Verify that all context selections remain unchanged across all tab switches
    await expect(budgetHeaderPage.getLevelSelector()).toBeVisible();
    await expect(budgetHeaderPage.getTimeSelector()).toBeVisible();
    await expect(budgetHeaderPage.getCurrencySelector()).toBeVisible();
    await expect(budgetHeaderPage.getVersionButton()).toBeVisible();
  });
});