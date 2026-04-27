/**
 * Test Spec: CAP1-1 TS-003 TC-001
 * Verify tab highlighting behavior when switching between tabs
 */

const { test, expect } = require('../../fixtures');
const LoginPage = require('../../pages/login.page');
const NavigationPage = require('../../pages/navigation.page');
const BudgetEntrySalesPage = require('../../pages/budget-entry-sales.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] CAP1-1 TS-003: Verify Tab Highlighting', { tag: ['@regression', '@capital-one'] }, () => {
  let loginPage;
  let navigationPage;
  let budgetPage;

  test('[CAP1-1 TS-003 TC-001] Verify only one tab is highlighted at a time', async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    budgetPage = new BudgetEntrySalesPage(page);

    // Step 1-2: Login and navigate
    await loginPage.goto();
    await loginPage.login(TD.VALID_USERNAME, TD.VALID_PASSWORD);
    await navigationPage.navigateToMenuItem('Budget Entry - Sales');

    // Step 3: Verify Instructions tab is highlighted
    let isActive = await budgetPage.isTabActive('Instructions');
    await expect(isActive).toBeTruthy();

    // Step 4: Click Target Revenue tab
    await budgetPage.clickTab('Target Revenue');
    isActive = await budgetPage.isTabActive('Target Revenue');
    await expect(isActive).toBeTruthy();
    
    // Verify Instructions is no longer active
    isActive = await budgetPage.isTabActive('Instructions');
    await expect(isActive).toBeFalsy();

    // Step 5: Click Workforce tab
    await budgetPage.clickTab('Workforce');
    isActive = await budgetPage.isTabActive('Workforce');
    await expect(isActive).toBeTruthy();
    
    // Verify Target Revenue is no longer active
    isActive = await budgetPage.isTabActive('Target Revenue');
    await expect(isActive).toBeFalsy();

    // Step 6: Click Pipeline tab
    await budgetPage.clickTab('Pipeline');
    isActive = await budgetPage.isTabActive('Pipeline');
    await expect(isActive).toBeTruthy();
    
    // Verify Workforce is no longer active
    isActive = await budgetPage.isTabActive('Workforce');
    await expect(isActive).toBeFalsy();

    // Step 7: Click Review tab
    await budgetPage.clickTab('Review');
    isActive = await budgetPage.isTabActive('Review');
    await expect(isActive).toBeTruthy();
    
    // Verify Pipeline is no longer active
    isActive = await budgetPage.isTabActive('Pipeline');
    await expect(isActive).toBeFalsy();

    // Step 8: Verify only Review tab is highlighted
    const activeTabName = await budgetPage.getActiveTabName();
    await expect(activeTabName.trim()).toBe('Review');
  });
});