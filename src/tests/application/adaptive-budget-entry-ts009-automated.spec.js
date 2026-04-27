const { test, expect } = require('../../fixtures');
const AdaptiveBudgetEntryPage = require('../../pages/adaptive-budget-entry.page');
const TD = require('../../data/adaptive-budget-test-data');
const loc = require('../../pages/locators/adaptive-budget-entry.locators');

test.describe('[UI] CAP1-1 TS-009: Verify Context Retention Across Tab Switches', { tag: ['@regression', '@capital-one'] }, () => {
  let budgetPage;

  test('[CAP1-1 TS-009 TC-001] Verify context is retained when switching between tabs', async ({ page }) => {
    budgetPage = new AdaptiveBudgetEntryPage(page);
    
    // Step 1-3: Login
    await budgetPage.goto();
    await budgetPage.login(TD.validUsername, TD.validPassword);
    await expect(await budgetPage.isHomePageDisplayed()).toBeTruthy();
    
    // Step 4: Navigate to Budget Entry - Sales page with specific context
    await budgetPage.navigateToBudgetEntrySales();
    await expect(await budgetPage.isBudgetEntrySalesPageLoaded()).toBeTruthy();
    
    // Step 5: Verify initial context
    let department = await budgetPage.getDepartmentContext();
    let timePeriod = await budgetPage.getTimePeriodContext();
    let currency = await budgetPage.getCurrencyContext();
    let planVersion = await budgetPage.getPlanVersionContext();
    
    await expect(department).toContain(TD.testContext.department);
    await expect(timePeriod).toContain(TD.testContext.timePeriod);
    await expect(currency).toContain(TD.testContext.currency);
    await expect(planVersion).toContain(TD.testContext.planVersion);
    
    // Step 6-7: Click Target Revenue tab and verify context
    await budgetPage.clickTargetRevenueTab();
    department = await budgetPage.getDepartmentContext();
    timePeriod = await budgetPage.getTimePeriodContext();
    currency = await budgetPage.getCurrencyContext();
    planVersion = await budgetPage.getPlanVersionContext();
    
    await expect(department).toContain(TD.testContext.department);
    await expect(timePeriod).toContain(TD.testContext.timePeriod);
    await expect(currency).toContain(TD.testContext.currency);
    await expect(planVersion).toContain(TD.testContext.planVersion);
    
    // Step 8-9: Click Workforce tab and verify context
    await budgetPage.clickWorkforceTab();
    department = await budgetPage.getDepartmentContext();
    timePeriod = await budgetPage.getTimePeriodContext();
    currency = await budgetPage.getCurrencyContext();
    planVersion = await budgetPage.getPlanVersionContext();
    
    await expect(department).toContain(TD.testContext.department);
    await expect(timePeriod).toContain(TD.testContext.timePeriod);
    await expect(currency).toContain(TD.testContext.currency);
    await expect(planVersion).toContain(TD.testContext.planVersion);
    
    // Step 10-11: Click Sensitivity Analysis tab and verify context
    await budgetPage.clickSensitivityAnalysisTab();
    department = await budgetPage.getDepartmentContext();
    timePeriod = await budgetPage.getTimePeriodContext();
    currency = await budgetPage.getCurrencyContext();
    planVersion = await budgetPage.getPlanVersionContext();
    
    await expect(department).toContain(TD.testContext.department);
    await expect(timePeriod).toContain(TD.testContext.timePeriod);
    await expect(currency).toContain(TD.testContext.currency);
    await expect(planVersion).toContain(TD.testContext.planVersion);
    
    // Step 12-13: Click Travel tab and verify context
    await budgetPage.clickTravelTab();
    department = await budgetPage.getDepartmentContext();
    timePeriod = await budgetPage.getTimePeriodContext();
    currency = await budgetPage.getCurrencyContext();
    planVersion = await budgetPage.getPlanVersionContext();
    
    await expect(department).toContain(TD.testContext.department);
    await expect(timePeriod).toContain(TD.testContext.timePeriod);
    await expect(currency).toContain(TD.testContext.currency);
    await expect(planVersion).toContain(TD.testContext.planVersion);
    
    // Step 14-15: Click Variances tab and verify context
    await budgetPage.clickVariancesTab();
    department = await budgetPage.getDepartmentContext();
    timePeriod = await budgetPage.getTimePeriodContext();
    currency = await budgetPage.getCurrencyContext();
    planVersion = await budgetPage.getPlanVersionContext();
    
    await expect(department).toContain(TD.testContext.department);
    await expect(timePeriod).toContain(TD.testContext.timePeriod);
    await expect(currency).toContain(TD.testContext.currency);
    await expect(planVersion).toContain(TD.testContext.planVersion);
    
    // Step 16-17: Click Review tab and verify context is retained throughout
    await budgetPage.clickReviewTab();
    department = await budgetPage.getDepartmentContext();
    timePeriod = await budgetPage.getTimePeriodContext();
    currency = await budgetPage.getCurrencyContext();
    planVersion = await budgetPage.getPlanVersionContext();
    
    await expect(department).toContain(TD.testContext.department);
    await expect(timePeriod).toContain(TD.testContext.timePeriod);
    await expect(currency).toContain(TD.testContext.currency);
    await expect(planVersion).toContain(TD.testContext.planVersion);
  });
});