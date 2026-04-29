const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const AdaptiveBudgetHeaderPage = require('../../pages/adaptive-budget-header.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1 TS-005: Verify budget context and Target Revenue tab', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let dashboardPage;
  let navigationPage;
  let budgetTabsPage;
  let budgetHeaderPage;

  test('[CAP1-1 TS-005 TC-001] Verify department context and Target Revenue sheet loads correctly', async ({ page }) => {
    loginPage = new AdaptiveLoginPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
    navigationPage = new AdaptiveNavigationPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);
    budgetHeaderPage = new AdaptiveBudgetHeaderPage(page);

    // Step 1: Launch the application and login as Sales Budget Owner
    await loginPage.goto();
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);
    await dashboardPage.waitForDashboardLoad();

    // Step 2: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await budgetTabsPage.waitForTabsLoad();

    // Step 3-6: Verify the context is set correctly
    const contexts = await budgetHeaderPage.verifyContext(
      TD.context.department,
      TD.context.timePeriod,
      TD.context.currency,
      TD.context.planVersion
    );

    // Verify department context
    expect(contexts.department).toContain(TD.context.department);

    // Verify time period context
    expect(contexts.timePeriod).toContain(TD.context.timePeriod);

    // Verify currency context
    expect(contexts.currency).toContain(TD.context.currency);

    // Verify plan version context
    expect(contexts.planVersion).toContain(TD.context.planVersion);

    // Step 7: Click on the Target Revenue tab
    await budgetTabsPage.clickTab('Target Revenue');
    const isActive = await budgetTabsPage.isTabActive('Target Revenue');
    expect(isActive).toBe(true);
    await expect(budgetTabsPage.getTabLocatorByName('Target Revenue')).toHaveAttribute('aria-selected', 'true');

    // Step 8: Verify the Target Revenue budget input sheet loads
    const isContentVisible = await budgetTabsPage.isTabContentVisible();
    expect(isContentVisible).toBe(true);

    // Step 9: Verify the sheet displays data for the correct department
    const contentText = await budgetTabsPage.getTabContentText();
    expect(contentText.toLowerCase()).toContain('revenue');
    
    // Verify department context is still Sales
    const departmentContext = await budgetHeaderPage.getDepartmentContext();
    expect(departmentContext).toContain(TD.context.department);
  });
});