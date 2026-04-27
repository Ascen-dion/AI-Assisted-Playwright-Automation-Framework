/**
 * Test Spec: CAP1-1 TS-010 TC-001
 * Verify context persistence across tab switches
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-010: Verify Context Persistence', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;

  test('[CAP1-1 TS-010 TC-001] Verify selected context persists across all tab switches', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);

    // Step 1-2: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');

    // Step 3-6: Select context values
    await budgetPage.selectDepartment(TD.DEPARTMENT_SALES);
    await budgetPage.selectTimePeriod(TD.TIME_PERIOD_Q1);
    await budgetPage.selectCurrency(TD.CURRENCY_USD);
    await budgetPage.selectPlanVersion(TD.PLAN_VERSION_DRAFT);

    // Step 7: Click Target Revenue and verify context
    await budgetPage.clickTab('Target Revenue');
    let dept = await budgetPage.getSelectedDepartment();
    let time = await budgetPage.getSelectedTimePeriod();
    let currency = await budgetPage.getSelectedCurrency();
    let version = await budgetPage.getSelectedPlanVersion();
    await expect(dept).toContain(TD.DEPARTMENT_SALES);
    await expect(time).toContain(TD.TIME_PERIOD_Q1);
    await expect(currency).toContain(TD.CURRENCY_USD);
    await expect(version).toContain(TD.PLAN_VERSION_DRAFT);

    // Step 8: Click Workforce and verify context
    await budgetPage.clickTab('Workforce');
    dept = await budgetPage.getSelectedDepartment();
    time = await budgetPage.getSelectedTimePeriod();
    currency = await budgetPage.getSelectedCurrency();
    version = await budgetPage.getSelectedPlanVersion();
    await expect(dept).toContain(TD.DEPARTMENT_SALES);
    await expect(time).toContain(TD.TIME_PERIOD_Q1);
    await expect(currency).toContain(TD.CURRENCY_USD);
    await expect(version).toContain(TD.PLAN_VERSION_DRAFT);

    // Step 9: Click Pipeline and verify context
    await budgetPage.clickTab('Pipeline');
    dept = await budgetPage.getSelectedDepartment();
    time = await budgetPage.getSelectedTimePeriod();
    currency = await budgetPage.getSelectedCurrency();
    version = await budgetPage.getSelectedPlanVersion();
    await expect(dept).toContain(TD.DEPARTMENT_SALES);
    await expect(time).toContain(TD.TIME_PERIOD_Q1);
    await expect(currency).toContain(TD.CURRENCY_USD);
    await expect(version).toContain(TD.PLAN_VERSION_DRAFT);

    // Step 10: Click Travel and verify context
    await budgetPage.clickTab('Travel');
    dept = await budgetPage.getSelectedDepartment();
    time = await budgetPage.getSelectedTimePeriod();
    currency = await budgetPage.getSelectedCurrency();
    version = await budgetPage.getSelectedPlanVersion();
    await expect(dept).toContain(TD.DEPARTMENT_SALES);
    await expect(time).toContain(TD.TIME_PERIOD_Q1);
    await expect(currency).toContain(TD.CURRENCY_USD);
    await expect(version).toContain(TD.PLAN_VERSION_DRAFT);

    // Step 11: Click Review and verify context
    await budgetPage.clickTab('Review');
    dept = await budgetPage.getSelectedDepartment();
    time = await budgetPage.getSelectedTimePeriod();
    currency = await budgetPage.getSelectedCurrency();
    version = await budgetPage.getSelectedPlanVersion();
    await expect(dept).toContain(TD.DEPARTMENT_SALES);
    await expect(time).toContain(TD.TIME_PERIOD_Q1);
    await expect(currency).toContain(TD.CURRENCY_USD);
    await expect(version).toContain(TD.PLAN_VERSION_DRAFT);

    // Step 12: Final verification
    await expect(dept).toContain(TD.DEPARTMENT_SALES);
    await expect(time).toContain(TD.TIME_PERIOD_Q1);
    await expect(currency).toContain(TD.CURRENCY_USD);
    await expect(version).toContain(TD.PLAN_VERSION_DRAFT);
  });
});