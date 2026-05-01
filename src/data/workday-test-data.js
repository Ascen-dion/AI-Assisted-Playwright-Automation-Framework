module.exports = {
  // URLs
  APPLICATION_URL: process.env.ADAPTIVE_URL || 'https://login.adaptiveplanning.com/app',
  LOGIN_URL: process.env.ADAPTIVE_URL || 'https://login.adaptiveplanning.com/app',
  
  // Credentials
  SALES_BUDGET_OWNER_USERNAME: process.env.ADAPTIVE_USERNAME || '',
  SALES_BUDGET_OWNER_PASSWORD: process.env.ADAPTIVE_PASSWORD || '',
  
  // Expected tab names in order
  EXPECTED_TABS: [
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
  
  // Expected context values
  EXPECTED_DEPARTMENT: 'Sales',
  EXPECTED_TIME_PERIOD: 'Q1',
  EXPECTED_CURRENCY: 'USD',
  EXPECTED_PLAN_VERSION: 'Initial',
  
  // Browser dimensions for testing
  REDUCED_WINDOW_WIDTH: 800,
  REDUCED_WINDOW_HEIGHT: 600,
  STANDARD_WINDOW_WIDTH: 1920,
  STANDARD_WINDOW_HEIGHT: 1080
};