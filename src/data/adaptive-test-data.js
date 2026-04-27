const testData = {
  urls: {
    login: 'https://login.adaptiveplanning.com/app',
    home: 'https://login.adaptiveplanning.com/app',
    budgetEntrySales: '/budget-entry-sales'
  },
  
  urlPatterns: {
    dashboard: /dashboard|home/i,
    budgetEntry: /budget-entry/i
  },
  
  credentials: {
    salesBudgetOwner: {
      username: process.env.ADAPTIVE_USERNAME || 'sales.budget.owner@example.com',
      password: process.env.ADAPTIVE_PASSWORD || 'password123'
    }
  },
  
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
  
  tabOrder: [
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
  
  departments: {
    sales: 'Sales',
    marketing: 'Marketing'
  },
  
  timePeriods: {
    q1: 'Q1',
    q2: 'Q2'
  },
  
  currencies: {
    usd: 'USD'
  },
  
  planVersions: {
    draft: 'Draft',
    workingBudget: 'Working Budget'
  },
  
  pageTitles: {
    budgetEntrySales: /Budget Entry.*Sales/i
  }
};

module.exports = testData;