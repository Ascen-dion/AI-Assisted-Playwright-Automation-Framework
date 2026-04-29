const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1 TS-002: Verify all 12 tabs are present in correct order', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let dashboardPage;
  let navigationPage;
  let budgetTabsPage;

  test('[CAP1-1 TS-002 TC-001] Verify presence and order of all 12 tabs', async ({ page }) => {
    loginPage = new AdaptiveLoginPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
    navigationPage = new AdaptiveNavigationPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application in a browser
    await loginPage.goto();
    await expect(page).toHaveURL(TD.urlPatterns.login);

    // Step 2: Enter valid Sales Budget Owner credentials and login
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.page.locator('main, .dashboard, [role="main"]').first()).toBeVisible();

    // Step 3: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await budgetTabsPage.waitForTabsLoad();

    // Step 4: Verify the presence and order of all tabs
    const tabCount = await budgetTabsPage.getTabCount();
    expect(tabCount).toBe(12);

    const actualTabNames = await budgetTabsPage.getAllTabNames();
    
    // Step 5: Verify each tab label matches the expected name
    for (let i = 0; i < TD.tabs.all.length; i++) {
      expect(actualTabNames[i]).toContain(TD.tabs.all[i]);
    }

    // Verify all expected tabs are present
    for (const expectedTab of TD.tabs.all) {
      const isVisible = await budgetTabsPage.isTabVisible(expectedTab);
      expect(isVisible).toBe(true);
    }
  });
});