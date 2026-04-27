const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-001: Default Active Tab Verification', () => {
  test('CAP1-1 TS-001 TC-001: Verify Instructions tab is active by default on Budget Entry - Sales page', async ({ page }) => {
    const loginPage = new AdaptiveLoginPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);
    const budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application in a browser
    await loginPage.goto(TD.urls.login);
    await expect(page).toHaveURL(TD.urls.login);

    // Step 2: Enter valid username for Sales Budget Owner role
    await loginPage.enterUsername(TD.credentials.salesBudgetOwner.username);
    await expect(loginPage.getUsernameField()).toHaveValue(TD.credentials.salesBudgetOwner.username);

    // Step 3: Enter valid password
    await loginPage.enterPassword(TD.credentials.salesBudgetOwner.password);
    await expect(loginPage.getPasswordField()).toHaveValue(TD.credentials.salesBudgetOwner.password);

    // Step 4: Click on Login button
    await loginPage.clickSignIn();
    await expect(dashboardPage.getDashboardContainer()).toBeVisible({ timeout: 15000 });

    // Step 5: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');
    await page.waitForLoadState('domcontentloaded');

    // Step 6: Verify the default active tab on page load
    await expect(budgetTabsPage.getActiveTab()).toBeVisible();
    const activeTabName = await budgetTabsPage.getActiveTabName();
    expect(activeTabName).toBe(TD.tabs.instructions);
    await expect(budgetTabsPage.getTabContent()).toBeVisible();
  });
});