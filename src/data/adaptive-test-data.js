/**
 * Test Data for Adaptive Planning Tests
 * @module data/adaptive-test-data
 */

const adaptiveTestData = {
  // URLs
  LOGIN_URL: 'https://login.adaptiveplanning.com/app',
  BASE_URL: 'https://login.adaptiveplanning.com/app',

  // User Credentials
  SALES_BUDGET_OWNER: {
    username: process.env.ADAPTIVE_USERNAME || 'sales.budget.owner@example.com',
    password: process.env.ADAPTIVE_PASSWORD || 'TestPassword123!'
  },

  // Page Titles
  BUDGET_ENTRY_SALES_TITLE: 'Budget Entry - Sales',

  // Tab Names (in order)
  TAB_NAMES: [
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
    'Review'
  ],

  // Context Values
  DEPARTMENT: 'Sales',
  TIME_PERIOD: 'Q1',
  CURRENCY: 'USD',
  PLAN_VERSION: 'Initial',

  // Expected Content
  INSTRUCTIONS_CONTENT_KEYWORDS: ['budget', 'guidelines', 'due dates'],

  // Viewport sizes for responsive testing
  VIEWPORT_SIZES: {
    DESKTOP: { width: 1920, height: 1080 },
    TABLET: { width: 768, height: 1024 },
    MOBILE: { width: 375, height: 667 },
    NARROW: { width: 800, height: 600 } // For tab scroll testing
  }
};

module.exports = adaptiveTestData;