// === FILE: mobile/pages/locators/golfgalaxy-home.locators.js ===
/**
 * Golf Galaxy Home Screen Locators
 * Verified against live Pixel 5 API 30 emulator accessibility tree.
 * Resource IDs from: com.dcsg.golfgalaxy.qa
 */
const locators = {
  // Top toolbar — "Welcome" text (resource-id: app_user_name_text)
  welcomeText: (screen) => screen.getByText('Welcome'),

  // Search bar
  searchBar: (screen) => screen.getByText('Search Products'),

  // Top tab bar
  shopTab:     (screen) => screen.getByText('Shop'),
  hotDealsTab: (screen) => screen.getByText('Hot Deals'),
  setStoreTab: (screen) => screen.getByText('Set Store'),

  // Home content
  shopByCategory: (screen) => screen.getByText('Shop By Category'),
  signIn:         (screen) => screen.getByText('Sign In or Create Account'),
  myFavorites:    (screen) => screen.getByText('My Favorites'),

  // Bottom navigation
  bottomNavShop:      (screen) => screen.getByLabel('Shop'),
  bottomNavCart:      (screen) => screen.getByLabel('Cart'),
  bottomNavAccount:   (screen) => screen.getByLabel('Account'),
  bottomNavScheduler: (screen) => screen.getByLabel('Scheduler'),
};

module.exports = locators;
