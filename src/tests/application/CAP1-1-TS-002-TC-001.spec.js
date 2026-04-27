/**
 * Test Spec: CAP1-1 TS-002 TC-001
 * Verify presence and order of all budget section tabs
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-002: Verify All Budget Section Tabs', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;

  test('[CAP1-1 TS-002 TC-001] Verify all 12 tabs are present in correct order', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);

    // Step 1-3: Login
    await loginPage.goto();
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);

    // Step 4: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');
    await page.waitForLoadState('domcontentloaded');

    // Step 5 & 6: Verify all tabs are present and in correct order
    const actualTabNames = await budgetPage.getAllTabNames();
    
    // Verify count
    await expect(actualTabNames.length).toBe(12);
    
    // Verify order and names
    for (let i = 0; i < TD.TAB_NAMES.length; i++) {
      await expect(actualTabNames[i]).toBe(TD.TAB_NAMES[i]);
    }
    
    // Verify each tab is visible
    for (const tabName of TD.TAB_NAMES) {
      const isVisible = await budgetPage.isTabVisible(tabName);
      await expect(isVisible).toBeTruthy();
    }
  });
});