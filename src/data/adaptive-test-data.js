const testData = {
  urls: {
    login: 'https://adaptive-planning-app.com/login',
    dashboard: 'https://adaptive-planning-app.com/dashboard',
    budgetEntrySales: 'https://adaptive-planning-app.com/budget-entry-sales'
  },

  urlPatterns: {
    dashboard: /dashboard|home/i,
    budgetEntrySales: /budget.*entry.*sales/i
  },

  credentials: {
    salesBudgetOwner: {
      username: 'sales.budget.owner@company.com',
      password: 'SecurePassword123!'
    }
  },

  tabs: {
    allTabs: [
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
    budgetEntrySales: /Budget Entry.*Sales/i,
    dashboard: /Dashboard|Home/i
  },

  content: {
    instructionsKeywords: ['budget', 'guidelines', 'due dates']
  }
};

module.exports = testData;