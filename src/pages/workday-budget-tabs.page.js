/**
 * Workday Budget Tabs Page Object
 * Handles tab navigation and interactions in budget views
 */

const budgetTabsLocators = require('./locators/workday-budget-tabs.locators');
const sharedLocators = require('./locators/workday-shared.locators');

class WorkdayBudgetTabsPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for tab strip to be visible
   */
  async waitForTabStrip() {
    await budgetTabsLocators.tabStrip(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Click on a specific tab by name
   * @param {string} tabName - Name of the tab to click
   */
  async clickTab(tabName) {
    await budgetTabsLocators.tabList(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await budgetTabsLocators.tab(this.page, tabName).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get active tab name
   * @returns {Promise<string>}
   */
  async getActiveTabName() {
    await budgetTabsLocators.activeTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await budgetTabsLocators.activeTab(this.page).textContent();
  }

  /**
   * Verify tab is active
   * @param {string} tabName - Name of the tab
   * @returns {Promise<boolean>}
   */
  async isTabActive(tabName) {
    const activeTabName = await this.getActiveTabName();
    return activeTabName.trim() === tabName.trim();
  }

  /**
   * Get all tab names
   * @returns {Promise<string[]>}
   */
  async getAllTabNames() {
    await budgetTabsLocators.tabList(this.page).waitFor({ state: 'visible', timeout: 15000 });
    const tabs = await budgetTabsLocators.allTabs(this.page).all();
    const tabNames = [];
    for (const tab of tabs) {
      tabNames.push(await tab.textContent());
    }
    return tabNames;
  }

  /**
   * Scroll tabs left
   */
  async scrollTabsLeft() {
    const scrollButton = budgetTabsLocators.scrollLeft(this.page);
    if (await scrollButton.isVisible()) {
      await scrollButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Scroll tabs right
   */
  async scrollTabsRight() {
    const scrollButton = budgetTabsLocators.scrollRight(this.page);
    if (await scrollButton.isVisible()) {
      await scrollButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Wait for tab content to load
   */
  async waitForTabContent() {
    await budgetTabsLocators.tabContent(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }
}

module.exports = WorkdayBudgetTabsPage;