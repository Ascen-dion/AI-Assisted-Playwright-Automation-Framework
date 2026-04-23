// === FILE: src/data/adaptive-planning-test-data.js ===
/**
 * Centralised test data for Workday Adaptive Planning automation suite.
 *
 * Single source of truth for all assertion strings, URLs, and expected values.
 * When the application changes a label or value, update here — not in each spec.
 *
 * Set ADAPTIVE_BASE_URL in .env — e.g. https://login.adaptiveplanning.com/app
 */

const BASE = process.env.ADAPTIVE_BASE_URL || 'https://login.adaptiveplanning.com/app';

module.exports = {

  // ── URLs ─────────────────────────────────────────────────────────────────
  urls: {
    login:            BASE,
    base:             BASE,
    budgetEntrySales: 'https://livec50a01.adaptiveplanning.com/dashboards/perspective/13697/dashboard/13719',
  },

  // ── URL patterns (regex for toHaveURL assertions) ─────────────────────────
  urlPatterns: {
    login:            /login\.adaptiveplanning\.com\/app/,
    dashboard:        /adaptiveplanning\.com/,
    budgetEntrySales: /adaptiveplanning\.com\/dashboards\/perspective/,
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
