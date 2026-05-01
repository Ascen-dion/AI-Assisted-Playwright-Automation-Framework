/**
 * Test Data Module for Workday Adaptive Planning
 * @module workday-test-data
 */

const testData = {
  // URLs
  urls: {
    login: 'https://login.adaptiveplanning.com/app',
    home: 'https://login.adaptiveplanning.com/app',
    dashboard: 'https://login.adaptiveplanning.com/app'
  },

  // URL Patterns for assertions
  urlPatterns: {
    login: /.*login\.adaptiveplanning\.com\/app.*/,
    dashboard: /.*adaptiveplanning\.com\/app.*/,
    sheets: /.*sheets.*/,
    reports: /.*reports.*/,
    modeling: /.*modeling.*/
  },

  // Page Titles
  pageTitles: {
    login: /.*Adaptive Planning.*/i,
    dashboard: /.*Dashboard.*|.*Home.*/i,
    sheets: /.*Sheets.*|.*Planning.*/i
  },

  // User Credentials (from environment variables)
  credentials: {
    username: process.env.ADAPTIVE_USERNAME || '',
    password: process.env.ADAPTIVE_PASSWORD || ''
  },

  // Navigation Menu Items
  navigation: {
    sheets: 'Sheets',
    reports: 'Reports',
    modeling: 'Modeling',
    process: 'Process',
    integration: 'Integration',
    administration: 'Administration'
  },

  // Budget Tabs
  budgetTabs: {
    revenue: 'Revenue',
    expenses: 'Expenses',
    personnel: 'Personnel',
    capitalExpenditure: 'Capital Expenditure',
    balanceSheet: 'Balance Sheet'
  },

  // Version States
  versionStates: {
    working: 'Working',
    submitted: 'Submitted',
    approved: 'Approved',
    locked: 'Locked'
  },

  // Status Messages
  statuses: {
    draft: 'Draft',
    submitted: 'Submitted',
    inReview: 'In Review',
    approved: 'Approved',
    rejected: 'Rejected'
  },

  // Error Messages
  errors: {
    invalidCredentials: 'Invalid username or password',
    requiredField: 'This field is required',
    sessionExpired: 'Your session has expired',
    accessDenied: 'Access denied',
    validationError: 'Validation error'
  },

  // Success Messages
  success: {
    loginSuccess: 'Login successful',
    dataSaved: 'Data saved successfully',
    reportGenerated: 'Report generated successfully'
  },

  // Time Periods
  timePeriods: {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly'
  },

  // Currencies
  currencies: {
    usd: 'USD',
    eur: 'EUR',
    gbp: 'GBP'
  },

  // Levels
  levels: {
    summary: 'Summary',
    detail: 'Detail',
    department: 'Department'
  }
};

module.exports = testData;