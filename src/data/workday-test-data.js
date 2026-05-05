/**
 * Workday Adaptive Planning Test Data
 * Contains URLs, credentials, and assertion values
 */

module.exports = {
  // URLs
  urls: {
    login: process.env.WORKDAY_LOGIN_URL || 'https://workday-adaptive-planning.example.com/login',
    dashboard: process.env.WORKDAY_DASHBOARD_URL || 'https://workday-adaptive-planning.example.com/dashboard'
  },

  // Credentials (should be loaded from environment variables in production)
  credentials: {
    validUser: {
      username: process.env.WORKDAY_USERNAME || 'test.user@example.com',
      password: process.env.WORKDAY_PASSWORD || 'SecurePassword123!'
    },
    invalidUser: {
      username: 'invalid@example.com',
      password: 'WrongPassword'
    }
  },

  // Expected values
  expectedValues: {
    loginErrorMessage: 'Invalid username or password',
    dashboardWelcome: 'Welcome',
    budgetVersionText: 'Working Budget'
  },

  // Timeouts
  timeouts: {
    elementWait: 15000,
    navigationWait: 60000,
    gridRender: 30000
  },

  // Tab names
  tabs: {
    overview: 'Overview',
    budget: 'Budget',
    forecast: 'Forecast',
    reports: 'Reports'
  },

  // Menu items
  menuItems: {
    planning: 'Planning',
    reporting: 'Reporting',
    modeling: 'Modeling',
    administration: 'Administration'
  }
};