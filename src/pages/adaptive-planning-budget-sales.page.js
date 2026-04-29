/**
 * Page Object for Adaptive Planning Budget Entry - Sales Page
 * Follows framework POM pattern with locators imported from locators file
 */

const locators = require('./locators/adaptive-planning-budget-sales.locators');
const logger = require('../helpers/logger');

class AdaptivePlanningBudgetSalesPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to the application URL
   * @param {string} url - Application URL
   */
  async navigateToApplication(url) {
    try {
      logger.info(`Navigating to application URL: ${url}`);
      await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      logger.info('Application page loaded successfully');
    } catch (error) {
      logger.error(`Failed to navigate to application: ${error.message}`);
      throw error;
    }
  }

  /**
   * Login to the application
   * @param {string} username - Username
   * @param {string} password - Password
   */
  async login(username, password) {
    try {
      logger.info(`Logging in with username: ${username}`);
      
      await locators.usernameInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
      await locators.usernameInput(this.page).fill(username);
      logger.info('Username entered');
      
      await locators.passwordInput(this.page).waitFor({ state: 'visible', timeout: 15000 });
      await locators.passwordInput(this.page).fill(password);
      logger.info('Password entered');
      
      await locators.loginButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
      await locators.loginButton(this.page).click();
      logger.info('Login button clicked');
      
      // Wait for navigation after login
      await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
      logger.info('Login successful, dashboard loaded');
    } catch (error) {
      logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Navigate to Budget Entry - Sales page
   */
  async navigateToBudgetEntrySales() {
    try {
      logger.info('Navigating to Budget Entry - Sales page');
      
      // Wait for sidebar to be visible
      await locators.sidebar(this.page).waitFor({ state: 'visible', timeout: 15000 });
      
      // Click on Sheets menu if needed
      const sheetsMenu = locators.sheetsMenu(this.page);
      if (await sheetsMenu.isVisible()) {
        await sheetsMenu.click();
        logger.info('Sheets menu clicked');
        await this.page.waitForTimeout(1000); // Brief wait for menu expansion
      }
      
      // Click on Budget Entry - Sales link
      await locators.budgetEntrySalesLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
      await locators.budgetEntrySalesLink(this.page).click();
      logger.info('Budget Entry - Sales link clicked');
      
      // Wait for page to load
      await this.page.waitForLoadState('domcontentloaded', { timeout: 60000 });
      await locators.tabContainer(this.page).waitFor({ state: 'visible', timeout: 15000 });
      logger.info('Budget Entry - Sales page loaded successfully');
    } catch (error) {
      logger.error(`Failed to navigate to Budget Entry - Sales: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify default selected tab
   * @returns {boolean} - True if Instructions tab is active
   */
  async verifyDefaultTab() {
    try {
      logger.info('Verifying default selected tab');
      await locators.instructionsTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
      
      const instructionsTab = locators.instructionsTab(this.page);
      const isActive = await instructionsTab.getAttribute('aria-selected') === 'true' ||
                       await instructionsTab.evaluate(el => el.classList.contains('active'));
      
      logger.info(`Instructions tab active status: ${isActive}`);
      return isActive;
    } catch (error) {
      logger.error(`Failed to verify default tab: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify instructions content is displayed
   * @returns {boolean} - True if content is visible
   */
  async verifyInstructionsContent() {
    try {
      logger.info('Verifying instructions content is displayed');
      await locators.instructionsContent(this.page).waitFor({ state: 'visible', timeout: 15000 });
      const isVisible = await locators.instructionsContent(this.page).isVisible();
      logger.info(`Instructions content visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Failed to verify instructions content: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all visible tabs
   * @returns {Array} - Array of tab names
   */
  async getAllTabs() {
    try {
      logger.info('Getting all visible tabs');
      const tabs = await this.page.locator('[role="tab"]').allTextContents();
      logger.info(`Found ${tabs.length} tabs: ${tabs.join(', ')}`);
      return tabs;
    } catch (error) {
      logger.error(`Failed to get all tabs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify tab order
   * @param {Array} expectedTabs - Expected tab order
   * @returns {boolean} - True if tabs match expected order
   */
  async verifyTabOrder(expectedTabs) {
    try {
      logger.info('Verifying tab order');
      const actualTabs = await this.getAllTabs();
      
      const matches = expectedTabs.every((tab, index) => 
        actualTabs[index] && actualTabs[index].trim() === tab.trim()
      );
      
      logger.info(`Tab order matches expected: ${matches}`);
      return matches;
    } catch (error) {
      logger.error(`Failed to verify tab order: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click on a specific tab
   * @param {string} tabName - Name of the tab to click
   */
  async clickTab(tabName) {
    try {
      logger.info(`Clicking on ${tabName} tab`);
      const tab = locators.tabByText(this.page, tabName);
      await tab.waitFor({ state: 'visible', timeout: 15000 });
      await tab.click();
      
      // Wait for tab content to load
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(1000); // Brief wait for content rendering
      logger.info(`${tabName} tab clicked and content loaded`);
    } catch (error) {
      logger.error(`Failed to click ${tabName} tab: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify if a specific tab is active
   * @param {string} tabName - Name of the tab
   * @returns {boolean} - True if tab is active
   */
  async isTabActive(tabName) {
    try {
      logger.info(`Checking if ${tabName} tab is active`);
      const tab = locators.tabByText(this.page, tabName);
      await tab.waitFor({ state: 'visible', timeout: 15000 });
      
      const isActive = await tab.getAttribute('aria-selected') === 'true' ||
                       await tab.evaluate(el => el.classList.contains('active') || el.classList.contains('tab-active'));
      
      logger.info(`${tabName} tab active status: ${isActive}`);
      return isActive;
    } catch (error) {
      logger.error(`Failed to check if ${tabName} tab is active: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify only one tab is highlighted
   * @returns {number} - Number of active tabs
   */
  async countActiveTabs() {
    try {
      logger.info('Counting active tabs');
      const activeTabs = await this.page.locator('[role="tab"][aria-selected="true"], .tab.active, .tab-active').count();
      logger.info(`Number of active tabs: ${activeTabs}`);
      return activeTabs;
    } catch (error) {
      logger.error(`Failed to count active tabs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Resize browser window
   * @param {number} width - Window width
   * @param {number} height - Window height
   */
  async resizeBrowserWindow(width, height) {
    try {
      logger.info(`Resizing browser window to ${width}x${height}`);
      await this.page.setViewportSize({ width, height });
      await this.page.waitForTimeout(1000); // Wait for UI to adjust
      logger.info('Browser window resized');
    } catch (error) {
      logger.error(`Failed to resize browser window: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify scroll arrows are visible
   * @returns {Object} - Visibility status of left and right arrows
   */
  async verifyScrollArrows() {
    try {
      logger.info('Verifying scroll arrows visibility');
      const leftVisible = await locators.leftScrollArrow(this.page).isVisible();
      const rightVisible = await locators.rightScrollArrow(this.page).isVisible();
      
      logger.info(`Left arrow visible: ${leftVisible}, Right arrow visible: ${rightVisible}`);
      return { leftVisible, rightVisible };
    } catch (error) {
      logger.error(`Failed to verify scroll arrows: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if left scroll arrow is disabled
   * @returns {boolean} - True if disabled
   */
  async isLeftArrowDisabled() {
    try {
      logger.info('Checking if left arrow is disabled');
      const leftArrow = locators.leftScrollArrow(this.page);
      const isDisabled = await leftArrow.isDisabled() || 
                         await leftArrow.getAttribute('disabled') !== null ||
                         await leftArrow.evaluate(el => el.classList.contains('disabled'));
      
      logger.info(`Left arrow disabled: ${isDisabled}`);
      return isDisabled;
    } catch (error) {
      logger.error(`Failed to check left arrow status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click right scroll arrow
   */
  async clickRightScrollArrow() {
    try {
      logger.info('Clicking right scroll arrow');
      await locators.rightScrollArrow(this.page).waitFor({ state: 'visible', timeout: 15000 });
      await locators.rightScrollArrow(this.page).click();
      await this.page.waitForTimeout(500); // Wait for scroll animation
      logger.info('Right scroll arrow clicked');
    } catch (error) {
      logger.error(`Failed to click right scroll arrow: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click left scroll arrow
   */
  async clickLeftScrollArrow() {
    try {
      logger.info('Clicking left scroll arrow');
      await locators.leftScrollArrow(this.page).waitFor({ state: 'visible', timeout: 15000 });
      await locators.leftScrollArrow(this.page).click();
      await this.page.waitForTimeout(500); // Wait for scroll animation
      logger.info('Left scroll arrow clicked');
    } catch (error) {
      logger.error(`Failed to click left scroll arrow: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get context values (department, time period, currency, plan version)
   * @returns {Object} - Context values
   */
  async getContextValues() {
    try {
      logger.info('Getting context values');
      
      const department = await locators.departmentContext(this.page).textContent().catch(() => 'N/A');
      const timePeriod = await locators.timePeriodContext(this.page).textContent().catch(() => 'N/A');
      const currency = await locators.currencyContext(this.page).textContent().catch(() => 'N/A');
      const planVersion = await locators.planVersionContext(this.page).textContent().catch(() => 'N/A');
      
      const context = {
        department: department.trim(),
        timePeriod: timePeriod.trim(),
        currency: currency.trim(),
        planVersion: planVersion.trim()
      };
      
      logger.info(`Context values: ${JSON.stringify(context)}`);
      return context;
    } catch (error) {
      logger.error(`Failed to get context values: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify budget input sheet is displayed
   * @returns {boolean} - True if sheet is visible
   */
  async verifyBudgetInputSheet() {
    try {
      logger.info('Verifying budget input sheet is displayed');
      await locators.budgetInputSheet(this.page).waitFor({ state: 'visible', timeout: 15000 });
      const isVisible = await locators.budgetInputSheet(this.page).isVisible();
      logger.info(`Budget input sheet visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Failed to verify budget input sheet: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AdaptivePlanningBudgetSalesPage;