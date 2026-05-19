// === FILE: src/data/test-data.js ===
/**
 * Centralised test data for Sun Life Philippines automation suite.
 *
 * Single source of truth for all assertion strings, URLs, and expected values.
 * When the application changes a label or copy, update here — not in each spec.
 */

module.exports = {

  // ── Sun Life Philippines ─────────────────────────────────────────────────
  sunlife: {

    // URLs
    urls: {
      homepage:           'https://www.sunlife.com.ph/en/',
      insurance:          'https://www.sunlife.com.ph/en/insurance/',
      lifeInsurance:      'https://www.sunlife.com.ph/en/insurance/life-insurance/',
      healthInsurance:    'https://www.sunlife.com.ph/en/insurance/health-insurance/',
      termInsurance:      'https://www.sunlife.com.ph/en/insurance/life-insurance/term-insurance/',
      wealthTransfer:     'https://www.sunlife.com.ph/en/insurance/life-insurance/wealth-transfer/',
      wealthAccumulation: 'https://www.sunlife.com.ph/en/insurance/life-insurance/wealth-accumulation/',
      groupInsurance:     'https://www.sunlife.com.ph/en/insurance/group-insurance/',
      vulFunds:           'https://www.sunlife.com.ph/en/insurance/VULs-and-Fund-Options/',
      investments:        'https://www.sunlife.com.ph/en/investments/',
      prosperityFunds:    'https://www.sunlife.com.ph/en/investments/sun-life-prosperity-funds/',
      lifeGoals:          'https://www.sunlife.com.ph/en/life-goals/',
      aboutUs:            'https://www.sunlife.com.ph/en/about-us/',
      faqs:               'https://www.sunlife.com.ph/en/about-us/faqs/',
      contactUs:          'https://www.sunlife.com.ph/en/about-us/contact-us/',
      getHelp:            'https://www.sunlife.com.ph/en/about-us/become-an-empowered-sun-lifer/',
      allProducts:        'https://www.sunlife.com.ph/en/all-products/',
      vulFundPrices:      'https://www.sunlife.com.ph/en/insurance/vul-fund-prices/',
      fileAClaim:         'https://www.sunlife.com.ph/en/about-us/how-to-file-a-claim-video/',
      claimForm:          'https://www.sunlife.com.ph/en/insurance/tools-and-services/file-a-claim/',
      toolsServices:      'https://www.sunlife.com.ph/en/insurance/tools-and-services/',
      paymentChannels:    'https://www.sunlife.com.ph/en/about-us/become-an-empowered-sun-lifer/payment-channels/',
      advisorList:        'https://www.sunlife.com.ph/en/about-us/corporate-governance/',
      careers:            'https://www.sunlife.com.ph/en/about-us/careers/',
      onlinePayment:      'https://online.sunlife.com.ph/onlinepay/payment',
      login:              'https://mobile.sunlife.com.ph/slocpicp/index.html#/',
      businessOwners:     'https://www.sunlife.com.ph/en/insurance/business-owners-insurance-packages/',
      shinePinoy:         'https://www.sunlife.com.ph/en/insurance/shine-pinoy-program/',
      partnerProfessionals: 'https://www.sunlife.com.ph/en/insurance/partner-for-professionals/',
      sweldoPowerUp:      'https://www.sunlife.com.ph/en/insurance/sweldo-power-up-for-employees/',
    },

    // URL patterns (regex for toHaveURL assertions)
    urlPatterns: {
      homepage:           /sunlife\.com\.ph\/en\/?$/,
      insurance:          /sunlife\.com\.ph\/en\/insurance\//,
      lifeInsurance:      /\/en\/insurance\/life-insurance\//,
      healthInsurance:    /\/en\/insurance\/health-insurance\//,
      investments:        /\/en\/investments\//,
      lifeGoals:          /\/en\/life-goals\//,
      aboutUs:            /\/en\/about-us\//,
      faqs:               /\/en\/about-us\/faqs\//,
      allProducts:        /\/en\/all-products\//,
      claimForm:          /\/en\/insurance\/tools-and-services\/file-a-claim\//,
      howToFileAClaim:    /\/en\/about-us\/how-to-file-a-claim-video\//,
      paymentChannels:    /\/en\/about-us\/become-an-empowered-sun-lifer\/payment-channels\//,
      advisorList:        /\/en\/about-us\/corporate-governance\//,
      careers:            /\/en\/about-us\/careers\//,
    },

    // Page titles
    pageTitles: {
      homepage:           'Insurance & Investment Products | Sun Life Philippines',
      claimForm:          'Insurance Claim Form | Sun Life Philippines',
      howToFileAClaim:    'How to file a claim at Sun Life PH',
      insurance:          'Personal & Family Insurance | Sun Life Philippines',
      lifeInsurance:      /Life insurance.*Sun Life Philippines/i,
      healthInsurance:    /Health insurance.*Sun Life Philippines/i,
      investments:        'Investment Products | Sun Life Philippines',
      lifeGoals:          'Personal Insurance Lifestyle Articles | Sun Life Philippines',
      aboutUs:            'About Us | Sun Life Philippines',
    },

    // File a Claim form — test input data
    claimFormData: {
      insuredLastName:   'Santos',
      insuredFirstName:  'Maria',
      insuredMiddleName: 'Cruz',
      policyPlanNo:      'SL-0001234',
      dateOfBirth:       '01/15/1985',
      email:             'test@example.com',
      message:           'Test message for automation',
      contactLastName:   'Reyes',
      contactFirstName:  'Jose',
      contactMiddleName: 'Dela',
      contactMobileNo:   '09171234567',
      contactEmail:      'contact@example.com',
      claimType:         'Death',  // First option in the custom combobox dropdown
      checkPrivacy:      true,
    },

    // Navigation labels
    nav: {
      menuButtonName:     'open menu',
      menuDialogName:     'Sun Life menu',
      insuranceBtn:       'Insurance',
      investmentsBtn:     'Investments',
      lifeGoalsBtn:       'Life goals',
      aboutUsBtn:         'About us',
      loginLink:          'Log in',
      whereToPay:         'Where to pay',
      talkToAdvisor:      'Talk to an advisor',
      advisorList:        'Advisor list',
    },

    // Product names — Life Insurance
    lifeInsurance: {
      sunLifePremierLegacy:    'Sun Life Premier Legacy',
      sunSmarterLifeClassic:   'SUN Smarter Life Classic',
      sunSmarterLifeElite:     'SUN Smarter Life Elite',
      sunStartUp:              'Sun StartUp',
      sunLifeSaveAndProtect:   'Sun Life Save and Protect',
      sunLifeSecureIncome:     'Sun Life Secure Income',
      sunAcceler8:             'Sun Acceler8',
      sunDreamAchiever:        'Sun Dream Achiever',
      sunLegacy:               'Sun Legacy',
      sunWealthPrime7:         'Sun Wealth Prime 7',
      sunMaxiLinkOne:          'Sun MaxiLink One',
      sunMaxiLinkBright:       'Sun MaxiLink Bright',
      sunMaxiLink100:          'Sun MaxiLink 100',
      sunMaxiLinkPrime:        'Sun MaxiLink Prime',
      sunMaxiLinkDollarOne:    'Sun MaxiLink Dollar One',
      sunFlexiLink:            'Sun FlexiLink',
      sunFlexiLink1:           'Sun FlexiLink1',
      sunFlexiDollar:          'Sun FlexiDollar',
      sunFlexiDollar1:         'Sun FlexiDollar1',
      sunHealthierLife:        'SUN Healthier Life',
      sunLifeAssure:           'Sun LifeAssure',
      sunMaidenAndPlus:        'Sun Maiden and Sun Maiden Plus',
      sunFirstAidAndPlus:      'Sun First Aid and Sun First Aid Plus',
      sunSaferLife:            'SUN Safer Life',
    },

    // Product names — Health Insurance
    healthInsurance: {
      sunCancerCare:           'SUN Cancer Care',
      sunFitAndWell:           'SUN Fit and Well',
      sunSeniorCare:           'SUN Senior Care',
      sunIcuProtect:           'Sun ICU Protect',
      sunLifeOfwHealthProtect: 'Sun Life OFW Health Protect',
    },

    // Investment risk profiles
    investorProfiles: {
      conservative: 'The Conservative Investor',
      moderate:     'The Moderate Investor',
      balanced:     'The Balanced Investor',
      growth:       'The Growth Investor',
      aggressive:   'The Aggressive Investor',
    },

    // Homepage content
    homepage: {
      heroBannerHeading:     'Live Bright Now',
      heroBannerSubtext:     'Discover how to save for your child',
      getHelpHeading:        'Get help',
      calculatorsHeading:    'Calculators & Quizzes',
      getAQuoteHeading:      'Get a quote online',
      needsFinderText:       'Discover bright solutions to your needs',
      whySunLifeHeading:     'Why do Filipinos choose Sun Life?',
      whySunLifeRank:        'Sun Life is the #1 life insurance company in the Philippines.',
      payWithPeaceHeading:   'Pay with peace of mind',
    },
  },

};
