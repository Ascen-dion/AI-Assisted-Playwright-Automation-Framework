/**
 * Test Specification: Workday Adaptive Planning Budget Tabs
 * @description Automated tests for budget tabs functionality
 */

const { test, expect } = require('../../fixtures');
const WorkdayBudgetTabsPage = require('../../pages/workday-budget-tabs.page');
const WorkdaySharedPage = require('../../pages/workday-shared.page');
const TD = require('../../data/workday-test-data');

test.describe('Workday Adaptive Planning - Budget Tabs Tests @regression', () => {
  let budgetTabsPage;
  let sharedPage;

  test.beforeEach(async ({ page }) => {
    budgetTabsPage = new WorkdayBudgetTabsPage(page);
    sharedPage = new WorkdaySharedPage(page);
    // Navigate to budget/sheets page
    await page.goto(TD.urls.dashboard);
    await sharedPage.waitForLoadingComplete();
  });

  test('TC011 - Verify tab strip is visible', async ({ page }) => {
    // Assert
    await budgetTabsPage.verifyTabStripVisible();
  });

  test('TC012 - Verify switching between tabs', async ({ page }) => {
    // Arrange
    const tabName = TD.budgetTabs.revenue;

    // Act
    await budgetTabsPage.switchToTab(tabName);

    // Assert
    await budgetTabsPage.verifyTabActive(tabName);
    await budgetTabsPage.verifyTabContentVisible();
  });

  test('TC013 - Verify tab count is greater than zero', async ({ page }) => {
    // Act
    const tabCount = await budgetTabsPage.getTabCount();

    // Assert
    expect(tabCount).toBeGreaterThan(0);
  });

  test('TC014 - Verify scroll tabs right functionality', async ({ page }) => {
    // Act & Assert
    await budgetTabsPage.scrollTabsRight();
    // Verify no errors occurred
    await budgetTabsPage.verifyTabStripVisible();
  });

  test('TC015 - Verify scroll tabs left functionality', async ({ page }) => {
    // Arrange
    await budgetTabsPage.scrollTabsRight();

    // Act
    await budgetTabsPage.scrollTabsLeft();

    // Assert
    await budgetTabsPage.verifyTabStripVisible();
  });
});