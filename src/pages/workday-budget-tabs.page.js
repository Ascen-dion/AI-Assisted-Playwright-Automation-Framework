/**
 * Page Object for Workday Adaptive Planning Budget Tabs
 * @module workday-budget-tabs.page
 */

const locators = require('./locators/workday-budget-tabs.locators');
const { expect } = require('@playwright/test');

class WorkdayBudgetTabsPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Verify tab strip is visible
   */
  async verifyTabStripVisible() {
    await expect(locators.tabStrip(this.page)).toBeVisible();
  }

  /**
   * Click tab by name
   * @param {string} tabName - Name of the tab to click
   */
  async clickTab(tabName) {
    await expect(locators.tab(this.page, tabName)).toBeVisible();
    await locators.tab(this.page, tabName).click();
  }

  /**
   * Verify tab is active
   * @param {string} tabName - Name of the tab
   */
  async verifyTabActive(tabName) {
    const activeTab = locators.activeTab(this.page);
    await expect(activeTab).toBeVisible();
    const text = await activeTab.textContent();
    expect(text.trim()).toBe(tabName);
  }

  /**
   * Get count of all tabs
   * @returns {Promise<number>} Number of tabs
   */
  async getTabCount() {
    return await locators.allTabs(this.page).count();
  }

  /**
   * Scroll tabs left
   */
  async scrollTabsLeft() {
    const scrollBtn = locators.scrollLeft(this.page);
    if (await scrollBtn.isVisible()) {
      await scrollBtn.click();
    }
  }

  /**
   * Scroll tabs right
   */
  async scrollTabsRight() {
    const scrollBtn = locators.scrollRight(this.page);
    if (await scrollBtn.isVisible()) {
      await scrollBtn.click();
    }
  }

  /**
   * Verify tab content is visible
   */
  async verifyTabContentVisible() {
    await expect(locators.tabContent(this.page)).toBeVisible();
  }

  /**
   * Switch to tab and verify
   * @param {string} tabName - Name of the tab
   */
  async switchToTab(tabName) {
    await this.clickTab(tabName);
    await this.verifyTabActive(tabName);
    await this.verifyTabContentVisible();
  }
}

module.exports = WorkdayBudgetTabsPage;