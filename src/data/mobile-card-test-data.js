const testData = {
  urls: {
    mobileApp: process.env.MOBILE_APP_URL || 'https://mobile.app.example.com',
    login: process.env.LOGIN_URL || 'https://mobile.app.example.com/login'
  },

  credentials: {
    validUser: {
      username: 'testuser@example.com',
      password: 'Test@123'
    }
  },

  cardData: {
    lockedCardId: 'Valid card locked via Admin Portal',
    testMerchant: 'Test Merchant',
    testAmount: '$50.00'
  },

  expectedMessages: {
    unlockPrompt: 'Please file an in-app ticket to unlock your card',
    transactionDeclined: 'card is locked',
    cardLockedStatus: 'Locked'
  },

  statuses: {
    locked: 'Locked',
    unlocked: 'Active',
    suspended: 'Suspended'
  },

  pageTitles: {
    cardManagement: /Card Management/i,
    cardDetails: /Card Details/i,
    home: /Home|Dashboard/i
  },

  urlPatterns: {
    cardManagement: /\/card-management/i,
    cardDetails: /\/card-details/i,
    home: /\/home|dashboard/i
  },

  testScenarios: {
    'TS-001': 'View locked card status in mobile app',
    'TS-002': 'Unlock card prompt displays advisory message',
    'TS-003': 'Purchase transaction blocked for locked card',
    'TS-004': 'Card management buttons disabled for locked card',
    'TS-005': 'Unlock Card button remains enabled',
    'TS-006': 'Prompt closes without changing card status'
  },

  acceptanceCriteria: {
    'AC-001': 'Locked card functionality restrictions'
  }
};

module.exports = testData;