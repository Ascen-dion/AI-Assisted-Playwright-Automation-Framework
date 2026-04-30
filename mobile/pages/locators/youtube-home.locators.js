// === FILE: mobile/pages/locators/youtube-home.locators.js ===
/**
 * YouTube Home Screen Locators
 * Labels verified against live Pixel 4 emulator accessibility tree (uiautomator dump).
 */
const locators = {
  // Bottom navigation bar — matched by text content inside the nav Button's child TextView
  homeTab:          (screen) => screen.getByText('Home'),
  shortsTab:        (screen) => screen.getByText('Shorts'),
  subscriptionsTab: (screen) => screen.getByText('Subscriptions'),
  youTab:           (screen) => screen.getByText('You'),

  // Top bar — search icon (content-desc="Search", no text)
  searchButton: (screen) => screen.getByLabel('Search'),

  // Inline search bar text (content-desc="Search YouTube")
  searchBar: (screen) => screen.getByLabel('Search YouTube'),

  // Notifications bell
  notificationsButton: (screen) => screen.getByLabel('Notifications'),

  // YouTube logo — resource-id stable sentinel for app launch
  youtubeLogo: (screen) => screen.getByLabel('YouTube'),

  // Video feed (populated when signed-in account has watch history)
  videoFeed: (screen) => screen.getByType('android.support.v7.widget.RecyclerView').first(),

  // First video title TextView
  firstVideoTitle: (screen) => screen.getByType('android.widget.TextView').first(),
};

module.exports = locators;
