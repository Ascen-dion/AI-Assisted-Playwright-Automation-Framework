/**
 * Salesforce Record Page Locators (Base)
 * 
 * This module contains common locators for Salesforce record pages (Account, Contact, Lead, etc.)
 */

const locators = {
  /**
   * New button (to create a new record)
   */
  newButton: (page) => page.locator('div[title="New"], button:has-text("New")').first(),

  /**
   * Edit button (to edit current record)
   */
  editButton: (page) => page.locator('button[name="Edit"], button:has-text("Edit")').first(),

  /**
   * Save button (to save record changes)
   */
  saveButton: (page) => page.locator('button[name="SaveEdit"], button:has-text("Save")').first(),

  /**
   * Cancel button (to cancel edit mode)
   */
  cancelButton: (page) => page.locator('button[name="CancelEdit"], button:has-text("Cancel")').first(),

  /**
   * Delete button in action dropdown
   */
  deleteButton: (page) => page.locator('a[title="Delete"]'),

  /**
   * Show Actions dropdown button
   */
  showActionsButton: (page) => page.locator('button[title="Show Actions"]').first(),

  /**
   * Record page header title
   */
  recordTitle: (page) => page.locator('h1.slds-page-header__title, span.uiOutputText').first(),

  /**
   * Lightning spinner (loading indicator)
   */
  lightningSpinner: (page) => page.locator('lightning-spinner'),

  /**
   * Record highlights panel (key fields at top)
   */
  recordHighlights: (page) => page.locator('div.highlights'),

  /**
   * Record details section
   */
  recordDetails: (page) => page.locator('article.slds-card').first(),

  /**
   * Related lists section
   */
  relatedLists: (page) => page.locator('article.slds-card:has-text("Related")'),

  /**
   * Toast message container (success/error)
   */
  toastMessage: (page) => page.locator('div.forceVisualMessageQueue div.toastMessage'),

  /**
   * Modal dialog (for confirmations, etc.)
   */
  modal: (page) => page.locator('div.slds-modal'),

  /**
   * Modal footer (contains action buttons)
   */
  modalFooter: (page) => page.locator('div.slds-modal__footer'),

  /**
   * Confirm button in modal (e.g., Delete confirmation)
   */
  modalConfirmButton: (page) => page.locator('div.slds-modal button[title*="Delete"], div.slds-modal button:has-text("Delete")'),
};

module.exports = locators;
