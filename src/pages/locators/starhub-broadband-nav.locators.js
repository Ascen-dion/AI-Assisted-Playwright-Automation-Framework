// === FILE: src/pages/locators/starhub-broadband-nav.locators.js ===
const locators = {
  broadbandNavButton: (page) => page.getByRole('button', { name: 'Broadband' }),
  broadbandOverviewLink: (page) => page.getByRole('link', { name: 'Broadband overview' }).first(),
  cookieConsentButton: (page) => page.getByRole('button', { name: /got it/i }).first(),
};

module.exports = locators;
