/**
 * Locators for Adaptive Planning Shared/Common Elements
 * @module locators/adaptive-shared
 */

const sharedLocators = {
  loadingSpinner: (page) => page.locator('.loading, .spinner, [role="progressbar"]').first(),
  toast: (page) => page.locator('.toast, [role="status"], [role="alert"]').first(),
  modal: (page) => page.locator('[role="dialog"], .modal').first(),
  modalClose: (page) => page.locator('[role="dialog"] button[aria-label="Close"], .modal .close').first()
};

module.exports = sharedLocators;