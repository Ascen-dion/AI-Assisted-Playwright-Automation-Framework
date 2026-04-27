module.exports = {
  // Login Credentials
  validUsername: process.env.ADAPTIVE_USERNAME || 'valid_user',
  validPassword: process.env.ADAPTIVE_PASSWORD || 'valid_password',
  
  // Application URLs
  applicationUrl: 'https://login.adaptiveplanning.com/app',
  
  // Department Context
  department: {
    sales: 'Sales'
  },
  
  // Time Period Context
  timePeriod: {
    q1_2024: 'Q1 2024',
    q2_2024: 'Q2 2024'
  },
  
  // Currency Context
  currency: {
    usd: 'USD',
    eur: 'EUR'
  },
  
  // Plan Version Context
  planVersion: {
    v1: 'V1',
    v2: 'V2'
  },
  
  // Tab Names (for verification)
  tabNames: [
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
  
  // Expected Tab Count
  expectedTabCount: 12,
  
  // Browser Dimensions for Scroll Test
  reducedBrowserWidth: 800,
  reducedBrowserHeight: 600,
  
  // Default Context
  defaultContext: {
    department: 'Sales',
    timePeriod: 'Q1 2024',
    currency: 'USD',
    planVersion: 'V1'
  },
  
  // Test Context for Context Retention Test
  testContext: {
    department: 'Sales',
    timePeriod: 'Q2 2024',
    currency: 'EUR',
    planVersion: 'V2'
  }
};