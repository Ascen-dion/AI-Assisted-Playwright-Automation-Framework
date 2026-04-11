const locators = {
  // Navigation
  navButton: (page) => page.getByRole('button', { name: 'Entertainment' }),

  // Dropdown — overview
  overviewLink: (page) => page.getByRole('link', { name: 'Entertainment overview' }),

  // Dropdown — Entertainment Plans
  tvPassesLink: (page) => page.getByRole('link', { name: 'Browse TV+ Passes' }),
  premierLeagueLink: (page) => page.getByRole('link', { name: 'Premier League' }).first(),
  addOnsLink: (page) => page.getByRole('link', { name: 'Explore Add-ons' }),

  // Dropdown — StarHub TV+
  cloudRecordingLink: (page) => page.getByRole('link', { name: 'Cloud Recording – NEW!' }),
  mobileAppLink: (page) => page.getByRole('link', { name: 'Mobile App' }),
  webBrowserLink: (page) => page.getByRole('link', { name: 'Web Browser' }),
  tvDevicesLink: (page) => page.getByRole('link', { name: 'TV Devices' }),
  channelListLink: (page) => page.getByRole('link', { name: 'Channel List' }),

  // Dropdown — Promotions & Bundles
  worldCupLink: (page) => page.getByRole('link', { name: "Mediacorp's FIFA World Cup 2026™" }),
  latestPromotionsLink: (page) => page.getByRole('link', { name: 'Latest Promotions' }).first(),
  tvBroadbandBundlesLink: (page) => page.getByRole('link', { name: 'TV+ & Broadband Bundles' }),

  // Dropdown — Streaming Apps
  netflixLink: (page) => page.getByRole('link', { name: 'Netflix' }),
  disneyPlusLink: (page) => page.getByRole('link', { name: 'Disney+' }),
  amazonPrimeLink: (page) => page.getByRole('link', { name: 'Amazon Prime' }),
  hboMaxLink: (page) => page.getByRole('link', { name: 'HBO Max' }),
  iqiyiLink: (page) => page.getByRole('link', { name: 'iQIYI' }),
  cmgoLink: (page) => page.getByRole('link', { name: 'CMGO' }),
  viuLink: (page) => page.getByRole('link', { name: 'Viu' }),
};

module.exports = locators;