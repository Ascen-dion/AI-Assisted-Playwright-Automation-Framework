const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1 TS-003: Verify only one tab is highlighted at a time', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let dashboardPage;
  let navigationPage;
  let budgetTabsPage;

  test('[CAP1-1 TS-003 TC-001] Verify single tab highlighting behavior across multiple tab clicks', async ({ page }) => {
    loginPage = new AdaptiveLoginPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
    navigationPage = new AdaptiveNavigationPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application and login as Sales Budget Owner
    await loginPage.goto();
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await dashboardPage.waitForDashboardLoad();

    // Step 2: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await budgetTabsPage.waitForTabsLoad();

    // Step 3: Verify Instructions tab is highlighted as active
    let isActive = await budgetTabsPage.isTabActive('Instructions');
    expect(isActive).toBe(true);
    await expect(budgetTabsPage.getTabLocatorByName('Instructions')).toHaveAttribute('aria-selected', 'true');
    
    let activeCount = await budgetTabsPage.getActiveTabsCount();
    expect(activeCount).toBe(1);

    // Step 4: Click on Target Revenue tab
    await budgetTabsPage.clickTab('Target Revenue');
    isActive = await budgetTabsPage.isTabActive('Target Revenue');
    expect(isActive).toBe(true);
    await expect(budgetTabsPage.getTabLocatorByName('Target Revenue')).toHaveAttribute('aria-selected', 'true');
    await expect(budgetTabsPage.getTabLocatorByName('Instructions')).not.toHaveAttribute('aria-selected', 'true');
    
    activeCount = await budgetTabsPage.getActiveTabsCount();
    expect(activeCount).toBe(1);

    // Step 5: Click on Workforce tab
    await budgetTabsPage.clickTab('Workforce');
    isActive = await budgetTabsPage.isTabActive('Workforce');
    expect(isActive).toBe(true);
    await expect(budgetTabsPage.getTabLocatorByName('Workforce')).toHaveAttribute('aria-selected', 'true');
    await expect(budgetTabsPage.getTabLocatorByName('Target Revenue')).not.toHaveAttribute('aria-selected', 'true');
    
    activeCount = await budgetTabsPage.getActiveTabsCount();
    expect(activeCount).toBe(1);

    // Step 6: Click on Pipeline tab
    await budgetTabsPage.clickTab('Pipeline');
    isActive = await budgetTabsPage.isTabActive('Pipeline');
    expect(isActive).toBe(true);
    await expect(budgetTabsPage.getTabLocatorByName('Pipeline')).toHaveAttribute('aria-selected', 'true');
    await expect(budgetTabsPage.getTabLocatorByName('Workforce')).not.toHaveAttribute('aria-selected', 'true');
    
    activeCount = await budgetTabsPage.getActiveTabsCount();
    expect(activeCount).toBe(1);

    // Step 7: Click on Review tab
    await budgetTabsPage.clickTab('Review');
    isActive = await budgetTabsPage.isTabActive('Review');
    expect(isActive).toBe(true);
    await expect(budgetTabsPage.getTabLocatorByName('Review')).toHaveAttribute('aria-selected', 'true');
    await expect(budgetTabsPage.getTabLocatorByName('Pipeline')).not.toHaveAttribute('aria-selected', 'true');

    // Step 8: Verify only one tab is highlighted at any given time
    activeCount = await budgetTabsPage.getActiveTabsCount();
    expect(activeCount).toBe(1);
  });
});