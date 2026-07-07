// === FILE: src/pages/locators/starhub-mobile-nav.locators.js ===
const locators = {
  // Homepage navigation — Mobile tab (desktop mega-menu pattern)
  mobileNavButton: (page) => page.locator('div.dropdown-toggle[role="button"]').filter({ hasText: /^Mobile$/ }),
  allPhonesLink: (page) => page.getByRole('link', { name: 'All Phones' }).first(),

  // Device listing page (consumer.starhub.com/personal/store/mobile/devices)
  deviceItemCount: (page) => page.locator('text=/\\d+ items/').first(),
  galaxyA57Card: (page) => page.getByText('Galaxy A57 5G', { exact: true }).first(),

  // Device PDP — product identification
  deviceBreadcrumbTitle: (page) => page.getByText('Samsung Galaxy A57 5G', { exact: true }).first(),
};

module.exports = locators;
