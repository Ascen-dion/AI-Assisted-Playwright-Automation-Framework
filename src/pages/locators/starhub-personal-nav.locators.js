// === FILE: src/pages/locators/starhub-personal-nav.locators.js ===
const locators = {
  personalLink: (page) => page.getByRole('link', { name: 'Personal' }).first(),
  smeLink: (page) => page.getByRole('link', { name: 'SME' }).first(),
  cookieConsentButton: (page) => page.getByRole('button', { name: /got it/i }).first(),
};

module.exports = locators;
