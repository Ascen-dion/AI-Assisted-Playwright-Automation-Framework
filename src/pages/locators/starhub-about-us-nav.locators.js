// === FILE: src/pages/locators/starhub-about-us-nav.locators.js ===
const locators = {
  aboutUsLink: (page) => page.getByRole('link', { name: 'About Us' }).first(),
  cookieConsentButton: (page) => page.getByRole('button', { name: /got it/i }).first(),
};

module.exports = locators;
