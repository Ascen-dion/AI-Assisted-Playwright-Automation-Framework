/**
 * Test Data for Adaptive Planning Budget Entry - Sales Tests
 * Centralized test data following framework pattern
 */

module.exports = {
  // Application URLs
  urls: {
    login: 'https://login.adaptiveplanning.com/app',
    home: 'https://login.adaptiveplanning.com/app'
  },

  // User Credentials (should be loaded from environment variables in actual implementation)
  users: {
    salesBudgetOwner: {
      username: process.env.ADAPTIVE_USERNAME || 'sales.budget.owner@example.com',
      password: process.env.ADAPTIVE_PASSWORD || 'SecurePassword123!'
    }
  },

  // Expected Tab Names and Order
  tabs: {
    expectedOrder: [
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

  // Context Values
  context: {
    department: 'Sales',
    timePeriod: 'Q1',
    currency: 'USD',
    planVersion: 'Initial'
  },

  // Browser Window Sizes
  windowSizes: {
    restricted: {
      width: 800,
      height: 600
    },
    standard: {
      width: 1366,
      height: 768
    },
    large: {
      width: 1920,
      height: 1080
    }
  },

  // Expected Content Strings
  expectedContent: {
    instructionsTitle: 'Instructions',
    budgetGuidelinesText: 'budget guidelines',
    dueDatesText: 'due dates'
  },

  // Timeouts
  timeouts: {
    elementWait: 15000,
    pageLoad: 60000,
    shortWait: 1000
  }
};