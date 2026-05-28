// === FILE: src/shared/data/experian-test-data.js ===
/**
 * Centralised test data for Experian automation suite.
 *
 * Single source of truth for all assertion strings, URLs, and expected values.
 * When the application changes a label or copy, update here — not in each spec.
 */

module.exports = {

  // ── URLs ────────────────────────────────────────────────────────────────
  urls: {
    homepage:               'https://www.experian.com/',
    credit:                 'https://www.experian.com/credit/',
    creditScore:            'https://www.experian.com/credit/credit-score/',
    creditMonitoring:       'https://www.experian.com/credit/credit-monitoring/',
    creditBoost:            'https://www.experian.com/credit/score-boost/',
    protection:             'https://www.experian.com/protection/',
    creditLock:             'https://www.experian.com/protection/creditlock/',
    identityTheft:          'https://www.experian.com/protection/identity-theft/',
    loans:                  'https://www.experian.com/loans/',
    personalLoans:          'https://www.experian.com/loans/personal-loans/',
    insurance:              'https://www.experian.com/insurance/',
    carInsurance:           'https://www.experian.com/insurance/car/',
    creditCards:            'https://www.experian.com/credit-cards/',
    careers:                'https://www.experian.com/careers/',
    aboutExperian:          'https://www.experian.com/corporate/about-experian',
    contactUs:              'https://www.experian.com/help/contact/',
    securityFreeze:         'https://www.experian.com/help/credit-freeze/',
    disputes:               'https://www.experian.com/help/dispute-credit/',
    fraudAlert:             'https://www.experian.com/help/fraud-alert/',
    privacyCenter:          'https://www.experian.com/privacy/index',
    legalTerms:             'https://www.experian.com/corporate/legalterms',
    help:                   'https://www.experian.com/help',
    smallBusiness:          'https://www.experian.com/small-business/',
    business:               'https://www.experian.com/business/',
    experianApp:            'https://www.experian.com/credit/experian-app/',
    signIn:                 'https://www.experian.com/help/login/',
  },

  // ── URL patterns (regex for toHaveURL assertions) ────────────────────────
  urlPatterns: {
    homepage:               /experian\.com\/?$/,
    credit:                 /experian\.com\/credit\//,
    creditScore:            /credit\/credit-score/,
    creditMonitoring:       /credit\/credit-monitoring/,
    creditBoost:            /credit\/score-boost/,
    protection:             /experian\.com\/protection\//,
    creditLock:             /protection\/creditlock/,
    loans:                  /experian\.com\/loans\//,
    insurance:              /experian\.com\/insurance\//,
    creditCards:             /experian\.com\/credit-cards\//,
    careers:                /experian\.com\/careers/,
    aboutExperian:          /corporate\/about-experian/,
    contactUs:              /help\/contact/,
    securityFreeze:         /help\/credit-freeze/,
    disputes:               /help\/dispute-credit/,
    fraudAlert:             /help\/fraud-alert/,
    privacyCenter:          /privacy\/index/,
    legalTerms:             /corporate\/legalterms/,
    help:                   /experian\.com\/help/,
    smallBusiness:          /experian\.com\/small-business/,
    business:               /experian\.com\/business/,
    experianApp:            /credit\/experian-app/,
    signIn:                 /help\/login/,
  },

  // ── Homepage content ──────────────────────────────────────────────────────
  homepage: {
    heroHeading:            'Reach your credit and money goals',
    creditScoreTab:         'Get a credit report & FICO® Score',
    noDingTab:              'See No Ding Decline™ credit cards',
    saveBillsTab:           'Save over $600 on your bills',
    carInsuranceTab:        'Save on car insurance',
    smartMoneyTab:          'Build credit with digital checking',
    creditScoreHeading:     'Get your free credit report and FICO® Score',
    letsGetStartedCta:     'Let\'s get started',
    bffHeading:             'Say hi to your Big Financial Friend',
    bffDescription:         'As your BFF',
    exploreAppCta:          'Explore the Experian app',
    howCanWeHelpHeading:    'How can we help?',
    howCanWeHelpDescription:'Manage your credit basics with these free tools.',
    securityFreezeHeading:  'Security freeze',
    disputesHeading:        'Disputes',
    fraudAlertHeading:      'Fraud alert',
    seeAllCreditSupport:    'See all credit support',
  },

  // ── Footer section labels ─────────────────────────────────────────────────
  footer: {
    supportLabel:           'Support',
    educationLabel:         'Education & advice',
    creditResourcesLabel:   'Credit resources',
    businessLabel:          'Experian for businesses',
    legalTermsText:         'Legal terms & conditions',
    privacyCenterText:      'Privacy center',
    careersText:            'Careers',
    contactUsText:          'Contact us',
    copyrightPattern:       /© \d{4} Experian/,
  },

  // ── Cookie consent ────────────────────────────────────────────────────────
  cookieConsent: {
    buttonText:             'Accept All Cookies',
  },

  // ── Header navigation menu labels ─────────────────────────────────────────
  nav: {
    credit:                 'Credit',
    protection:             'Protection',
    money:                  'Money',
    creditCards:            'Credit Cards',
    loans:                  'Loans',
    insurance:              'Insurance',
  },

  // ── Top bar links ──────────────────────────────────────────────────────────
  topBar: {
    consumer:               'Consumer',
    smallBusiness:          'Small Business',
    business:               'Business',
    creditSupport:          'Credit Support',
    financialGuidance:      'Financial Guidance',
    globalSites:            'Global Sites',
  },

  // ── Page titles ───────────────────────────────────────────────────────────
  pageTitles: {
    homepage:               /Experian/,
    credit:                 /Credit/i,
    protection:             /Protection/i,
    loans:                  /Loans/i,
    insurance:              /Insurance/i,
    careers:                /Careers|Experian/,
  },

};
