/**
 * Test Spec: CAP1-1 TS-001 TC-001
 * Verify default active tab on Budget Entry - Sales page
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const DashboardPage = require('../../pages/dashboard.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-001: Verify Default Active Tab', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;
  let dashboardPage;

  test('[CAP1-1 TS-001 TC-001] Verify Instructions tab is active by default', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);
    dashboardPage = new DashboardPage(page);

    // Step 1: Launch the application
    await loginPage.goto();
    await expect(page).toHaveURL(/adaptiveplanning\.com/);

    // Step 2 & 3: Enter valid username and password
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);

    // Step 4: Verify login success - dashboard loads
    await expect(dashboardPage.isDashboardVisible()).resolves.toBeTruthy();

    // Step 5: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');
    await page.waitForLoadState('domcontentloaded');

    // Step 6: Verify Instructions tab is active by default
    const activeTabName = await budgetPage.getActiveTabName();
    await expect(activeTabName.trim()).toBe('Instructions');
    
    // Verify Instructions tab is highlighted
    const isInstructionsActive = await budgetPage.isTabActive('Instructions');
    await expect(isInstructionsActive).toBeTruthy();
    
    // Verify tab content is visible
    const isContentVisible = await budgetPage.isTabContentVisible();
    await expect(isContentVisible).toBeTruthy();
  });
});