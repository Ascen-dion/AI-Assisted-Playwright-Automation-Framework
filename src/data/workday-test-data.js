/**
 * Test Data for Workday Adaptive Planning Tests
 * @module workday-test-data
 */

const testData = {
  // Login credentials
  credentials: {
    salesBudgetOwner: {
      username: process.env.ADAPTIVE_USERNAME || 'sales.budget.owner@example.com',
      password: process.env.ADAPTIVE_PASSWORD || 'SecurePassword123!'
    }
  },

  // URLs
  urls: {
    loginUrl: 'https://login.adaptiveplanning.com/app',
    dashboardUrl: 'https://login.adaptiveplanning.com/app'
  },

  // Budget Entry - Sales Tab Names
  tabNames: {
    instructions: 'Instructions',
    targetRevenue: 'Target Revenue',
    targetExpense: 'Target Expense',
    workforce: 'Workforce',
    productRevenue: 'Product Revenue',
    sensitivityAnalysis: 'Sensitivity Analysis',
    pipeline: 'Pipeline',
    travel: 'Travel',
    capital: 'Capital',
    expenses: 'Expenses',
    variances: 'Variances',
    review: 'Review'
  },

  // Expected tab order
  expectedTabOrder: [
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

  // Budget context
  budgetContext: {
    department: 'Sales',
    timePeriod: 'Q1',
    currency: 'USD',
    planVersion: 'Initial'
  },

  // Page titles
  pageTitles: {
    budgetEntrySales: 'Budget Entry - Sales'
  },

  // Timeouts
  timeouts: {
    standard: 15000,
    navigation: 60000,
    gridLoad: 30000
  }
};

module.exports = testData;