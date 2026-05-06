// === FILE: src/pages/locators/ud-about-us-nav.locators.js ===
const locators = {
  aboutUsNavLink: (page) => page.getByText('About Us').first(),
  heroHeading: (page) => page.getByRole('heading', { name: 'BANKING FOR THE BETTER' }),
  valuesHeading: (page) => page.getByRole('heading', { name: 'OUR VALUES' }),
};

module.exports = locators;
