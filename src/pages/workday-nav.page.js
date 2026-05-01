/**
 * Page Object for Workday Adaptive Planning Navigation
 * @module workday-nav.page
 */

const locators = require('./locators/workday-nav.locators');
const { expect } = require('@playwright/test');

class WorkdayNavPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Verify sidebar is visible
   */
  async verifySidebarVisible() {
    await expect(locators.sidebar(this.page)).toBeVisible();
  }

  /**
   * Click menu item by name
   * @param {string} menuName - Name of the menu item to click
   */
  async clickMenuItem(menuName) {
    await expect(locators.menuItem(this.page, menuName)).toBeVisible();
    await locators.menuItem(this.page, menuName).click();
  }

  /**
   * Verify menu item is active
   * @param {string} menuName - Name of the menu item
   */
  async verifyMenuItemActive(menuName) {
    const activeItem = locators.activeMenuItem(this.page);
    await expect(activeItem).toBeVisible();
    const text = await activeItem.textContent();
    expect(text).toContain(menuName);
  }

  /**
   * Click back button
   */
  async clickBack() {
    await expect(locators.backButton(this.page)).toBeVisible();
    await locators.backButton(this.page).click();
  }

  /**
   * Navigate to specific section
   * @param {string} section - Section name (Sheets, Reports, Modeling, Process, Integration, Administration)
   */
  async navigateToSection(section) {
    await this.verifySidebarVisible();
    await this.clickMenuItem(section);
  }
}

module.exports = WorkdayNavPage;