module.exports = {
  // URLs
  urls: {
    login: 'https://login.adaptiveplanning.com/app',
    homePage: 'https://login.adaptiveplanning.com/app',
    budgetEntrySales: 'https://login.adaptiveplanning.com/app/budget-entry/sales'
  },
  
  // URL Patterns for assertions
  urlPatterns: {
    login: /\/app$/,
    homePage: /\/app(?:\/dashboard)?$/,
    budgetEntrySalesPage: /\/app\/budget-entry\/sales/
  },
  
  // Budget context
  budgetContext: {
    sales: {
      department: 'Sales',
      timePeriod: 'Q1 2024',
      currency: 'USD',
      planVersion: 'V1'
    },
    salesQ2: {
      department: 'Sales',
      timePeriod: 'Q2 2024',
      currency: 'EUR',
      planVersion: 'V2'
    }
  },
  
  // Tab names
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
  
  // Expected tab order
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
  
  // Page titles
  pageTitles: {
    budgetEntrySales: /Budget Entry.*Sales/i,
    login: /Login|Sign In/i
  },
  
  // Statuses
  statuses: {
    draft: 'Draft',
    submitted: 'Submitted',
    approved: 'Approved',
    rejected: 'Rejected',
    locked: 'Locked',
    working: 'Working',
    inReview: 'In Review'
  },
  
  // Error messages
  errors: {
    invalidCredentials: 'Invalid username or password',
    requiredField: 'This field is required',
    invalidData: 'Invalid data format'
  }
};