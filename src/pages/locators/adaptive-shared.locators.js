/**
 * Shared Locators for Adaptive Planning
 * All locators are functions that accept page and return a locator object
 */

const locators = {
  loadingSpinner: (page) => page.locator('.loading, .spinner, [role="progressbar"]').first(),
  toast: (page) => page.locator('.toast, [role="status"], [role="alert"]').first(),
  modal: (page) => page.locator('[role="dialog"], .modal').first(),
  modalClose: (page) => page.locator('[role="dialog"] button[aria-label="Close"], .modal .close').first()
};

module.exports = locators;