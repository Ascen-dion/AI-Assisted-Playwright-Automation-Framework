// === FILE: src/data/adaptive-planning-test-data.js ===
/**
 * Centralised test data for Workday Adaptive Planning automation suite.
 *
 * Single source of truth for all assertion strings, URLs, and expected values.
 * When the application changes a label or value, update here — not in each spec.
 *
 * Set BASE_URL in .env — e.g. https://www.starhub.com/personal.html
 */

const BASE = process.env.BASE_URL || 'https://www.starhub.com/personal.html';

module.exports = {

  // ── URLs ─────────────────────────────────────────────────────────────────
  urls: {
    home:             BASE,
    base:             BASE,
  },

  // ── URL patterns (regex for toHaveURL assertions) ─────────────────────────
  urlPatterns: {
    home:             /starhub\.com\/personal/,
    dashboard:        /starhub\.com/,
  },

  // ── Credentials (read from env — never hardcode) ──────────────────────────
  credentials: {
    username: process.env.ADAPTIVE_USERNAME || '',
    password: process.env.ADAPTIVE_PASSWORD || '',
  },

  // ── Page Titles ───────────────────────────────────────────────────────────
  pageTitles: {
    login:     /Adaptive Planning|Workday/i,
    dashboard: /Adaptive Planning|Dashboard|Home/i,
  },

  // ── Login Page Expected Text ──────────────────────────────────────────────
  loginPage: {
    heading:           'Login',
    usernameLabel:     'Username or Email',
    passwordLabel:     'Password',
    signInButtonText:  'Sign In',
    forgotPasswordText: 'Forgot Password',
    rememberMeText:    'Remember Username',
    copyrightText:     'Workday, Inc. All rights reserved.',
  },

  // ── Budget Entry — Sales ──────────────────────────────────────────────────
  budgetEntry: {
    pageTitle:       'Budget Entry - Sales',
    versionName:     'Working Budget',
    defaultTab:      'Instructions',
    tabCount:        12,
    tabLabels: [
      'Instructions',
      'Target Revenue',
      'Target Expense',
      'Workforce',
      'Product Revenue',
      'Sensitivity Analysis',
      'Pipeline',
      'Travel',
      'Capital',
      'Expenses',
      'Variances',
      'Review',
    ],
    budgetInputTabs: ['Target Revenue', 'Target Expense', 'Workforce', 'Product Revenue'],
    planningViewTabs: ['Sensitivity Analysis', 'Pipeline'],
    costPlanningTabs: ['Travel', 'Capital', 'Expenses'],
    summaryTabs:      ['Variances', 'Review'],
    scrollLeftLabel:  'Scroll left',
    scrollRightLabel: 'Scroll right',
  },

  // ── Error Messages ────────────────────────────────────────────────────────
  errors: {
    invalidCredentials: /invalid|incorrect|authentication failed/i,
    sessionExpired:     /session.*expired|timed out/i,
    requiredField:      /required/i,
  },

  // ── Planning Dimensions (typical Adaptive Planning setup) ─────────────────
  dimensions: {
    accounts:    ['Revenue', 'COGS', 'SGA', 'EBITDA'],
    departments: ['Sales', 'Marketing', 'Engineering', 'Finance'],
    versions:    ['Budget 2026', 'Forecast Q2', 'Actuals'],
  },

  // ── Statuses ──────────────────────────────────────────────────────────────
  statuses: {
    working:   'Working',
    submitted: 'Submitted',
    approved:  'Approved',
    locked:    'Locked',
    rejected:  'Rejected',
  },
};
