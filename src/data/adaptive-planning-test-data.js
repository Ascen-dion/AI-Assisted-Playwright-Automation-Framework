// Test Data Module for Adaptive Planning Budget Entry Tests

module.exports = {
  // URLs
  urls: {
    loginPage: process.env.ADAPTIVE_PLANNING_URL || 'https://adaptive-planning-url.com',
    budgetEntrySales: process.env.BUDGET_ENTRY_SALES_URL || 'https://adaptive-planning-url.com/budget-entry-sales'
  },

  // User Credentials
  credentials: {
    validUser: {
      username: process.env.VALID_USERNAME || 'valid.user@example.com',
      password: process.env.VALID_PASSWORD || 'ValidPassword123'
    }
  },

  // Department Context
  departments: {
    sales: 'Sales'
  },

  // Time Periods
  timePeriods: {
    q1_2024: 'Q1 2024',
    q2_2024: 'Q2 2024'
  },

  // Currencies
  currencies: {
    usd: 'USD',
    eur: 'EUR'
  },

  // Plan Versions
  planVersions: {
    v1: 'V1',
    v2: 'V2'
  },

  // Tab Names
  tabs: {
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

  // Expected Tab Order
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

  // Browser Dimensions
  browserDimensions: {
    reduced: { width: 800, height: 600 },
    standard: { width: 1920, height: 1080 }
  },

  // Expected Content
  expectedContent: {
    instructionsGuidelines: 'budget guidelines',
    instructionsDueDates: 'due dates'
  }
};