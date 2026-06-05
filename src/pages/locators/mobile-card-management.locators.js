const locators = {
  // Login Page
  usernameField: (page) => page.locator('#inputEmail').first(),
  passwordField: (page) => page.locator('#inputPassword').first(),
  signInButton: (page) => page.locator('#submit').first(),
  rememberCheckbox: (page) => page.locator('#rememberUsername').first(),
  errorMessage: (page) => page.locator('.error-message, .login-error, [role="alert"]').first(),

  // Navigation
  sidebar: (page) => page.locator('nav').first(),
  cardManagementMenuItem: (page) => page.getByRole('link', { name: 'Card Management' }),
  backButton: (page) => page.locator('button:has-text("Back"), [aria-label="Back"], .back-button').first(),

  // Card Management Screen
  cardList: (page) => page.locator('.card-list, [data-testid="card-list"]').first(),
  cardItem: (page) => page.locator('.card-item, [data-testid="card-item"]'),
  lockedCardStatus: (page) => page.locator('.card-status:has-text("Locked"), [data-status="locked"]').first(),
  cardStatusIndicator: (page) => page.locator('.card-status, [data-testid="card-status"]').first(),

  // Card Details Screen
  cardDetailsScreen: (page) => page.locator('.card-details, [data-testid="card-details"]').first(),
  unlockCardButton: (page) => page.locator('button:has-text("Unlock Card"), [data-testid="unlock-card-button"]').first(),
  transactionLimitsButton: (page) => page.locator('button:has-text("Transaction Limits"), [data-testid="transaction-limits-button"]').first(),
  transactionChannelsButton: (page) => page.locator('button:has-text("Transaction Channels"), [data-testid="transaction-channels-button"]').first(),
  reportCardIssueButton: (page) => page.locator('button:has-text("Report a Card Issue"), [data-testid="report-card-issue-button"]').first(),

  // Prompt/Modal
  promptModal: (page) => page.locator('[role="dialog"], .modal, .prompt').first(),
  promptMessage: (page) => page.locator('[role="dialog"] .message, .modal .message, .prompt-message').first(),
  promptOkButton: (page) => page.locator('[role="dialog"] button:has-text("OK"), .modal button:has-text("OK")').first(),
  modalCloseButton: (page) => page.locator('[role="dialog"] button[aria-label="Close"], .modal .close').first(),

  // Transaction
  transactionDeclinedMessage: (page) => page.locator('.transaction-declined, .error-message:has-text("declined"), [data-testid="transaction-error"]').first(),

  // Shared Elements
  loadingSpinner: (page) => page.locator('.loading, .spinner, [role="progressbar"]').first(),
  toast: (page) => page.locator('.toast, [role="status"], [role="alert"]').first(),
  homeScreen: (page) => page.locator('main, .dashboard, [role="main"]').first()
};

module.exports = locators;