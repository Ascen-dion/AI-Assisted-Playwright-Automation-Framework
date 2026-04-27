/**
 * Test Spec: CAP1-1 TS-009 TC-002
 * Verify Review tab displays summary view
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-009: Verify Summary Views', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;

  test('[CAP1-1 TS-009 TC-002] Verify Review tab displays summary view', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);

    // Step 1-2: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');

    // Step 3: Click Review tab
    await budgetPage.clickTab('Review');

    // Step 4: Verify Review content is displayed
    const isActive = await budgetPage.isTabActive('Review');
    await expect(isActive).toBeTruthy();
    
    const isContentVisible = await budgetPage.isTabContentVisible();
    await expect(isContentVisible).toBeTruthy();
  });
});