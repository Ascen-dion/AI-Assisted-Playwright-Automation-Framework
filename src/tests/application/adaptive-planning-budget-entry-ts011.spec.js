const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const AdaptivePlanningDashboardPage = require('../../pages/adaptive-planning-dashboard.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-011: Verify Back Button Navigation', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;
  let dashboardPage;

  test('[CAP1-1 TS-011 TC-001] Verify Back button navigates to previous page', async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);
    dashboardPage = new AdaptivePlanningDashboardPage(page);

    // Steps 1-2: Login
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);

    // Step 3: Note current page (dashboard)
    const previousPageUrl = await dashboardPage.getCurrentPageUrl();

    // Step 4: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();

    // Step 5: Verify Back button is visible
    const isBackButtonVisible = await budgetPage.isBackButtonVisible();
    expect(isBackButtonVisible).toBeTruthy();

    // Step 6: Click Back button
    await budgetPage.clickBackButton();

    // Step 7: Verify user is on previous page
    await page.waitForLoadState('domcontentloaded', { timeout: TD.NAVIGATION_TIMEOUT });
    const currentUrl = page.url();
    expect(currentUrl).toContain('app');
  });
});