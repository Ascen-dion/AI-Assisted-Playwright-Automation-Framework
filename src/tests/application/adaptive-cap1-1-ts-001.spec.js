const { test, expect } = require('../../fixtures');
const AdaptiveLoginPage = require('../../pages/adaptive-login.page');
const AdaptiveDashboardPage = require('../../pages/adaptive-dashboard.page');
const AdaptiveNavigationPage = require('../../pages/adaptive-navigation.page');
const AdaptiveBudgetTabsPage = require('../../pages/adaptive-budget-tabs.page');
const TD = require('../../data/adaptive-test-data');

test.describe('[UI] CAP1-1 TS-001: Verify Instructions tab is selected by default', { tag: ['@smoke', '@regression', '@capital-one'] }, () => {
  let loginPage;
  let dashboardPage;
  let navigationPage;
  let budgetTabsPage;

  test('[CAP1-1 TS-001 TC-001] Verify Instructions tab is highlighted by default and displays content', async ({ page }) => {
    loginPage = new AdaptiveLoginPage(page);
    dashboardPage = new AdaptiveDashboardPage(page);
    navigationPage = new AdaptiveNavigationPage(page);
    budgetTabsPage = new AdaptiveBudgetTabsPage(page);

    // Step 1: Launch the application in a browser
    await loginPage.goto();
    await expect(page).toHaveURL(TD.urlPatterns.login);

    // Step 2: Enter valid Sales Budget Owner credentials
    await loginPage.login(TD.credentials.salesBudgetOwner.username, TD.credentials.salesBudgetOwner.password);

    // Step 3: Click on Login button (handled in login method) and verify dashboard loads
    await dashboardPage.waitForDashboardLoad();
    await expect(dashboardPage.page.locator('main, .dashboard, [role="main"]').first()).toBeVisible();

    // Step 4: Navigate to Budget Entry - Sales page
    await navigationPage.navigateToBudgetEntrySales();
    await budgetTabsPage.waitForTabsLoad();

    // Step 5: Verify the default selected tab
    const activeTabName = await budgetTabsPage.getActiveTabName();
    expect(activeTabName).toContain(TD.tabs.defaultActive);
    await expect(budgetTabsPage.getTabLocatorByName('Instructions')).toHaveAttribute('aria-selected', 'true');

    // Step 6: Verify the content displayed
    const isContentVisible = await budgetTabsPage.isTabContentVisible();
    expect(isContentVisible).toBe(true);
    
    const contentText = await budgetTabsPage.getTabContentText();
    const hasInstructionsContent = TD.content.instructions.keywords.some(keyword => 
      contentText.toLowerCase().includes(keyword.toLowerCase())
    );
    expect(hasInstructionsContent).toBe(true);
  });
});