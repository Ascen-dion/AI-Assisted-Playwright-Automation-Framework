const locators = {
  // Navigation
  navButton: (page) => page.getByRole('button', { name: 'Mobile' }),

  // Dropdown — overview
  overviewLink: (page) => page.getByRole('link', { name: 'Mobile overview' }),

  // Dropdown — Mobile Phones
  allPhonesLink: (page) => page.getByRole('link', { name: 'All Phones' }),
  appleLink: (page) => page.getByRole('link', { name: 'Apple', exact: true }),
  samsungLink: (page) => page.getByRole('link', { name: 'Samsung', exact: true }),
  oppoLink: (page) => page.getByRole('link', { name: 'OPPO', exact: true }),
  tabletsWatchesLink: (page) => page.getByRole('link', { name: 'Tablets & Watches' }),
  accessoriesLink: (page) => page.getByRole('link', { name: 'Accessories' }),

  // Dropdown — Mobile Plans
  plans5GUnlimitedLink: (page) => page.getByRole('link', { name: '5G Unlimited+' }),
  prepaidLink: (page) => page.getByRole('link', { name: 'Prepaid' }),
  touristPlansLink: (page) => page.getByRole('link', { name: 'Tourist plans' }),
  cisLink: (page) => page.getByRole('link', { name: 'Corporate deals (CIS)' }),

  // Dropdown — Add-ons & Services
  tradeInLink: (page) => page.getByRole('link', { name: 'Device Trade-in' }),
  buyNowPayLaterLink: (page) => page.getByRole('link', { name: 'Buy Now Pay Later' }),
  roamingLink: (page) => page.getByRole('link', { name: 'Roaming' }),
  safeHubPlusLink: (page) => page.getByRole('link', { name: 'SafeHub+' }).first(),
  valueAddedServicesLink: (page) => page.getByRole('link', { name: 'Value-Added Services' }),
  esimLink: (page) => page.getByRole('link', { name: 'eSIM Benefits & Activation' }),

  // Dropdown — StarHub Difference
  latestPromotionsLink: (page) => page.getByRole('link', { name: 'Latest Promotions' }).first(),
  deviceDollarsLink: (page) => page.getByRole('link', { name: 'DeviceDollars' }),
  multiLineSavingsLink: (page) => page.getByRole('link', { name: 'Multi-line Savings' }),
  fiveGCoverageLink: (page) => page.getByRole('link', { name: 'Over 99% 5G Coverage' }),

  // Post-navigation — All Phones listing page (consumer.starhub.com)
  // Confirmed live DOM: class="product-item-card ..." (39 items on devices listing)
  deviceListingCard: (page) => page.locator('[class*="product-item-card"]').first(),
  deviceProductName: (page) => page.locator('[class*="product-item-card"] [class*="f-body-regular-desktop"][class*="fw-bold"]').first(),
  deviceProductImage: (page) => page.locator('[class*="product-item-card"] .image-section img').first(),
  deviceProductPrice: (page) => page.locator('[class*="f-h6-desktop"]').first(),
  deviceListingHeading: (page) => page.locator('[class*="product-item-card"]').first(),
};

module.exports = locators;
