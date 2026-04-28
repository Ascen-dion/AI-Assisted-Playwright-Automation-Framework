const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-001: Verify Default Active Tab on Budget Entry - Sales Page', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test('[CAP1-1 TS-001 TC-001] Verify Instructions tab is displayed as active by default', async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);

    // Step 1: Launch the application
    await loginPage.goto();
    await expect(page).toHaveURL(new RegExp(TD.LOGIN_URL), { timeout: TD.NAVIGATION_TIMEOUT });

    // Steps 2-5: Login
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await page.waitForLoadState('domcontentloaded', { timeout: TD.NAVIGATION_TIMEOUT });

    // Step 6: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();

    // Step 7: Verify Instructions tab is active by default
    await expect(async () => {
      const isActive = await budgetPage.isInstructionsTabActive();
      expect(isActive).toBeTruthy();
    }).toPass({ timeout: TD.DEFAULT_TIMEOUT });

    const activeTabName = await budgetPage.getActiveTabName();
    expect(activeTabName).toBe(TD.TAB_INSTRUCTIONS);

    // Verify Instructions tab content is visible
    const isContentVisible = await budgetPage.isBudgetInputSheetVisible();
    expect(isContentVisible).toBeTruthy();
  });
});