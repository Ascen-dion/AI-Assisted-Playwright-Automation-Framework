/**
 * Test Data Module for Adaptive Planning Tests
 * All hardcoded values, URLs, and assertion strings
 * Following framework convention: centralized test data
 */

const testData = {
  urls: {
    login: 'https://login.adaptiveplanning.com/app',
    home: 'https://login.adaptiveplanning.com/app',
    budgetEntrySales: 'https://login.adaptiveplanning.com/app/budget-entry-sales' // Update with actual URL
  },

  credentials: {
    salesBudgetOwner: {
      username: process.env.ADAPTIVE_USERNAME || 'sales.owner@example.com',
      password: process.env.ADAPTIVE_PASSWORD || 'password123'
    }
  },

  tabs: {
    expectedTabsOrder: [
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
    defaultTab: 'Instructions'
  },

  context: {
    department: 'Sales',
    timePeriod: 'Q1',
    currency: 'USD',
    planVersion: 'Initial'
  },

  pageTitles: {
    budgetEntrySales: /Budget Entry.*Sales/i
  },

  messages: {
    loginSuccess: 'Login successful',
    dashboardLoaded: 'Dashboard loaded',
    tabSwitched: 'Tab switched successfully'
  }
};

module.exports = testData;