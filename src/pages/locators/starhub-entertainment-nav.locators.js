// === FILE: src/pages/locators/starhub-entertainment-nav.locators.js ===
const locators = {
  entertainmentNavButton: (page) => page.getByRole('button', { name: 'Entertainment' }),
  entertainmentOverviewLink: (page) => page.getByRole('link', { name: 'Entertainment overview' }).first(),
  cookieConsentButton: (page) => page.getByRole('button', { name: /got it/i }).first(),
};

module.exports = locators;
