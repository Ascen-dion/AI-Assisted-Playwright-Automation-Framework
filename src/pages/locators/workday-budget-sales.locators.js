/**
 * Locators for Workday Budget Entry - Sales Page
 * Following framework pattern: locators return Playwright locator objects
 */

const locators = {
  // Login Page Locators
  usernameField: (page) => page.locator('#inputEmail'),
  passwordField: (page) => page.locator('#inputPassword'),
  signInButton: (page) => page.locator('#submit'),
  rememberCheckbox: (page) => page.locator('#rememberUsername'),
  forgotPasswordLink: (page) => page.getByText('Forgot Password'),
  errorMessage: (page) => page.locator('.error-message, .login-error, [role="alert"]').first(),

  // Navigation Locators
  sidebar: (page) => page.locator('nav'),
  menuItem: (page, text) => page.locator(`role=link[name='${text}']`),
  activeMenuItem: (page) => page.locator('.active, [aria-current="page"]').first(),
  backButton: (page) => page.locator('button:has-text("Back"), [aria-label="Back"], .back-button').first(),

  // Dashboard Locators
  dashboardContainer: (page) => page.locator('main, .dashboard, [role="main"]').first(),
  welcomeMessage: (page) => page.locator('h1, h2, .welcome-message').first(),

  // Budget Tabs Page Locators
  tabStrip: (page) => page.locator('.tab-strip-wrap'),
  tabContainer: (page) => page.locator('.tab-container'),
  tabList: (page) => page.locator('[role="tablist"]'),
  allTabs: (page) => page.locator('[role="tab"]'),
  tab: (page, name) => page.locator(`[role="tab"][name="${name}"]`),
  activeTab: (page) => page.locator('[role="tab"][aria-selected="true"]'),
  scrollLeftButton: (page) => page.locator('button[aria-label="Scroll left"]'),
  scrollRightButton: (page) => page.locator('button[aria-label="Scroll right"]'),
  tabContent: (page) => page.locator('.tab-content'),

  // Budget Header Locators
  pageTitle: (page) => page.locator('.perspective-title'),
  versionButton: (page) => page.locator('button:has-text("Working Budget")'),
  timeSelector: (page) => page.locator('text=Time >> .. >> button, select, input').first(),
  levelSelector: (page) => page.locator('text=Level >> .. >> button, select, input').first(),
  currencySelector: (page) => page.locator('text=Currency >> .. >> button, select, input').first(),

  // Shared Locators
  loadingSpinner: (page) => page.locator('.loading, .spinner, [role="progressbar"]').first(),
  toast: (page) => page.locator('.toast, [role="status"], [role="alert"]').first(),
  modal: (page) => page.locator('[role="dialog"], .modal').first(),
  modalClose: (page) => page.locator('[role="dialog"] button[aria-label="Close"], .modal .close').first()
};

module.exports = locators;