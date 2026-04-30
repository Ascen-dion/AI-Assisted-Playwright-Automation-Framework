// === FILE: mobile/data/youtube-test-data.js ===
/**
 * YouTube Mobile Test Data
 * All assertion strings, search queries, and constants used in specs.
 * Never hardcode these values directly in spec files.
 */
const TD = {
  app: {
    bundleId: 'com.google.android.youtube',
    name: 'YouTube',
  },

  search: {
    query: 'Playwright automation testing',
    shortQuery: 'Playwright',
    noResultsQuery: 'xyzabcnoresultsmobilewright12345',
  },

  home: {
    // Exact content-desc values from Pixel 4 emulator accessibility tree
    bottomNavLabels: ['Home', 'Shorts', 'Subscriptions', 'You'],
    searchButtonLabel: 'Search',
    searchBarLabel: 'Search YouTube',
    youTabLabel: 'You',
    notificationsLabel: 'Notifications',
    youtubeLogo: 'YouTube',
  },

  player: {
    playButtonLabel: 'Play video',
    pauseButtonLabel: 'Pause video',
    fullscreenLabel: 'Enter fullscreen',
  },

  timeouts: {
    appLaunch: 40000,
    screenTransition: 15000,
    videoLoad: 30000,
    searchResults: 20000,
  },
};

module.exports = TD;
