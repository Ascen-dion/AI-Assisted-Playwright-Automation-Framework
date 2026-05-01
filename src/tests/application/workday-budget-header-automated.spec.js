/**
 * Test Specification: Workday Adaptive Planning Budget Header
 * @description Automated tests for budget header functionality
 */

const { test, expect } = require('../../fixtures');
const WorkdayBudgetHeaderPage = require('../../pages/workday-budget-header.page');
const WorkdaySharedPage = require('../../pages/workday-shared.page');
const TD = require('../../data/workday-test-data');

test.describe('Workday Adaptive Planning - Budget Header Tests @regression', () => {
  let budgetHeaderPage;
  let sharedPage;

  test.beforeEach(async ({ page }) => {
    budgetHeaderPage = new WorkdayBudgetHeaderPage(page);
    sharedPage = new WorkdaySharedPage(page);
    // Navigate to budget page
    await page.goto(TD.urls.dashboard);
    await sharedPage.waitForLoadingComplete();
  });

  test('TC016 - Verify page title is displayed', async ({ page }) => {
    // Act
    const pageTitle = await budgetHeaderPage.getPageTitle();

    // Assert
    expect(pageTitle).toBeTruthy();
    expect(pageTitle.length).toBeGreaterThan(0);
  });

  test('TC017 - Verify version button is clickable', async ({ page }) => {
    // Act & Assert
    await budgetHeaderPage.clickVersionButton();
    await sharedPage.waitForLoadingComplete();
  });

  test('TC018 - Verify time period selector functionality', async ({ page }) => {
    // Arrange
    const timePeriod = TD.timePeriods.monthly;

    // Act
    await budgetHeaderPage.selectTimePeriod(timePeriod);
    await sharedPage.waitForLoadingComplete();

    // Assert - verify no errors occurred
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);
  });

  test('TC019 - Verify level selector functionality', async ({ page }) => {
    // Arrange
    const level = TD.levels.summary;

    // Act
    await budgetHeaderPage.selectLevel(level);
    await sharedPage.waitForLoadingComplete();

    // Assert - verify no errors occurred
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);
  });

  test('TC020 - Verify currency selector functionality', async ({ page }) => {
    // Arrange
    const currency = TD.currencies.usd;

    // Act
    await budgetHeaderPage.selectCurrency(currency);
    await sharedPage.waitForLoadingComplete();

    // Assert - verify no errors occurred
    await expect(page).toHaveURL(TD.urlPatterns.dashboard);
  });
});