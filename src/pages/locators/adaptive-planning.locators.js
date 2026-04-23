// === FILE: src/pages/locators/adaptive-planning.locators.js ===
/**
 * Locators for Workday Adaptive Planning.
 *
 * Selector priority: id/name > ARIA role > visible text > stable CSS.
 * Confirmed via live DOM inspection on 2026-04-22.
 */

const loc = {
  // ── Login Page (confirmed selectors) ───────────────────────────────────
  login: {
    usernameField:      (page) => page.locator('#inputEmail'),
    passwordField:      (page) => page.locator('#inputPassword'),
    signInButton:       (page) => page.locator('#submit'),
    rememberCheckbox:   (page) => page.locator('#rememberUsername'),
    forgotPasswordLink: (page) => page.getByText('Forgot Password'),
    errorMessage:       (page) => page.locator('.error-message, .login-error, [role="alert"]').first(),
  },

  // ── Navigation / Sidebar ──────────────────────────────────────────────
  nav: {
    sidebar:        (page) => page.locator('nav').first(),
    menuItem:       (page, text) => page.getByRole('link', { name: text }),
    activeMenuItem: (page) => page.locator('.active, [aria-current="page"]').first(),
    backButton:     (page) => page.locator('button:has-text("Back"), [aria-label="Back"], .back-button').first(),
  },

  // ── Budget Entry Page — Tab Bar (confirmed via DOM) ───────────────────
  budgetTabs: {
    tabStrip:       (page) => page.locator('.tab-strip-wrap'),
    tabContainer:   (page) => page.locator('.tab-container'),
    tabList:        (page) => page.locator('[role="tablist"]'),
    allTabs:        (page) => page.locator('[role="tab"]'),
    tab:            (page, name) => page.getByRole('tab', { name, exact: true }),
    activeTab:      (page) => page.locator('[role="tab"][aria-selected="true"]'),
    scrollLeft:     (page) => page.locator('button[aria-label="Scroll left"]'),
    scrollRight:    (page) => page.locator('button[aria-label="Scroll right"]'),
    tabContent:     (page) => page.locator('.tab-content'),
  },

  // ── Budget Entry Page — Header / Context Selectors ────────────────────
  budgetHeader: {
    pageTitle:      (page) => page.locator('.perspective-title'),
    versionButton:  (page) => page.locator('button:has-text("Working Budget")'),
    timeSelector:   (page) => page.locator('text=Time').locator('..').locator('button, select, input').first(),
    levelSelector:  (page) => page.locator('text=Level').locator('..').locator('button, select, input').first(),
    currencySelector: (page) => page.locator('text=Currency').locator('..').locator('button, select, input').first(),
  },

  // ── Dashboard ─────────────────────────────────────────────────────────
  dashboard: {
    container:  (page) => page.locator('main, .dashboard, [role="main"]').first(),
    welcomeMsg: (page) => page.locator('h1, h2, .welcome-message').first(),
  },

  // ── Shared / Common ──────────────────────────────────────────────────
  shared: {
    loadingSpinner: (page) => page.locator('.loading, .spinner, [role="progressbar"]').first(),
    toast:          (page) => page.locator('.toast, [role="status"], [role="alert"]').first(),
    modal:          (page) => page.locator('[role="dialog"], .modal').first(),
    modalClose:     (page) => page.locator('[role="dialog"] button[aria-label="Close"], .modal .close').first(),
  },
};

module.exports = loc;
