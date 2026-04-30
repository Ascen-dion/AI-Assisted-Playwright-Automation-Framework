// === FILE: mobile/pages/youtube-search.page.js ===
const YoutubeBasePage = require('./youtube-base.page');
const loc = require('./locators/youtube-search.locators');
const TD = require('../data/youtube-test-data');

class YoutubeSearchPage extends YoutubeBasePage {
  constructor(device, screen) {
    super(device, screen);
  }

  /**
   * Wait for the search screen to be ready.
   * Uses the 'Navigate up' back button as sentinel — it only appears on the search screen.
   * Then also waits for the EditText input to be focused.
   */
  async waitForSearchInput() {
    // Back button is the most reliable indicator the search screen has opened
    await loc.backButton(this.screen).waitFor({
      state: 'visible',
      timeout: TD.timeouts.screenTransition,
    });
  }

  /** Type a query and submit using the IME Enter key. */
  async search(query) {
    await loc.searchInput(this.screen).fill(query);
    await this.screen.pressButton('ENTER');
  }

  /** Wait until search results are populated. */
  async waitForResults() {
    await loc.resultsContainer(this.screen).waitFor({
      state: 'visible',
      timeout: TD.timeouts.searchResults,
    });
  }

  /** Return text of the first search result title. */
  async getFirstResultTitle() {
    return loc.firstResultTitle(this.screen).getText();
  }

  /** Tap the first result in the list. */
  async tapFirstResult() {
    await loc.firstResult(this.screen).tap();
  }

  /** Clear the current query and return to empty search. */
  async clearSearch() {
    try {
      await loc.clearButton(this.screen).tap();
    } catch (_) {}
  }

  /** Navigate back to home screen. */
  async goBack() {
    await loc.backButton(this.screen).tap();
  }
}

module.exports = YoutubeSearchPage;
