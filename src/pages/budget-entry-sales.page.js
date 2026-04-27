/**
 * Budget Entry - Sales Page Object
 * Handles interactions with the Budget Entry - Sales page including tabs
 */

const tabLoc = require('./locators/budget-tabs.locators');
const headerLoc = require('./locators/budget-header.locators');

class BudgetEntrySalesPage {
  constructor(page) {
    this.page = page;
  }

  async clickTab(tabName) {
    await tabLoc.tab(this.page, tabName).click();
    // Wait for tab content to load
    await this.page.waitForTimeout(1000);
  }

  async getActiveTabName() {
    return await tabLoc.activeTab(this.page).textContent();
  }

  async isTabActive(tabName) {
    const activeTab = await this.getActiveTabName();
    return activeTab.trim() === tabName;
  }

  async getAllTabNames() {
    const tabs = await tabLoc.allTabs(this.page).all();
    const tabNames = [];
    for (const tab of tabs) {
      const name = await tab.textContent();
      tabNames.push(name.trim());
    }
    return tabNames;
  }

  async isTabVisible(tabName) {
    return await tabLoc.tab(this.page, tabName).isVisible();
  }

  async clickScrollRight() {
    await tabLoc.scrollRight(this.page).click();
    await this.page.waitForTimeout(500);
  }

  async clickScrollLeft() {
    await tabLoc.scrollLeft(this.page).click();
    await this.page.waitForTimeout(500);
  }

  async isScrollLeftDisabled() {
    const button = tabLoc.scrollLeft(this.page);
    const isDisabled = await button.getAttribute('disabled');
    const ariaDisabled = await button.getAttribute('aria-disabled');
    return isDisabled !== null || ariaDisabled === 'true';
  }

  async isScrollRightDisabled() {
    const button = tabLoc.scrollRight(this.page);
    const isDisabled = await button.getAttribute('disabled');
    const ariaDisabled = await button.getAttribute('aria-disabled');
    return isDisabled !== null || ariaDisabled === 'true';
  }

  async isScrollLeftVisible() {
    return await tabLoc.scrollLeft(this.page).isVisible();
  }

  async isScrollRightVisible() {
    return await tabLoc.scrollRight(this.page).isVisible();
  }

  async getTabContent() {
    return await tabLoc.tabContent(this.page).textContent();
  }

  async isTabContentVisible() {
    return await tabLoc.tabContent(this.page).isVisible();
  }

  async selectDepartment(department) {
    await headerLoc.levelSelector(this.page).click();
    await this.page.locator(`text=${department}`).click();
  }

  async selectTimePeriod(period) {
    await headerLoc.timeSelector(this.page).click();
    await this.page.locator(`text=${period}`).click();
  }

  async selectCurrency(currency) {
    await headerLoc.currencySelector(this.page).click();
    await this.page.locator(`text=${currency}`).click();
  }

  async selectPlanVersion(version) {
    await headerLoc.versionButton(this.page).click();
    await this.page.locator(`text=${version}`).click();
  }

  async getSelectedDepartment() {
    return await headerLoc.levelSelector(this.page).textContent();
  }

  async getSelectedTimePeriod() {
    return await headerLoc.timeSelector(this.page).textContent();
  }

  async getSelectedCurrency() {
    return await headerLoc.currencySelector(this.page).textContent();
  }

  async getSelectedPlanVersion() {
    return await headerLoc.versionButton(this.page).textContent();
  }
}

module.exports = BudgetEntrySalesPage;