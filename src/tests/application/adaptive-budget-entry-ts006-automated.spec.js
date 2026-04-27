const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');
const loc = require('../../pages/locators/adaptive-budget-entry.locators');

test.describe('[UI] CAP1-1 TS-006: Verify Planning Views Load for Specific Tabs', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetPage;

  test('[CAP1-1 TS-006 TC-001] Verify Sensitivity Analysis tab loads planning view', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Sensitivity Analysis tab
    await budgetPage.clickSensitivityAnalysisTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.sensitivityAnalysisTab))).toBeTruthy();
    
    // Step 6: Verify planning view displays modeling tools
    await expect(await budgetPage.isPlanningViewVisible()).toBeTruthy();
    await expect(await budgetPage.isModelingToolsVisible()).toBeTruthy();
  });

  test('[CAP1-1 TS-006 TC-002] Verify Pipeline tab loads planning view', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-4: Login and navigate
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Click Pipeline tab
    await budgetPage.clickPipelineTab();
    await expect(await budgetPage.isTabActive(budgetPage.page.locator(loc.pipelineTab))).toBeTruthy();
    
    // Step 6: Verify planning view displays pipeline data
    await expect(await budgetPage.isPlanningViewVisible()).toBeTruthy();
    await expect(await budgetPage.isPipelineDataVisible()).toBeTruthy();
  });
});