/**
 * Page Object for Workday Adaptive Planning Budget Tabs
 * @class WorkdayBudgetTabsPage
 */

const loc = require('./locators/workday-budget-tabs.locators');

class WorkdayBudgetTabsPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for tab strip to load
   */
  async waitForTabStripLoad() {
    await loc.tabStrip(this.page).waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Get active tab name
   * @returns {Promise<string>}
   */
  async getActiveTabName() {
    await loc.activeTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.activeTab(this.page).textContent();
  }

  /**
   * Click on a tab by name
   * @param {string} tabName - Name of the tab to click
   */
  async clickTab(tabName) {
    await loc.tab(this.page, tabName).waitFor({ state: 'visible', timeout: 15000 });
    await loc.tab(this.page, tabName).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check if Instructions tab is active
   * @returns {Promise<boolean>}
   */
  async isInstructionsTabActive() {
    const activeTabName = await this.getActiveTabName();
    return activeTabName.trim() === 'Instructions';
  }

  /**
   * Check if tab content is visible
   * @returns {Promise<boolean>}
   */
  async isTabContentVisible() {
    try {
      await loc.tabContent(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get all tab names in order
   * @returns {Promise<string[]>}
   */
  async getAllTabNames() {
    await loc.allTabs(this.page).first().waitFor({ state: 'visible', timeout: 15000 });
    const tabs = await loc.allTabs(this.page).all();
    const tabNames = [];
    for (const tab of tabs) {
      const name = await tab.textContent();
      tabNames.push(name.trim());
    }
    return tabNames;
  }

  /**
   * Verify tab exists by name
   * @param {string} tabName - Name of the tab
   * @returns {Promise<boolean>}
   */
  async isTabVisible(tabName) {
    try {
      await loc.tab(this.page, tabName).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if only one tab is highlighted
   * @returns {Promise<boolean>}
   */
  async isOnlyOneTabHighlighted() {
    const highlightedTabs = await this.page.locator('[role="tab"][aria-selected="true"]').count();
    return highlightedTabs === 1;
  }

  /**
   * Click scroll left button
   */
  async clickScrollLeft() {
    await loc.scrollLeftButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.scrollLeftButton(this.page).click();
  }

  /**
   * Click scroll right button
   */
  async clickScrollRight() {
    await loc.scrollRightButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.scrollRightButton(this.page).click();
  }

  /**
   * Check if scroll left button is disabled
   * @returns {Promise<boolean>}
   */
  async isScrollLeftDisabled() {
    const isDisabled = await loc.scrollLeftButton(this.page).isDisabled();
    return isDisabled;
  }

  /**
   * Check if scroll right button is disabled
   * @returns {Promise<boolean>}
   */
  async isScrollRightDisabled() {
    const isDisabled = await loc.scrollRightButton(this.page).isDisabled();
    return isDisabled;
  }

  /**
   * Check if scroll buttons are visible
   * @returns {Promise<boolean>}
   */
  async areScrollButtonsVisible() {
    try {
      await loc.scrollLeftButton(this.page).waitFor({ state: 'visible', timeout: 5000 });
      await loc.scrollRightButton(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get tab aria-selected attribute value
   * @param {string} tabName - Name of the tab
   * @returns {Promise<string>}
   */
  async getTabAriaSelected(tabName) {
    await loc.tab(this.page, tabName).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.tab(this.page, tabName).getAttribute('aria-selected');
  }
}

module.exports = WorkdayBudgetTabsPage;