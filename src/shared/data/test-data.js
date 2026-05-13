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
    loanPayment:          /loans\.uniondigitalbank\.io\/LoanPayment$/,
    loanPaymentUPay:      /loans\.uniondigitalbank\.io\/LoanPayment\/UPay/,
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

  // ── UPAY Loan Payment page content ───────────────────────────────────────
  upayPaymentPage: {
    loanPaymentUrl:    'https://loans.uniondigitalbank.io/LoanPayment',
    upayFormUrl:       'https://loans.uniondigitalbank.io/LoanPayment/UPay',
    payButtonText:     'PAY VIA UPAY NOW',
    pageHeading:       'UD Loans by UnionDigital Bank Payment Page',
    loanNumberLabel:   'Loan Number*',
    paymentAmountLabel: 'Payment Amount*',
  },

  // ── UD Loans Guide page content ───────────────────────────────────────────
  loansGuidePage: {
    pageHeading:              'UD LOANS PAYMENT GUIDES',
    accordionItemText:        'How To Pay Your UD Loans',
    freeUnionBankOption:      'Free UnionBank payment options',
    upaySection:              'Pay through your other bank accounts or e-wallets via UPAY.',
    upayLinkText:             'Click here to pay via UPAY',
    upayLinkHref:             'https://loans.uniondigitalbank.io/LoanPayment',
  },

  // ── About Us page content ──────────────────────────────────────────────
  aboutUsPage: {
    heroHeading:              'BANKING FOR THE BETTER',
    valuesHeading:            'OUR VALUES',
    visionText:               'Isang maliwanag na kinabukasan para sa lahat ng Pilipino, nasaan man sila!',
  },

  // ── Page titles ───────────────────────────────────────────────────────────
  pageTitles: {
    homepage:             /UnionDigital Bank/,
    productsSavings:      /UnionDigital Bank \| Savings/,
    productsTimeDeposit:  /Time Deposit \| UnionDigital Bank/,
    udLoansGuide:         /UD Loans Payment Guides \| UnionDigital Bank/,
    aboutUs:              /About Us.*UnionDigital Bank/,
    eshopHome:            /E-Shop - Your Online Store/,
  },

  // ── E-Shop ecommerce application ─────────────────────────────────────────
  eshop: {
    baseUrl:              'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net',
    apiBaseUrl:           'https://ecomsample-a4g8fhc7h2f6d0b6.canadacentral-01.azurewebsites.net/api',

    urls: {
      home:     'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/',
      products: 'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/products',
      cart:     'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/cart',
    },

    urlPatterns: {
      home:     /ecomm-frontend-dvcdhygrandkdyhm\.eastus-01\.azurewebsites\.net\/$/,
      products: /\/products$/,
      cart:     /\/cart$/,
    },

    home: {
      pageTitle:    'E-Shop - Your Online Store',
      heroHeading:  'Welcome to E-Shop',
      heroSubtitle: 'Discover amazing products at great prices',
      shopNowText:  'Shop Now',
      features: {
        freeShipping:   'Free Shipping',
        securePayment:  'Secure Payment',
        easyReturns:    'Easy Returns',
        qualityProducts: 'Quality Products',
      },
    },

    nav: {
      logoText:    '🛒 E-Shop',
      homeText:    'Home',
      productsText: 'Products',
      cartText:    'Cart',
    },

    products: {
      pageHeading:      'Our Products',
      searchPlaceholder: 'Search products...',
      loadingText:      'Loading products...',
      errorText:        'Failed to load products. Please make sure the backend server is running.',
      noProductsText:   'No products found',
    },

    cart: {
      emptyHeading:  'Your cart is empty',
      emptySubtext:  'Add some products to get started!',
      cartHeading:   'Shopping Cart',
      orderSummary:  'Order Summary',
      checkoutText:  'Proceed to Checkout',
    },
  },

};
