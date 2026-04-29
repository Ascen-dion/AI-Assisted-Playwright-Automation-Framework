/**
 * Page Object for Workday Budget Entry - Sales Page
 * Handles all tab interactions and budget sheet operations
 */

const locators = require('./locators/workday-budget-sales.locators');
const { expect } = require('@playwright/test');

class WorkdayBudgetSalesPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Verify Budget Entry - Sales page loads successfully
   */
  async verifyPageLoaded() {
    await expect(locators.tabList(this.page)).toBeVisible({ timeout: 30000 });
    await expect(locators.pageTitle(this.page)).toBeVisible({ timeout: 15000 });
  }

  /**
   * Verify the default selected tab is Instructions
   */
  async verifyDefaultTabIsInstructions() {
    const activeTab = locators.activeTab(this.page);
    await expect(activeTab).toBeVisible({ timeout: 15000 });
    await expect(activeTab).toHaveText('Instructions');
  }

  /**
   * Verify Instructions tab is highlighted as active
   */
  async verifyInstructionsTabActive() {
    const activeTab = locators.activeTab(this.page);
    await expect(activeTab).toBeVisible({ timeout: 15000 });
    const tabText = await activeTab.textContent();
    expect(tabText.trim()).toBe('Instructions');
  }

  /**
   * Verify Instructions content is displayed
   */
  async verifyInstructionsContentDisplayed() {
    await expect(locators.tabContent(this.page)).toBeVisible({ timeout: 15000 });
    // Verify content shows budget guidelines and due dates
    const content = locators.tabContent(this.page);
    await expect(content).toContainText(/budget|guideline|due date/i);
  }

  /**
   * Get all tab names in order
   * @returns {Promise<string[]>} Array of tab names
   */
  async getAllTabNames() {
    const tabs = locators.allTabs(this.page);
    await tabs.first().waitFor({ state: 'visible', timeout: 15000 });
    const tabCount = await tabs.count();
    const tabNames = [];
    for (let i = 0; i < tabCount; i++) {
      const tabText = await tabs.nth(i).textContent();
      tabNames.push(tabText.trim());
    }
    return tabNames;
  }

  /**
   * Verify all 12 tabs are present in correct order
   */
  async verifyAllTabsPresent() {
    const expectedTabs = [
      'Instructions',
      'Target Revenue',
      'Target Expense',
      'Workforce',
      'Product Revenue',
      'Sensitivity Analysis',
      'Pipeline',
      'Travel',
      'Capital',
      'Expenses',
      'Variances',
      'Review'
    ];

    const actualTabs = await this.getAllTabNames();
    expect(actualTabs.length).toBe(12);
    expect(actualTabs).toEqual(expectedTabs);
  }

  /**
   * Verify each tab label matches expected name
   */
  async verifyTabLabels() {
    const expectedLabels = [
      'Instructions',
      'Target Revenue',
      'Target Expense',
      'Workforce',
      'Product Revenue',
      'Sensitivity Analysis',
      'Pipeline',
      'Travel',
      'Capital',
      'Expenses',
      'Variances',
      'Review'
    ];

    const actualTabs = await this.getAllTabNames();
    for (let i = 0; i < expectedLabels.length; i++) {
      expect(actualTabs[i]).toBe(expectedLabels[i]);
    }
  }

  /**
   * Click on a specific tab by name
   * @param {string} tabName - Name of the tab to click
   */
  async clickTab(tabName) {
    const tab = locators.tab(this.page, tabName);
    await tab.waitFor({ state: 'visible', timeout: 15000 });
    await tab.click();
    // Wait for tab content to load
    await this.page.waitForTimeout(1000);
  }

  /**
   * Verify a specific tab is highlighted as active
   * @param {string} tabName - Name of the tab to verify
   */
  async verifyTabIsActive(tabName) {
    const activeTab = locators.activeTab(this.page);
    await expect(activeTab).toBeVisible({ timeout: 15000 });
    await expect(activeTab).toHaveText(tabName);
  }

  /**
   * Verify only one tab is highlighted at a time
   */
  async verifyOnlyOneTabHighlighted() {
    const activeTabs = this.page.locator('[role="tab"][aria-selected="true"]');
    const count = await activeTabs.count();
    expect(count).toBe(1);
  }

  /**
   * Verify tab content loads after clicking tab
   * @param {string} tabName - Name of the tab
   */
  async verifyTabContentLoads(tabName) {
    await expect(locators.tabContent(this.page)).toBeVisible({ timeout: 15000 });
  }

  /**
   * Resize browser window
   * @param {number} width - Window width
   * @param {number} height - Window height
   */
  async resizeBrowserWindow(width, height) {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Verify scroll arrows are visible
   */
  async verifyScrollArrowsVisible() {
    await expect(locators.scrollLeftButton(this.page)).toBeVisible({ timeout: 15000 });
    await expect(locators.scrollRightButton(this.page)).toBeVisible({ timeout: 15000 });
  }

  /**
   * Verify left arrow is disabled
   */
  async verifyLeftArrowDisabled() {
    const leftArrow = locators.scrollLeftButton(this.page);
    await expect(leftArrow).toBeVisible({ timeout: 15000 });
    const isDisabled = await leftArrow.isDisabled();
    expect(isDisabled).toBe(true);
  }

  /**
   * Click right scroll arrow
   */
  async clickRightScrollArrow() {
    const rightArrow = locators.scrollRightButton(this.page);
    await rightArrow.waitFor({ state: 'visible', timeout: 15000 });
    await rightArrow.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click left scroll arrow
   */
  async clickLeftScrollArrow() {
    const leftArrow = locators.scrollLeftButton(this.page);
    await leftArrow.waitFor({ state: 'visible', timeout: 15000 });
    await leftArrow.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Verify left arrow becomes enabled
   */
  async verifyLeftArrowEnabled() {
    const leftArrow = locators.scrollLeftButton(this.page);
    await expect(leftArrow).toBeVisible({ timeout: 15000 });
    const isDisabled = await leftArrow.isDisabled();
    expect(isDisabled).toBe(false);
  }

  /**
   * Verify department context
   * @param {string} department - Expected department name
   */
  async verifyDepartmentContext(department) {
    const levelSelector = locators.levelSelector(this.page);
    await expect(levelSelector).toBeVisible({ timeout: 15000 });
    await expect(levelSelector).toContainText(department);
  }

  /**
   * Verify time period context
   * @param {string} timePeriod - Expected time period
   */
  async verifyTimePeriodContext(timePeriod) {
    const timeSelector = locators.timeSelector(this.page);
    await expect(timeSelector).toBeVisible({ timeout: 15000 });
    await expect(timeSelector).toContainText(timePeriod);
  }

  /**
   * Verify currency context
   * @param {string} currency - Expected currency
   */
  async verifyCurrencyContext(currency) {
    const currencySelector = locators.currencySelector(this.page);
    await expect(currencySelector).toBeVisible({ timeout: 15000 });
    await expect(currencySelector).toContainText(currency);
  }

  /**
   * Verify plan version context
   * @param {string} version - Expected plan version
   */
  async verifyPlanVersionContext(version) {
    const versionButton = locators.versionButton(this.page);
    await expect(versionButton).toBeVisible({ timeout: 15000 });
    await expect(versionButton).toContainText(version);
  }

  /**
   * Verify budget input sheet loads
   */
  async verifyBudgetInputSheetLoads() {
    await expect(locators.tabContent(this.page)).toBeVisible({ timeout: 30000 });
  }

  /**
   * Verify sheet displays data for correct department
   * @param {string} department - Expected department
   */
  async verifySheetDisplaysDepartmentData(department) {
    const content = locators.tabContent(this.page);
    await expect(content).toBeVisible({ timeout: 15000 });
    await expect(content).toContainText(department);
  }
}

module.exports = WorkdayBudgetSalesPage;