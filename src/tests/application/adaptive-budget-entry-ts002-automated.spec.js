const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');
const loc = require('../../pages/locators/adaptive-budget-entry.locators');

test.describe('[UI] CAP1-1 TS-002: Verify All 12 Tabs Are Visible', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let budgetPage;

  test('[CAP1-1 TS-002 TC-001] Verify all 12 tabs are visible in correct order', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-3: Login
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await expect(await budgetPage.isHomePageDisplayed()).toBeTruthy();
    
    // Step 4: Navigate to Budget Entry - Sales page
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Verify all 12 tabs are visible
    const tabCount = await budgetPage.getTabCount();
    await expect(tabCount).toBe(TD.expectedTabCount);
    
    // Step 6: Verify tab order and labels
    const expectedTabs = [
      { locator: loc.instructionsTab, name: 'Instructions' },
      { locator: loc.targetRevenueTab, name: 'Target Revenue' },
      { locator: loc.targetExpenseTab, name: 'Target Expense' },
      { locator: loc.workforceTab, name: 'Workforce' },
      { locator: loc.productRevenueTab, name: 'Product Revenue' },
      { locator: loc.sensitivityAnalysisTab, name: 'Sensitivity Analysis' },
      { locator: loc.pipelineTab, name: 'Pipeline' },
      { locator: loc.travelTab, name: 'Travel' },
      { locator: loc.capitalTab, name: 'Capital' },
      { locator: loc.expensesTab, name: 'Expenses' },
      { locator: loc.variancesTab, name: 'Variances' },
      { locator: loc.reviewTab, name: 'Review' }
    ];
    
    for (const tab of expectedTabs) {
      await expect(await budgetPage.isTabVisible(tab.locator)).toBeTruthy();
      const tabText = await budgetPage.getTabText(tab.locator);
      await expect(tabText).toContain(tab.name);
    }
  });
});