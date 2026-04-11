const locators = {
  // Navigation
  navButton: (page) => page.getByRole('button', { name: 'Broadband' }),

  // Dropdown — overview
  overviewLink: (page) => page.getByRole('link', { name: 'Broadband overview' }),

  // Dropdown — Broadband Plans & Bundle
  broadbandPlansLink: (page) => page.getByRole('link', { name: 'Broadband Plans' }),
  broadbandTVBundlesLink: (page) => page.getByRole('link', { name: 'Broadband & TV+ Bundles' }),

  // Dropdown — Routers
  routers10GbpsLink: (page) => page.getByRole('link', { name: '10Gbps Routers' }),
  routersWifi6Link: (page) => page.getByRole('link', { name: 'WiFi 6 & 7 Routers' }),

  // Dropdown — Services & Add-ons
  dvhLink: (page) => page.getByRole('link', { name: 'Digital Voice Home Phone Line (DVH)' }),
  juniorProtectLink: (page) => page.getByRole('link', { name: 'JuniorProtect' }),
  safeHubPlusLink: (page) => page.getByRole('link', { name: 'SafeHub+' }).first(),

  // Dropdown — More
  latestPromotionsLink: (page) => page.getByRole('link', { name: 'Latest Promotions' }).first(),
  wifiTipsLink: (page) => page.getByRole('link', { name: 'Improve Your Home WiFi' }),
};

module.exports = locators;