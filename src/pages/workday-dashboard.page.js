/**
 * Page Object for Workday Dashboard/Home Page
 * Handles dashboard verification and navigation
 */

const locators = require('./locators/workday-budget-sales.locators');
const { expect } = require('@playwright/test');

class WorkdayDashboardPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Verify dashboard/home page loads successfully
   */
  async verifyDashboardLoaded() {
    await expect(locators.dashboardContainer(this.page)).toBeVisible({ timeout: 30000 });
  }

  /**
   * Verify user is logged in successfully
   */
  async verifyUserLoggedIn() {
    await this.verifyDashboardLoaded();
    // Additional verification that we're past login
    const currentUrl = this.page.url();
    expect(currentUrl).not.toContain('login');
  }

  /**
   * Navigate to Budget Entry - Sales page
   */
  async navigateToBudgetEntrySales() {
    // Click on menu item to navigate to Budget Entry - Sales
    const budgetMenuItem = locators.menuItem(this.page, 'Budget Entry - Sales');
    await budgetMenuItem.waitFor({ state: 'visible', timeout: 15000 });
    await budgetMenuItem.click();
  }
}

module.exports = WorkdayDashboardPage;