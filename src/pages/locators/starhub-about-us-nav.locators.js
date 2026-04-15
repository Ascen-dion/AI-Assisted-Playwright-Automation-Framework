// === FILE: src/pages/locators/starhub-about-us-nav.locators.js ===
const locators = {
  aboutUsLink: (page) => page.getByRole('link', { name: 'About Us' }).first(),
};

module.exports = locators;
