const TD = {
  // URLs
  BASE_URL: 'https://login.adaptiveplanning.com/app',
  LOGIN_URL: 'https://login.adaptiveplanning.com/app',
  
  // Credentials
  VALID_USERNAME: process.env.ADAPTIVE_USERNAME || 'valid.user@example.com',
  VALID_PASSWORD: process.env.ADAPTIVE_PASSWORD || 'ValidPassword123',
  SALES_BUDGET_OWNER_USERNAME: process.env.ADAPTIVE_USERNAME || 'sales.budget.owner@example.com',
  SALES_BUDGET_OWNER_PASSWORD: process.env.ADAPTIVE_PASSWORD || 'ValidPassword123',
  
  // Tab Names
  TAB_INSTRUCTIONS: 'Instructions',
  TAB_TARGET_REVENUE: 'Target Revenue',
  TAB_TARGET_EXPENSE: 'Target Expense',
  TAB_WORKFORCE: 'Workforce',
  TAB_PRODUCT_REVENUE: 'Product Revenue',
  TAB_SENSITIVITY_ANALYSIS: 'Sensitivity Analysis',
  TAB_PIPELINE: 'Pipeline',
  TAB_TRAVEL: 'Travel',
  TAB_CAPITAL: 'Capital',
  TAB_EXPENSES: 'Expenses',
  TAB_VARIANCES: 'Variances',
  TAB_REVIEW: 'Review',
  
  // Expected Tab Order
  EXPECTED_TAB_ORDER: [
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
  
  EXPECTED_TAB_COUNT: 12,
  
  // Context Values
  DEPARTMENT_SALES: 'Sales',
  TIME_PERIOD_Q1: 'Q1',
  CURRENCY_USD: 'USD',
  PLAN_VERSION_DRAFT: 'Draft',
  PLAN_VERSION_INITIAL: 'Initial',
  
  // Browser Sizes
  SMALL_WINDOW_WIDTH: 800,
  SMALL_WINDOW_HEIGHT: 600,
  NORMAL_WINDOW_WIDTH: 1920,
  NORMAL_WINDOW_HEIGHT: 1080,
  
  // Expected Content
  INSTRUCTIONS_CONTENT_KEYWORDS: ['budget', 'guidelines', 'due dates'],
  
  // Timeouts
  DEFAULT_TIMEOUT: 30000,
  NAVIGATION_TIMEOUT: 60000
};

module.exports = TD;