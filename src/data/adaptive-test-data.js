/**
 * Test Data Module for Adaptive Planning Tests
 * All hardcoded assertion values and URLs must come from this module
 */

const TD = {
  // URLs
  urls: {
    baseUrl: process.env.ADAPTIVE_BASE_URL || 'https://adaptive-planning-app.com',
    loginPage: '/login',
    dashboard: '/dashboard',
    budgetEntrySales: '/budget-entry-sales'
  },

  // User credentials
  users: {
    salesBudgetOwner: {
      username: process.env.SALES_BUDGET_OWNER_USERNAME || 'sales.budget.owner@company.com',
      password: process.env.SALES_BUDGET_OWNER_PASSWORD || 'SecurePassword123!',
      role: 'Sales Budget Owner'
    }
  },

  // Tab names in expected order
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
    count: 12
  },

  // Context settings
  context: {
    department: 'Sales',
    timePeriod: 'Q1',
    currency: 'USD',
    planVersion: 'Initial'
  },

  // Page titles
  pageTitles: {
    budgetEntrySales: /Budget Entry.*Sales/i,
    dashboard: /Dashboard|Home/i
  },

  // Expected content
  content: {
    instructionsSection: {
      contains: ['budget guidelines', 'due dates']
    }
  },

  // Timeouts
  timeouts: {
    pageLoad: 60000,
    elementVisible: 10000,
    networkIdle: 5000
  }
};

module.exports = TD;