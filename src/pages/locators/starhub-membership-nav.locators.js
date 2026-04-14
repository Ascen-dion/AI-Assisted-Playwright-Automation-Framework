// === FILE: src/pages/locators/starhub-membership-nav.locators.js ===
const locators = {
  membershipNavButton: (page) => page.getByRole('button', { name: 'Membership' }),
  membershipOverviewLink: (page) => page.getByRole('link', { name: 'Membership overview' }).first(),
  cookieConsentButton: (page) => page.getByRole('button', { name: /got it/i }).first(),
};

module.exports = locators;
