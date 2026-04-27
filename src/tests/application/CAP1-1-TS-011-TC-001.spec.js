/**
 * Test Spec: CAP1-1 TS-011 TC-001
 * Verify Back button functionality
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const DashboardPage = require('../../pages/dashboard.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-011: Verify Back Button', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;
  let dashboardPage;

  test('[CAP1-1 TS-011 TC-001] Verify Back button navigates to previous page', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);
    dashboardPage = new DashboardPage(page);

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);

    // Step 2: Note current page URL
    const previousUrl = page.url();

    // Step 3: Navigate to Budget Entry - Sales
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');
    await page.waitForLoadState('domcontentloaded');

    // Step 4: Verify Back button is visible
    const isBackVisible = await navigationPage.isBackButtonVisible();
    await expect(isBackVisible).toBeTruthy();

    // Step 5: Click Back button
    await navigationPage.clickBackButton();

    // Step 6: Verify navigated back to previous page
    const currentUrl = page.url();
    await expect(currentUrl).toBe(previousUrl);
  });
});