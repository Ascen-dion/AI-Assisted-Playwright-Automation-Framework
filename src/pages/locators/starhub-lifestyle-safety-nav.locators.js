const locators = {
  // Navigation
  navButton: (page) => page.getByRole('button', { name: 'Lifestyle & Safety' }),

  // Dropdown — overview
  overviewLink: (page) => page.getByRole('link', { name: 'Lifestyle & Safety' }).first(),

  // Dropdown — Protection & Security
  safeHubPlusOverviewLink: (page) => page.getByRole('link', { name: 'SafeHub+ Overview' }),
  smartSupportLink: (page) => page.getByRole('link', { name: 'SmartSupport', exact: true }),
  cyberProtectLink: (page) => page.getByRole('link', { name: 'CyberProtect' }),
  smartSupportHomeLink: (page) => page.getByRole('link', { name: 'SmartSupport Home' }),
  cyberCoverLink: (page) => page.getByRole('link', { name: 'CyberCover' }),
  scamSafeLink: (page) => page.getByRole('link', { name: 'ScamSafe' }),

  // Dropdown — Lifestyle
  travelProtectionLink: (page) => page.getByRole('link', { name: 'Travel Protection' }),
};

module.exports = locators;