/**
 * Salesforce Record Base Page
 * 
 * This is a base class for all Salesforce record pages (Account, Contact, Lead, Opportunity, etc.)
 * It provides common methods for CRUD operations.
 */

const loc = require('../locators/salesforce-record-base.locators');

class SalesforceRecordBasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for Lightning page to fully load
   */
  async waitForPageLoad() {
    // Wait for Lightning spinner to disappear
    await this.page.waitForSelector('lightning-spinner', { state: 'detached', timeout: 10000 }).catch(() => {});
    
    // Wait for record details to be visible
    await loc.recordDetails(this.page).waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click "New" button to create a new record
   */
  async clickNew() {
    await loc.newButton(this.page).click();
    await this.waitForPageLoad();
  }

  /**
   * Click "Edit" button to edit current record
   */
  async clickEdit() {
    await loc.editButton(this.page).click();
    await this.waitForPageLoad();
  }

  /**
   * Click "Save" button to save record changes
   */
  async clickSave() {
    await loc.saveButton(this.page).click();
    await this.waitForPageLoad();
  }

  /**
   * Click "Cancel" button to cancel edit mode
   */
  async clickCancel() {
    await loc.cancelButton(this.page).click();
    await this.waitForPageLoad();
  }

  /**
   * Delete current record
   */
  async deleteRecord() {
    // Open action dropdown
    await loc.showActionsButton(this.page).click();
    
    // Click Delete
    await loc.deleteButton(this.page).click();
    
    // Confirm in modal
    await loc.modal(this.page).waitFor({ state: 'visible', timeout: 5000 });
    await loc.modalConfirmButton(this.page).click();
    
    // Wait for redirect to list view
    await this.page.waitForURL(/.*\/lightning\/o\/.*\/list/, { timeout: 10000 }).catch(() => {});
  }

  /**
   * Get record title from page header
   * @returns {Promise<string>}
   */
  async getRecordTitle() {
    return await loc.recordTitle(this.page).innerText();
  }

  /**
   * Verify record title matches expected value
   * @param {string} expectedTitle - The expected record title
   */
  async verifyRecordTitle(expectedTitle) {
    const actualTitle = await this.getRecordTitle();
    if (!actualTitle.includes(expectedTitle)) {
      throw new Error(`Expected record title to include "${expectedTitle}", but got "${actualTitle}"`);
    }
  }

  /**
   * Verify success toast message
   * @param {string} expectedMessage - Optional expected message text
   */
  async verifySuccessToast(expectedMessage = null) {
    const toast = loc.toastMessage(this.page);
    await toast.waitFor({ state: 'visible', timeout: 5000 });
    
    if (expectedMessage) {
      const toastText = await toast.innerText();
      if (!toastText.includes(expectedMessage)) {
        throw new Error(`Expected toast message to include "${expectedMessage}", but got "${toastText}"`);
      }
    }
  }

  /**
   * Fill a Lightning input field
   * @param {string} fieldName - The field-name attribute value
   * @param {string} value - The value to fill
   */
  async fillLightningInput(fieldName, value) {
    const input = this.page.locator(`lightning-input[field-name="${fieldName}"]`).locator('input');
    await input.waitFor({ state: 'visible', timeout: 5000 });
    await input.fill(value);
  }

  /**
   * Fill a Lightning textarea field
   * @param {string} fieldName - The field-name attribute value
   * @param {string} value - The value to fill
   */
  async fillLightningTextarea(fieldName, value) {
    const textarea = this.page.locator(`lightning-textarea[field-name="${fieldName}"]`).locator('textarea');
    await textarea.waitFor({ state: 'visible', timeout: 5000 });
    await textarea.fill(value);
  }

  /**
   * Select from Lightning combobox/picklist
   * @param {string} fieldName - The field-name attribute value
   * @param {string} optionLabel - The option label to select
   */
  async selectComboboxOption(fieldName, optionLabel) {
    // Click to open combobox
    await this.page.locator(`lightning-combobox[field-name="${fieldName}"]`).click();
    
    // Click the option
    await this.page.locator(`lightning-base-combobox-item:has-text("${optionLabel}")`).click();
  }

  /**
   * Check a Lightning checkbox
   * @param {string} fieldName - The field-name attribute value
   */
  async checkLightningCheckbox(fieldName) {
    const checkbox = this.page.locator(`lightning-input[field-name="${fieldName}"]`).locator('input[type="checkbox"]');
    await checkbox.check();
  }

  /**
   * Uncheck a Lightning checkbox
   * @param {string} fieldName - The field-name attribute value
   */
  async uncheckLightningCheckbox(fieldName) {
    const checkbox = this.page.locator(`lightning-input[field-name="${fieldName}"]`).locator('input[type="checkbox"]');
    await checkbox.uncheck();
  }

  /**
   * Fill a Lightning lookup field
   * @param {string} fieldName - The field-name attribute value
   * @param {string} searchTerm - The search term
   * @param {string} resultText - The result text to click
   */
  async fillLookupField(fieldName, searchTerm, resultText) {
    // Click the lookup field to open it
    const lookupInput = this.page.locator(`input[title*="${fieldName}"]`).first();
    await lookupInput.click();
    
    // Fill search term
    await lookupInput.fill(searchTerm);
    
    // Wait for results and click the matching one
    await this.page.waitForTimeout(1000); // Wait for search results
    await this.page.locator(`lightning-base-combobox-item:has-text("${resultText}")`).click();
  }
}

module.exports = SalesforceRecordBasePage;
