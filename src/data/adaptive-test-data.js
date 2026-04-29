const TD = {
  urls: {
    login: 'https://login.adaptiveplanning.com/app',
    home: 'https://login.adaptiveplanning.com/app',
    budgetEntrySales: 'https://login.adaptiveplanning.com/app/budget-entry-sales'
  },

  urlPatterns: {
    login: /\/app$/,
    dashboard: /\/app\/(dashboard|home)/,
    budgetEntry: /\/budget-entry/
  },

  credentials: {
    salesBudgetOwner: {
      username: process.env.ADAPTIVE_USERNAME || 'sales.owner@example.com',
      password: process.env.ADAPTIVE_PASSWORD || 'ValidPassword123'
    }
  },

  pageTitles: {
    budgetEntrySales: /Budget Entry.*Sales/i,
    dashboard: /Dashboard|Home/i
  },

  tabs: {
    all: [
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
    defaultActive: 'Instructions'
  },

  context: {
    department: 'Sales',
    timePeriod: 'Q1',
    currency: 'USD',
    planVersion: 'Initial'
  },

  content: {
    instructions: {
      keywords: ['budget', 'guidelines', 'due dates', 'instructions']
    }
  },

  timeouts: {
    pageLoad: 60000,
    elementWait: 15000,
    shortWait: 5000
  }
};

module.exports = TD;