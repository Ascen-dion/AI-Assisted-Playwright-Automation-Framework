// === FILE: src/pages/locators/starhub-membership-nav.locators.js ===
const locators = {
  membershipNavButton: (page) => page.getByRole('button', { name: 'Membership' }),
  membershipOverviewLink: (page) => page.getByRole('link', { name: 'Membership overview' }).first(),
};

module.exports = locators;
