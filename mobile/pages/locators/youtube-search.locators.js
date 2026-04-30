// === FILE: mobile/pages/locators/youtube-search.locators.js ===
/**
 * YouTube Search Screen Locators
 * Labels verified against live Pixel 4 emulator accessibility tree.
 */
const locators = {
  // Search input EditText — must use full Android class name with getByType
  searchInput: (screen) => screen.getByType('android.widget.EditText'),

  // Voice search button next to the search bar
  voiceSearchButton: (screen) => screen.getByLabel('Search with your voice'),

  // Search results container
  resultsContainer: (screen) => screen.getByType('android.support.v7.widget.RecyclerView').first(),

  // First result row
  firstResult:      (screen) => screen.getByType('android.widget.LinearLayout').first(),
  firstResultTitle: (screen) => screen.getByType('android.widget.TextView').first(),

  // Explore / trending section shown before typing
  exploreMenu: (screen) => screen.getByLabel('Explore Menu'),

  // Clear / back
  clearButton: (screen) => screen.getByLabel('Clear search query'),
  backButton:  (screen) => screen.getByLabel('Navigate up'),
};

module.exports = locators;
