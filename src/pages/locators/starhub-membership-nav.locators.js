const locators = {
  // Navigation
  navButton: (page) => page.getByRole('button', { name: 'Membership' }),

  // Dropdown — overview
  overviewLink: (page) => page.getByRole('link', { name: 'Membership overview' }),

  // Dropdown — Membership
  membershipTiersLink: (page) => page.getByRole('link', { name: 'Membership Tiers' }),
  whyStarHubLink: (page) => page.getByRole('link', { name: 'Why StarHub?' }),

  // Dropdown — Exclusive Prices
  premierLeagueLink: (page) => page.getByRole('link', { name: 'Premier League' }).first(),
};

module.exports = locators;