const logger = require('../helpers/logger');
const locators = require('./locators/adaptive-budget-tabs.locators');

class AdaptiveBudgetTabsPage {
  constructor(page) {
    this.page = page;
  }

  async getActiveTab() {
    try {
      logger.info('Getting active tab');
      const activeTab = locators.activeTab(this.page);
      await activeTab.waitFor({ state: 'visible', timeout: 15000 });
      const tabName = await activeTab.textContent();
      logger.info(`Active tab: ${tabName}`);
      return tabName.trim();
    } catch (error) {
      logger.error(`Failed to get active tab: ${error.message}`);
      throw error;
    }
  }

  async isTabActive(tabName) {
    try {
      logger.info(`Checking if tab is active: ${tabName}`);
      const activeTab = locators.activeTab(this.page);
      await activeTab.waitFor({ state: 'visible', timeout: 15000 });
      const activeTabText = await activeTab.textContent();
      const isActive = activeTabText.trim() === tabName;
      logger.info(`Tab ${tabName} active status: ${isActive}`);
      return isActive;
    } catch (error) {
      logger.error(`Failed to check if tab is active: ${error.message}`);
      throw error;
    }
  }

  async clickTab(tabName) {
    try {
      logger.info(`Clicking tab: ${tabName}`);
      const tab = locators.tab(this.page, tabName);
      await tab.waitFor({ state: 'visible', timeout: 15000 });
      await tab.click();
      await this.page.waitForLoadState('networkidle', { timeout: 60000 });
      logger.info(`Successfully clicked tab: ${tabName}`);
    } catch (error) {
      logger.error(`Failed to click tab ${tabName}: ${error.message}`);
      throw error;
    }
  }

  async getAllTabNames() {
    try {
      logger.info('Getting all tab names');
      const allTabs = locators.allTabs(this.page);
      await allTabs.first().waitFor({ state: 'visible', timeout: 15000 });
      const tabNames = await allTabs.allTextContents();
      const trimmedNames = tabNames.map(name => name.trim());
      logger.info(`Found ${trimmedNames.length} tabs: ${trimmedNames.join(', ')}`);
      return trimmedNames;
    } catch (error) {
      logger.error(`Failed to get all tab names: ${error.message}`);
      throw error;
    }
  }

  async verifyTabOrder(expectedTabs) {
    try {
      logger.info('Verifying tab order');
      const actualTabs = await this.getAllTabNames();
      const isOrderCorrect = JSON.stringify(actualTabs) === JSON.stringify(expectedTabs);
      logger.info(`Tab order verification: ${isOrderCorrect}`);
      return isOrderCorrect;
    } catch (error) {
      logger.error(`Failed to verify tab order: ${error.message}`);
      throw error;
    }
  }

  async isTabVisible(tabName) {
    try {
      logger.info(`Checking if tab is visible: ${tabName}`);
      const tab = locators.tab(this.page, tabName);
      const isVisible = await tab.isVisible();
      logger.info(`Tab ${tabName} visibility: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Failed to check tab visibility: ${error.message}`);
      return false;
    }
  }

  async isScrollLeftButtonVisible() {
    try {
      logger.info('Checking if scroll left button is visible');
      const scrollLeft = locators.scrollLeft(this.page);
      const isVisible = await scrollLeft.isVisible();
      logger.info(`Scroll left button visibility: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Failed to check scroll left button visibility: ${error.message}`);
      return false;
    }
  }

  async isScrollRightButtonVisible() {
    try {
      logger.info('Checking if scroll right button is visible');
      const scrollRight = locators.scrollRight(this.page);
      const isVisible = await scrollRight.isVisible();
      logger.info(`Scroll right button visibility: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Failed to check scroll right button visibility: ${error.message}`);
      return false;
    }
  }

  async isScrollLeftButtonDisabled() {
    try {
      logger.info('Checking if scroll left button is disabled');
      const scrollLeft = locators.scrollLeft(this.page);
      await scrollLeft.waitFor({ state: 'visible', timeout: 15000 });
      const isDisabled = await scrollLeft.isDisabled();
      logger.info(`Scroll left button disabled status: ${isDisabled}`);
      return isDisabled;
    } catch (error) {
      logger.error(`Failed to check scroll left button disabled status: ${error.message}`);
      throw error;
    }
  }

  async clickScrollRight() {
    try {
      logger.info('Clicking scroll right button');
      const scrollRight = locators.scrollRight(this.page);
      await scrollRight.waitFor({ state: 'visible', timeout: 15000 });
      await scrollRight.click();
      await this.page.waitForTimeout(500);
      logger.info('Successfully clicked scroll right button');
    } catch (error) {
      logger.error(`Failed to click scroll right button: ${error.message}`);
      throw error;
    }
  }

  async clickScrollLeft() {
    try {
      logger.info('Clicking scroll left button');
      const scrollLeft = locators.scrollLeft(this.page);
      await scrollLeft.waitFor({ state: 'visible', timeout: 15000 });
      await scrollLeft.click();
      await this.page.waitForTimeout(500);
      logger.info('Successfully clicked scroll left button');
    } catch (error) {
      logger.error(`Failed to click scroll left button: ${error.message}`);
      throw error;
    }
  }

  async getTabContent() {
    try {
      logger.info('Getting tab content');
      const tabContent = locators.tabContent(this.page);
      await tabContent.waitFor({ state: 'visible', timeout: 15000 });
      const content = await tabContent.textContent();
      logger.info('Tab content retrieved successfully');
      return content;
    } catch (error) {
      logger.error(`Failed to get tab content: ${error.message}`);
      throw error;
    }
  }

  async isTabContentVisible() {
    try {
      logger.info('Checking if tab content is visible');
      const tabContent = locators.tabContent(this.page);
      await tabContent.waitFor({ state: 'visible', timeout: 15000 });
      const isVisible = await tabContent.isVisible();
      logger.info(`Tab content visibility: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Failed to check tab content visibility: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AdaptiveBudgetTabsPage;