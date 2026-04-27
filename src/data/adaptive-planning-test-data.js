/**
 * Adaptive Planning Test Data
 * Contains test data, URLs, and expected values for Adaptive Planning tests
 */

module.exports = {
  // URLs
  LOGIN_URL: 'https://login.adaptiveplanning.com/app',
  
  // Login Credentials (should be loaded from .env in actual tests)
  VALID_USERNAME: process.env.ADAPTIVE_USERNAME || 'test@example.com',
  VALID_PASSWORD: process.env.ADAPTIVE_PASSWORD || 'password',
  
  // Budget Entry - Sales Tab Names (in order)
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
  
  // Tab Types
  BUDGET_INPUT_TABS: ['Target Revenue', 'Target Expense', 'Workforce', 'Product Revenue'],
  PLANNING_VIEW_TABS: ['Sensitivity Analysis', 'Pipeline'],
  COST_PLANNING_TABS: ['Travel', 'Capital', 'Expenses'],
  SUMMARY_VIEW_TABS: ['Variances', 'Review'],
  
  // Context Selection Values
  DEPARTMENT_SALES: 'Sales',
  TIME_PERIOD_Q1: 'Q1',
  CURRENCY_USD: 'USD',
  PLAN_VERSION_DRAFT: 'Draft',
  
  // Expected Messages
  LOGIN_SUCCESS_MESSAGE: 'Successfully logged in',
  PAGE_LOAD_SUCCESS: 'Budget Entry - Sales page loads successfully',
  
  // Timeouts
  DEFAULT_TIMEOUT: 60000,
  SHORT_TIMEOUT: 5000,
  
  // Viewport sizes for responsive testing
  VIEWPORT_DESKTOP: { width: 1920, height: 1080 },
  VIEWPORT_TABLET: { width: 768, height: 1024 },
  VIEWPORT_MOBILE: { width: 375, height: 667 },
  VIEWPORT_SMALL: { width: 600, height: 800 }
};