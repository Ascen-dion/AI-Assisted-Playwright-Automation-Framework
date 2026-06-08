/**
 * Locators for Mobile Card Management Module
 * NOTE: These locators MUST be updated with actual selectors from C1-Locators.txt
 * DO NOT use these placeholder locators in production without verification
 */

const locators = {
  // Login Screen Locators
  loginScreen: (page) => page.locator('[data-testid="login-screen"], .login-container').first(),
  usernameField: (page) => page.locator('input[name="username"], input[type="email"], #username').first(),
  passwordField: (page) => page.locator('input[name="password"], input[type="password"], #password').first(),
  loginButton: (page) => page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first(),
  
  // Home Screen Locators
  homeScreen: (page) => page.locator('[data-testid="home-screen"], .home-container, .dashboard').first(),
  homeScreenTitle: (page) => page.locator('h1, .page-title, [data-testid="home-title"]').first(),
  
  // Card Management Section Locators
  cardManagementMenu: (page) => page.locator('[data-testid="card-management"], a:has-text("Card Management"), button:has-text("Card Management")').first(),
  cardManagementScreen: (page) => page.locator('[data-testid="card-management-screen"], .card-management-container').first(),
  cardManagementTitle: (page) => page.locator('h1:has-text("Card Management"), .page-title').first(),
  cardList: (page) => page.locator('[data-testid="card-list"], .card-list, .cards-container').first(),
  
  // Card Status Locators
  cardStatusIndicator: (page) => page.locator('[data-testid="card-status"], .card-status, .status-indicator').first(),
  lockedStatusBadge: (page) => page.locator('[data-testid="locked-status"], .status-locked, span:has-text("Locked")').first(),
  
  // Card Details Locators
  cardDetailsScreen: (page) => page.locator('[data-testid="card-details"], .card-details-container').first(),
  cardDetailsTitle: (page) => page.locator('h1:has-text("Card Details"), .card-details-title').first(),
  lockedCardStatus: (page) => page.locator('[data-testid="card-status-locked"], .status:has-text("Locked")').first(),
  
  // Card Actions Locators
  unlockCardButton: (page) => page.locator('[data-testid="unlock-card-btn"], button:has-text("Unlock Card"), button:has-text("Unlock")').first(),
  transactionLimitsButton: (page) => page.locator('[data-testid="transaction-limits-btn"], button:has-text("Transaction Limits")').first(),
  
  // Prompt/Dialog Locators
  unlockPrompt: (page) => page.locator('[data-testid="unlock-prompt"], .dialog, .modal, [role="dialog"]').first(),
  unlockPromptMessage: (page) => page.locator('[data-testid="unlock-message"], .dialog-message, .modal-body').first(),
  unlockPromptOkButton: (page) => page.locator('[data-testid="ok-button"], button:has-text("OK"), button:has-text("Close")').first(),
  
  // Transaction Locators
  transactionErrorMessage: (page) => page.locator('[data-testid="transaction-error"], .error-message, .transaction-declined').first(),
  
  // Generic Locators
  errorMessage: (page) => page.locator('[data-testid="error-message"], .error, [role="alert"]').first(),
  successMessage: (page) => page.locator('[data-testid="success-message"], .success, .alert-success').first(),
  loadingIndicator: (page) => page.locator('[data-testid="loading"], .spinner, .loading').first(),
  
  // Dynamic Card Selector
  cardByStatus: (page, status) => page.locator(`[data-testid="card-${status.toLowerCase()}"], .card[data-status="${status}"]`).first(),
  cardById: (page, cardId) => page.locator(`[data-testid="card-${cardId}"], [data-card-id="${cardId}"]`).first()
};

module.exports = locators;