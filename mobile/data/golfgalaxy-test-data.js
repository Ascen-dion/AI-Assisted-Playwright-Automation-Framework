// === FILE: mobile/data/golfgalaxy-test-data.js ===
/**
 * Golf Galaxy Mobile Test Data
 * All assertion strings, timeouts, and constants used in specs.
 * Never hardcode these values directly in spec files.
 */
const TD = {
  app: {
    bundleId: 'com.dcsg.golfgalaxy.qa',
    name: 'Golf Galaxy',
  },

  home: {
    welcomeText: 'Welcome',
    searchPlaceholder: 'Search Products',
    shopTab: 'Shop',
    hotDealsTab: 'Hot Deals',
    setStoreTab: 'Set Store',
    shopByCategory: 'Shop By Category',
    signInText: 'Sign In or Create Account',
    myFavoritesText: 'My Favorites',
  },

  bottomNav: {
    shop: 'Shop',
    cart: 'Cart',
    account: 'Account',
    scheduler: 'Scheduler',
  },

  timeouts: {
    appLaunch: 40000,
    screenTransition: 15000,
  },
};

module.exports = TD;
