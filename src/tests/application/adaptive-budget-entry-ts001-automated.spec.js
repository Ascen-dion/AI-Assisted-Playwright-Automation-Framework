const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');

test.describe('[UI] CAP1-1 TS-001: Verify Default Active Tab on Budget Entry - Sales Page', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let budgetPage;

  test('[CAP1-1 TS-001 TC-001] Verify Instructions tab is active by default', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1: Launch the application
    await budgetPage.goto();
    await expect(await budgetPage.isLoginPageLoaded()).toBeTruthy();
    
    // Step 2 & 3: Login
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await expect(await budgetPage.isHomePageDisplayed()).toBeTruthy();
    
    // Step 4: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Verify Instructions tab is active by default
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(require('../../pages/locators/adaptive-budget-entry.locators').instructionsTab))).toBeTruthy();
    const activeTabText = await budgetPage.getActiveTabText();
    await expect(activeTabText).toContain('Instructions');
    
    // Verify Instructions content is displayed
    await expect(await budgetPage.isInstructionsContentVisible()).toBeTruthy();
    
    // Verify only one tab is active
    const activeTabCount = await budgetPage.getActiveTabCount();
    await expect(activeTabCount).toBe(1);
  });
});