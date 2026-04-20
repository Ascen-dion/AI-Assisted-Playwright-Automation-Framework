// === FILE: src/data/test-data.js ===
/**
 * Centralised test data for OCBC Bank automation suite.
 *
 * Single source of truth for all assertion strings, URLs, and expected values.
 * When the application changes a label or copy, update here — not in each spec.
 */

module.exports = {

  // ── URLs ────────────────────────────────────────────────────────────────
  urls: {
    gateway:          'https://www.ocbc.com/group/gateway',
    personalBanking:  'https://www.ocbc.com/personal-banking',
    businessBanking:  'https://www.ocbc.com/business-banking',
    premierBanking:   'https://www.ocbc.com/premier-banking',
    savingsAccounts:  'https://www.ocbc.com/personal-banking/deposits/savings-accounts',
    currentAccounts:  'https://www.ocbc.com/personal-banking/deposits/current-accounts',
    fixedDeposits:    'https://www.ocbc.com/personal-banking/deposits/fixed-deposits',
    account360:       'https://www.ocbc.com/personal-banking/deposits/360-savings-account',
    creditCards:      'https://www.ocbc.com/personal-banking/cards/credit-cards',
    debitCards:       'https://www.ocbc.com/personal-banking/cards/debit-cards',
    card365:          'https://www.ocbc.com/personal-banking/cards/credit-cards/365-credit-card',
    titaniumRewards:  'https://www.ocbc.com/personal-banking/cards/credit-cards/titanium-rewards',
    card90N:          'https://www.ocbc.com/personal-banking/cards/credit-cards/90n-card',
    homeLoans:        'https://www.ocbc.com/personal-banking/loans/home-loans',
    renovationLoans:  'https://www.ocbc.com/personal-banking/loans/renovation-loans',
    carLoans:         'https://www.ocbc.com/personal-banking/loans/car-loans',
    personalLoans:    'https://www.ocbc.com/personal-banking/loans/personal-loans',
    unitTrusts:       'https://www.ocbc.com/personal-banking/investments/unit-trusts',
    roboInvest:       'https://www.ocbc.com/personal-banking/investments/roboinvest',
    lifeInsurance:    'https://www.ocbc.com/personal-banking/insurance/life-insurance',
    healthInsurance:  'https://www.ocbc.com/personal-banking/insurance/health-insurance',
    travelInsurance:  'https://www.ocbc.com/personal-banking/insurance/travel-insurance',
    digitalApp:       'https://www.ocbc.com/personal-banking/digital-banking/ocbc-digital',
    internetBanking:  'https://www.ocbc.com/personal-banking/digital-banking/internet-banking',
    payAnyone:        'https://www.ocbc.com/personal-banking/digital-banking/payanyone',
    rates:            'https://www.ocbc.com/personal-banking/rates',
    promotions:       'https://www.ocbc.com/personal-banking/promotions',
  },

  // ── URL patterns (regex for toHaveURL assertions) ────────────────────────
  urlPatterns: {
    personalBanking:  /ocbc\.com\/personal-banking/,
    savingsAccounts:  /deposits\/savings-accounts/,
    fixedDeposits:    /deposits\/fixed-deposits/,
    account360:       /deposits\/360-savings-account/,
    creditCards:      /cards\/credit-cards/,
    card365:          /365-credit-card/,
    homeLoans:        /loans\/home-loans/,
    investments:      /investments/,
    roboInvest:       /investments\/roboinvest/,
    insurance:        /insurance/,
    digitalBanking:   /digital-banking/,
  },

  // ── Account products ─────────────────────────────────────────────────────
  accounts: {
    savings360Name:      '360 Account',
    statementSavings:    'Statement Savings Account',
    fixedDepositName:    'Fixed Deposit',
  },

  // ── Card products ────────────────────────────────────────────────────────
  cards: {
    card365Name:         '365 Credit Card',
    titaniumRewardsName: 'Titanium Rewards Card',
    card90NName:         '90°N Card',
    frankDebitName:      'FRANK Debit Card',
  },

  // ── Loan products ────────────────────────────────────────────────────────
  loans: {
    homeLoanName:        'Home Loan',
    renovationLoanName:  'Renovation Loan',
    carLoanName:         'Car Loan',
    personalLoanName:    'EasiCredit',
  },

  // ── Page titles ───────────────────────────────────────────────────────
  pageTitles: {
    gateway:          /OCBC|Gateway/i,
    personalBanking:  /Personal Banking|OCBC/i,
    savingsAccounts:  /Savings Account/i,
    creditCards:      /Credit Card/i,
    homeLoans:        /Home Loan/i,
    investments:      /Investment/i,
    insurance:        /Insurance/i,
    digitalBanking:   /Digital Banking|OCBC Digital/i,
  },

};
