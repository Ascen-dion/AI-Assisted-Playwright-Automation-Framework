// === FILE: src/data/test-data.js ===
/**
 * Centralised test data for UnionDigital Bank automation suite.
 *
 * Single source of truth for all assertion strings, URLs, and expected values.
 * When the application changes a label or copy, update here — not in each spec.
 */

module.exports = {

  // ── URLs ────────────────────────────────────────────────────────────────
  urls: {
    homepage:             'https://uniondigitalbank.io/en',
    productsSavings:      'https://uniondigitalbank.io/en/products-savings',
    productsTimeDeposit:  'https://uniondigitalbank.io/en/products-time-deposit',
    productsLoanProtect:  'https://uniondigitalbank.io/en/products-ud-loan-protect-insurance',
    productsInAppTicket:  'https://uniondigitalbank.io/en/products-inapp-ticket',
    productRatesFees:     'https://uniondigitalbank.io/en/product-rates-fees',
    guidesUdCashLoans:    'https://uniondigitalbank.io/en/guides-ud-cash-loans',
    guidesUdLoans:        'https://uniondigitalbank.io/en/guides-ud-loans',
    promoQrphCashback:    'https://uniondigitalbank.io/en/promo-qrph-cashback',
    promoInstapay:        'https://uniondigitalbank.io/en/uniondigital-free-instapay-promo',
    aboutUs:              'https://uniondigitalbank.io/en/about-us',
    learn:                'https://uniondigitalbank.io/en/learn',
    helpCenter:           'https://uniondigitalbank.io/en/faqs',
    termsConditions:      'https://uniondigitalbank.io/terms-and-conditions',
    privacyStatement:     'https://uniondigitalbank.io/privacy-statement',
    privacyPolicy:        'https://uniondigitalbank.io/privacy-policy',
    disclosures:          'https://uniondigitalbank.io/disclosures',
  },

  // ── URL patterns (regex for toHaveURL assertions) ────────────────────────
  urlPatterns: {
    homepage:             /uniondigitalbank\.io\/en/,
    productsSavings:      /products-savings/,
    productsTimeDeposit:  /products-time-deposit/,
    productsLoanProtect:  /products-ud-loan-protect-insurance/,
    productRatesFees:     /product-rates-fees/,
    guidesUdCashLoans:    /guides-ud-cash-loans/,
    guidesUdLoans:        /guides-ud-loans/,
    aboutUs:              /about-us/,
    helpCenter:           /faqs/,
    promos:               /promo-/,
  },

  // ── Product names ─────────────────────────────────────────────────────────
  products: {
    udSaveName:           'UD Save',
    udTimeDepositName:    'UD Time Deposit',
    udLoanProtectName:    'UD Loan Protect Insurance',
  },

  // ── Homepage section headings ─────────────────────────────────────────────
  homepage: {
    heroBannerText:       'Empowering Every Filipino,',
    awardsHeading:        'Magtiwala sa Pinalaki nang Tama!',
    productsHeading:      'High Earnings sa Aming High-Interest Accounts',
    downloadHeading:      'Mag-bank na with',
    trustBadge1:          'A Wholly-Owned Subsidiary of UnionBank',
    trustBadge2:          'BSP Regulated and PDIC Insured',
  },

  // ── UD Save page content ──────────────────────────────────────────────────
  savePage: {
    heroHeading:          'UD Save Account',
    subHeading:           "Your all-in-one account para sa 'yong savings and payment",
    feature1:             'Mag-ipon lang sa account mo and enjoy high interest rates',
    feature2:             'Goodbye na sa mahabang pila! Pay your bills quickly and conveniently from your phone',
  },

  // ── Page titles ───────────────────────────────────────────────────────────
  pageTitles: {
    homepage:             /UnionDigital Bank/,
    productsSavings:      /UnionDigital Bank \| Savings/,
    productsTimeDeposit:  /Time Deposit \| UnionDigital Bank/,
  },

};
