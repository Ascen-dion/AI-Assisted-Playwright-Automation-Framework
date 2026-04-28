/**
 * Test Data Module for Adaptive Planning Tests
 * Framework Rule: All hardcoded assertion values and URLs must come from test data module
 */

const adaptivePlanningTestData = {
  urls: {
    login: 'https://login.adaptiveplanning.com/app',
    home: 'https://login.adaptiveplanning.com/app',
    budgetEntrySales: 'https://login.adaptiveplanning.com/app/budget-entry-sales'
  },

  urlPatterns: {
    dashboard: /dashboard|home/i,
    budgetEntry: /budget-entry/i
  },

  credentials: {
    salesBudgetOwner: {
      username: process.env.ADAPTIVE_USERNAME || 'sales.budget.owner@test.com',
      password: process.env.ADAPTIVE_PASSWORD || 'TestPassword123!'
    }
  },

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
    defaultTab: 'Instructions',
    totalCount: 12
  },

  context: {
    department: 'Sales',
    timePeriod: 'Q1',
    currency: 'USD',
    planVersion: 'Initial'
  },

  pageTitles: {
    budgetEntrySales: /Budget Entry.*Sales/i,
    dashboard: /Dashboard|Home/i
  },

  content: {
    instructionsContent: 'budget guidelines and due dates',
    targetRevenueFields: 'department\'s revenue figures'
  },

  viewport: {
    fullWidth: 1920,
    fullHeight: 1080,
    reducedWidth: 800,
    reducedHeight: 600
  }
};

module.exports = adaptivePlanningTestData;