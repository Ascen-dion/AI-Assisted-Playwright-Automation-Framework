const { test, expect } = require('../../fixtures');
const AdaptivePlanningLoginPage = require('../../pages/adaptive-planning-login.page');
const AdaptivePlanningBudgetEntryPage = require('../../pages/adaptive-planning-budget-entry.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-010: Verify Context Persistence Across Tab Switches', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let budgetPage;

  test('[CAP1-1 TS-010 TC-001] Verify selected context values persist across all tabs', async ({ page }) => {
    loginPage = new AdaptivePlanningLoginPage(page);
    budgetPage = new AdaptivePlanningBudgetEntryPage(page);

    // Steps 1-3: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.SALES_BUDGET_OWNER_USERNAME, TD.SALES_BUDGET_OWNER_PASSWORD);
    await budgetPage.navigateToBudgetEntrySales();

    // Steps 4-6: Select context values
    await budgetPage.selectDepartment(TD.DEPARTMENT_SALES);
    await budgetPage.selectTimePeriod(TD.TIME_PERIOD_Q1);
    await budgetPage.selectCurrency(TD.CURRENCY_USD);
    await budgetPage.selectPlanVersion(TD.PLAN_VERSION_DRAFT);

    // Step 7: Click Target Revenue tab
    await budgetPage.clickTargetRevenueTab();
    let dept = await budgetPage.getSelectedDepartment();
    let time = await budgetPage.getSelectedTimePeriod();
    let currency = await budgetPage.getSelectedCurrency();
    let version = await budgetPage.getSelectedPlanVersion();
    expect(dept).toContain(TD.DEPARTMENT_SALES);
    expect(time).toContain(TD.TIME_PERIOD_Q1);
    expect(currency).toContain(TD.CURRENCY_USD);

    // Step 8: Click Workforce tab
    await budgetPage.clickWorkforceTab();
    dept = await budgetPage.getSelectedDepartment();
    time = await budgetPage.getSelectedTimePeriod();
    currency = await budgetPage.getSelectedCurrency();
    expect(dept).toContain(TD.DEPARTMENT_SALES);
    expect(time).toContain(TD.TIME_PERIOD_Q1);
    expect(currency).toContain(TD.CURRENCY_USD);

    // Step 9: Click Pipeline tab
    await budgetPage.clickPipelineTab();
    dept = await budgetPage.getSelectedDepartment();
    time = await budgetPage.getSelectedTimePeriod();
    currency = await budgetPage.getSelectedCurrency();
    expect(dept).toContain(TD.DEPARTMENT_SALES);
    expect(time).toContain(TD.TIME_PERIOD_Q1);
    expect(currency).toContain(TD.CURRENCY_USD);

    // Step 10: Click Travel tab
    await budgetPage.clickTravelTab();
    dept = await budgetPage.getSelectedDepartment();
    time = await budgetPage.getSelectedTimePeriod();
    currency = await budgetPage.getSelectedCurrency();
    expect(dept).toContain(TD.DEPARTMENT_SALES);
    expect(time).toContain(TD.TIME_PERIOD_Q1);
    expect(currency).toContain(TD.CURRENCY_USD);

    // Step 11: Click Review tab
    await budgetPage.clickReviewTab();
    dept = await budgetPage.getSelectedDepartment();
    time = await budgetPage.getSelectedTimePeriod();
    currency = await budgetPage.getSelectedCurrency();
    expect(dept).toContain(TD.DEPARTMENT_SALES);
    expect(time).toContain(TD.TIME_PERIOD_Q1);
    expect(currency).toContain(TD.CURRENCY_USD);
  });
});