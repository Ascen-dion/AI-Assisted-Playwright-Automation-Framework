// === FILE: src/pages/locators/starhub-broadband-nav.locators.js ===
const locators = {
  broadbandNavButton: (page) => page.getByRole('button', { name: 'Broadband' }),
  broadbandOverviewLink: (page) => page.getByRole('link', { name: 'Broadband overview' }).first(),
};

module.exports = locators;
