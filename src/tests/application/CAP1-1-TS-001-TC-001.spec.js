/**
 * Test Spec: CAP1-1 TS-001 TC-001
 * Description: Verify Instructions tab is selected by default on Budget Entry - Sales page
 * Test Scenario: TS-001
 */

const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1: Budget Entry - Sales Default Tab Verification', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let navPage;
  let dashboardPage;
  let budgetTabsPage;

  test('[CAP1-1 TS-001 TC-001] Verify Instructions tab is selected by default', async ({ page }) => {
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

    // Step 2: Enter valid Sales Budget Owner credentials
    await test.step('Step 2: Enter valid credentials', async () => {
      await loginPage.enterUsername(TD.users.salesBudgetOwner.username);
      await loginPage.enterPassword(TD.users.salesBudgetOwner.password);
    });

    // Step 3: Click on Login button
    await test.step('Step 3: Click Login button', async () => {
      await loginPage.clickSignIn();
      await dashboardPage.waitForDashboardToLoad();
      const isDashboardLoaded = await dashboardPage.isDashboardLoaded();
      expect(isDashboardLoaded).toBeTruthy();
    });

    // Step 4: Navigate to Budget Entry - Sales page
    await test.step('Step 4: Navigate to Budget Entry - Sales page', async () => {
      await navPage.navigateToBudgetEntrySales();
      await expect(page).toHaveURL(new RegExp('budget.*sales', 'i'));
      await budgetTabsPage.waitForTabsToLoad();
    });

    // Step 5: Verify the default selected tab
    await test.step('Step 5: Verify Instructions tab is highlighted as active', async () => {
      const activeTabName = await budgetTabsPage.getActiveTabName();
      expect(activeTabName).toBe(TD.tabs.defaultTab);
      
      const isInstructionsActive = await budgetTabsPage.isTabActive(TD.tabs.defaultTab);
      expect(isInstructionsActive).toBeTruthy();
    });

    // Step 6: Verify the content displayed
    await test.step('Step 6: Verify Instructions section content is displayed', async () => {
      const isContentVisible = await budgetTabsPage.isTabContentVisible();
      expect(isContentVisible).toBeTruthy();
    });
  });
});