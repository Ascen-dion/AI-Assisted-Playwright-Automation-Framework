/**
 * Test Spec: CAP1-1 TS-006 TC-002
 * Verify Target Expense tab displays budget input sheet
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-006: Verify Budget Input Sheets', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;

  test('[CAP1-1 TS-006 TC-002] Verify Target Expense tab displays budget input sheet', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);

    // Step 1-2: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');

    // Step 3: Click Target Expense tab
    await budgetPage.clickTab('Target Expense');

    // Step 4: Verify Target Expense content is displayed
    const isActive = await budgetPage.isTabActive('Target Expense');
    await expect(isActive).toBeTruthy();
    
    const isContentVisible = await budgetPage.isTabContentVisible();
    await expect(isContentVisible).toBeTruthy();
  });
});