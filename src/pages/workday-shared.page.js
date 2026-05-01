/**
 * Page Object for Workday Adaptive Planning Shared Elements
 * @module workday-shared.page
 */

const locators = require('./locators/workday-shared.locators');
const { expect } = require('@playwright/test');

class WorkdaySharedPage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for loading spinner to disappear
   * @param {number} timeout - Timeout in milliseconds (default 30000)
   */
  async waitForLoadingComplete(timeout = 30000) {
    const spinner = locators.loadingSpinner(this.page);
    try {
      await spinner.waitFor({ state: 'visible', timeout: 5000 });
      await spinner.waitFor({ state: 'hidden', timeout: timeout });
    } catch (error) {
      // Spinner may not appear, continue
    }
  }

  /**
   * Get toast message text
   * @returns {Promise<string>} Toast message
   */
  async getToastMessage() {
    await expect(locators.toast(this.page)).toBeVisible();
    return await locators.toast(this.page).textContent();
  }

  /**
   * Verify toast message is displayed
   * @param {string} expectedMessage - Expected message text
   */
  async verifyToastMessage(expectedMessage) {
    const message = await this.getToastMessage();
    expect(message).toContain(expectedMessage);
  }

  /**
   * Wait for toast to disappear
   */
  async waitForToastDisappear() {
    const toast = locators.toast(this.page);
    try {
      await toast.waitFor({ state: 'visible', timeout: 5000 });
      await toast.waitFor({ state: 'hidden', timeout: 10000 });
    } catch (error) {
      // Toast may not appear, continue
    }
  }

  /**
   * Verify modal is visible
   */
  async verifyModalVisible() {
    await expect(locators.modal(this.page)).toBeVisible();
  }

  /**
   * Close modal
   */
  async closeModal() {
    await expect(locators.modalClose(this.page)).toBeVisible();
    await locators.modalClose(this.page).click();
    await expect(locators.modal(this.page)).toBeHidden();
  }
}

module.exports = WorkdaySharedPage;