/**
 * Test Data Module for Mobile Card Management Tests
 * Contains all test data, URLs, credentials, and expected values
 */

const testData = {
  // Application URLs
  urls: {
    mobileAppUrl: process.env.MOBILE_APP_URL || 'https://mobile.example.com/app',
    mobileAppPackage: process.env.MOBILE_APP_PACKAGE || 'com.example.mobileapp'
  },

  // User Credentials
  credentials: {
    validUser: {
      username: 'testuser@example.com',
      password: 'Test@123'
    },
    invalidUser: {
      username: 'invalid@example.com',
      password: 'Wrong@123'
    }
  },

  // Card Test Data
  cards: {
    lockedCard: {
      cardId: 'CARD-LOCKED-001',
      status: 'Locked',
      cardNumber: '**** **** **** 1234',
      cardType: 'Debit Card'
    },
    activeCard: {
      cardId: 'CARD-ACTIVE-001',
      status: 'Active',
      cardNumber: '**** **** **** 5678',
      cardType: 'Credit Card'
    }
  },

  // Transaction Test Data
  transactions: {
    purchaseAttempt: {
      merchant: 'Test Merchant',
      amount: '$50.00',
      currency: 'USD'
    }
  },

  // Expected Messages
  messages: {
    unlockPrompt: 'Please file an in-app ticket to unlock your card',
    transactionDeclined: 'Transaction declined',
    cardLocked: 'Card is locked',
    transactionBlocked: 'Purchase transaction is declined/blocked',
    cardLockedError: 'card is locked'
  },

  // Expected Status Values
  statuses: {
    locked: 'Locked',
    active: 'Active',
    suspended: 'Suspended',
    closed: 'Closed'
  },

  // Screen Titles
  screenTitles: {
    login: 'Login',
    home: 'Home',
    cardManagement: 'Card Management',
    cardDetails: 'Card Details'
  },

  // Button Labels
  buttons: {
    login: 'Login',
    signIn: 'Sign In',
    unlockCard: 'Unlock Card',
    transactionLimits: 'Transaction Limits',
    ok: 'OK',
    cancel: 'Cancel',
    close: 'Close'
  },

  // Timeouts
  timeouts: {
    pageLoad: 60000,
    elementWait: 15000,
    shortWait: 5000,
    transactionProcessing: 10000
  },

  // Test Case IDs
  testCaseIds: {
    ts001_tc001: 'QE-851 TS-001 TC-001',
    ts002_tc001: 'QE-851 TS-002 TC-001',
    ts002_tc002: 'QE-851 TS-002 TC-002',
    ts003_tc001: 'QE-851 TS-003 TC-001',
    ts004_tc001: 'QE-851 TS-004 TC-001'
  },

  // Acceptance Criteria
  acceptanceCriteria: {
    ac001: 'AC-001'
  }
};

module.exports = testData;