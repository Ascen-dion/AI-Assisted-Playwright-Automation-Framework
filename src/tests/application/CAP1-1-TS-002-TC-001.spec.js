/**
 * Test Spec: CAP1-1 TS-002 TC-001
 * Description: Verify all 12 tabs are visible in correct order on Budget Entry - Sales page
 * Test Scenario: TS-002
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1: Budget Entry - Sales Tab Presence and Order Verification', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let navPage;
  let dashboardPage;
  let budgetTabsPage;

  test('[CAP1-1 TS-002 TC-001] Verify all 12 tabs are visible in correct order', async ({ page }) => {
    // Initialize page objects
    loginPage = new AdaptiveLoginPage(page);
    navPage = new AdaptiveNavigationPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application in a browser
    await test.step('Step 1: Launch the application', async () => {
      await loginPage.goto(TD.urls.baseUrl + TD.urls.loginPage);
      await expect(page).toHaveURL(new RegExp(TD.urls.loginPage));
    });

    // Step 2: Enter valid Sales Budget Owner credentials and login
    await test.step('Step 2: Login with valid credentials', async () => {
      await loginPage.login(TD.users.salesBudgetOwner.username, TD.users.salesBudgetOwner.password);
      await dashboardPage.waitForDashboardToLoad();
      const isDashboardLoaded = await dashboardPage.isDashboardLoaded();
      expect(isDashboardLoaded).toBeTruthy();
    });

    // Step 3: Navigate to Budget Entry - Sales page
    await test.step('Step 3: Navigate to Budget Entry - Sales page', async () => {
      await navPage.navigateToBudgetEntrySales();
      await expect(page).toHaveURL(new RegExp('budget.*sales', 'i'));
      await budgetTabsPage.waitForTabsToLoad();
    });

    // Step 4: Verify the presence and order of all tabs
    await test.step('Step 4: Verify all 12 tabs are visible in correct order', async () => {
      const tabCount = await budgetTabsPage.getTabCount();
      expect(tabCount).toBe(TD.tabs.count);
      
      const actualTabNames = await budgetTabsPage.getAllTabNames();
      expect(actualTabNames).toEqual(TD.tabs.expectedOrder);
    });

    // Step 5: Verify each tab label matches the expected name
    await test.step('Step 5: Verify each tab label matches expected name', async () => {
      for (const expectedTabName of TD.tabs.expectedOrder) {
        const isVisible = await budgetTabsPage.isTabVisible(expectedTabName);
        expect(isVisible).toBeTruthy();
      }
    });
  });
});