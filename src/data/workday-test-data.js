/**
 * Test Data for Workday Budget Entry - Sales Tests
 */

module.exports = {
  // Application URL
  appUrl: process.env.APP_URL || 'https://workday-adaptive-planning-app.com',

  // User Credentials
  salesBudgetOwner: {
    username: process.env.SALES_BUDGET_OWNER_USERNAME || 'sales.budget.owner@company.com',
    password: process.env.SALES_BUDGET_OWNER_PASSWORD || 'SecurePassword123!'
  },

  // Expected Tab Names
  expectedTabs: [
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

  // Context Data
  context: {
    department: 'Sales',
    timePeriod: 'Q1',
    currency: 'USD',
    planVersion: 'Initial'
  },

  // Browser Window Sizes
  windowSizes: {
    reduced: { width: 800, height: 600 },
    standard: { width: 1280, height: 720 },
    large: { width: 1920, height: 1080 }
  },

  // Timeouts
  timeouts: {
    standard: 15000,
    navigation: 60000,
    dataLoad: 30000
  }
};