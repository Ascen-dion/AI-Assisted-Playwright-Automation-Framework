/**
 * Test Spec: CAP1-1 TS-008 TC-001
 * Verify Travel tab displays cost planning sheet
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-008: Verify Cost Planning Sheets', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;

  test('[CAP1-1 TS-008 TC-001] Verify Travel tab displays cost planning sheet', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);

    // Step 1-2: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');

    // Step 3: Click Travel tab
    await budgetPage.clickTab('Travel');

    // Step 4: Verify Travel content is displayed
    const isActive = await budgetPage.isTabActive('Travel');
    await expect(isActive).toBeTruthy();
    
    const isContentVisible = await budgetPage.isTabContentVisible();
    await expect(isContentVisible).toBeTruthy();
  });
});