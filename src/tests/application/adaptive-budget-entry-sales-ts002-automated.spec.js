const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('CAP1-1 TS-002: Budget Section Tabs Verification', () => {
  test('CAP1-1 TS-002 TC-001: Verify presence and order of all 12 budget section tabs', async ({ page }) => {
    const loginPage = new AdaptiveLoginPage(page);
    const dashboardPage = new AdaptiveDashboardPage(page);
    const navigationPage = new AdaptiveNavigationPage(page);
    const budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application in a browser
    await loginPage.goto(TD.urls.login);

    // Step 2: Login with valid Sales Budget Owner credentials
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await expect(dashboardPage.getDashboardContainer()).toBeVisible({ timeout: 15000 });

    // Step 3: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');
    await page.waitForLoadState('domcontentloaded');

    // Step 4: Verify the presence and order of all budget section tabs
    const allTabs = await budgetTabsPage.getAllTabNames();
    expect(allTabs.length).toBe(12);
    
    // Verify each tab in the correct order
    for (let i = 0; i < TD.tabOrder.length; i++) {
      expect(allTabs[i]).toBe(TD.tabOrder[i]);
    }

    // Step 5: Verify each tab label is correctly displayed
    for (const tabName of TD.tabOrder) {
      await expect(budgetTabsPage.getTab(tabName)).toBeVisible();
    }
  });
});