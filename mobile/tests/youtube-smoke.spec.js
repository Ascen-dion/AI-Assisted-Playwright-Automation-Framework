// === FILE: mobile/tests/youtube-smoke.spec.js ===
/**
 * YouTube Android — Smoke Tests
 *
 * Tags:
 *   @smoke      — fast visibility checks; run on every push
 *   @regression — full journey tests; run on PR and nightly
 *
 * Requires: Android emulator booted with com.google.android.youtube installed.
 * Run:  npx mobilewright test mobile/tests/youtube-smoke.spec.js
 */
const { test, expect } = require('@mobilewright/test');
const YoutubeHomePage   = require('../pages/youtube-home.page');
const YoutubeSearchPage = require('../pages/youtube-search.page');
const YoutubePlayerPage = require('../pages/youtube-player.page');
const TD = require('../data/youtube-test-data');

test.use({ platform: 'android', bundleId: TD.app.bundleId });

test.describe('[Mobile][Smoke] YouTube Android App', () => {
  // Emulator app launch + feed render takes 20-40s — override default 15s test timeout
  test.setTimeout(30000);

  // ─────────────────────────────────────────────────────────────────
  // Home Screen
  // ─────────────────────────────────────────────────────────────────
  test.describe('Home Screen', () => {

    // test('[YT-01] App launches and home screen is visible', async ({ device, screen }) => {
    //   const homePage = new YoutubeHomePage(device, screen);
    //   await homePage.goto();

    //   // YouTube logo (content-desc="YouTube") is always present on home screen
    //   await expect(screen.getByLabel('YouTube'))
    //     .toBeVisible({ timeout: TD.timeouts.appLaunch });
    // });

    // test('[YT-02] Bottom navigation tabs are visible', async ({ device, screen }) => {
    //   const homePage = new YoutubeHomePage(device, screen);
    //   await homePage.goto();

    //   // TD.home.bottomNavLabels = ['Home', 'Shorts', 'Subscriptions', 'You']
    //   for (const label of TD.home.bottomNavLabels) {
    //     await expect(screen.getByText(label))
    //       .toBeVisible({ timeout: TD.timeouts.screenTransition });
    //   }
    // });

    // test('[YT-03] Search button is visible on home screen', async ({ device, screen }) => {
    //   const homePage = new YoutubeHomePage(device, screen);
    //   await homePage.goto();

    //   // Top-right search icon has content-desc="Search"
    //   await expect(screen.getByLabel('Search'))
    //     .toBeVisible({ timeout: TD.timeouts.screenTransition });
    // });

  });

  // ─────────────────────────────────────────────────────────────────
  // Search Flow
  // ─────────────────────────────────────────────────────────────────
  test.describe('Search', () => {

    test('[YT-04] Tapping Search opens the search input', async ({ device, screen }) => {
      const homePage   = new YoutubeHomePage(device, screen);
      const searchPage = new YoutubeSearchPage(device, screen);

      await homePage.goto();
      await homePage.tapSearch();  // taps content-desc="Search" icon
      await searchPage.waitForSearchInput();

      // 'Navigate up' back button is the definitive search-screen indicator
      await expect(screen.getByLabel('Navigate up'))
        .toBeVisible({ timeout: TD.timeouts.screenTransition });
      // EditText input should also be present
      await expect(screen.getByType('android.widget.EditText'))
        .toBeVisible({ timeout: TD.timeouts.screenTransition });
    });

    test('[YT-05] Searching returns results', async ({ device, screen }) => {
      const homePage   = new YoutubeHomePage(device, screen);
      const searchPage = new YoutubeSearchPage(device, screen);

      await homePage.goto();
      await homePage.tapSearch();
      await searchPage.waitForSearchInput();
      await searchPage.search(TD.search.query);
      await searchPage.waitForResults();

      await expect(screen.getByType('RecyclerView').first())
        .toBeVisible({ timeout: TD.timeouts.searchResults });
    });

  });

  // ─────────────────────────────────────────────────────────────────
  // Video Playback
  // ─────────────────────────────────────────────────────────────────
  test.describe('Video Playback', () => {

    test('[YT-06] Tapping a search result opens the video player', async ({ device, screen }) => {
      const homePage    = new YoutubeHomePage(device, screen);
      const searchPage  = new YoutubeSearchPage(device, screen);
      const playerPage  = new YoutubePlayerPage(device, screen);

      await homePage.goto();
      await homePage.tapSearch();
      await searchPage.waitForSearchInput();
      await searchPage.search(TD.search.shortQuery);
      await searchPage.waitForResults();
      await searchPage.tapFirstResult();
      await playerPage.waitForPlayer();

      const isVisible = await playerPage.isPlayerVisible();
      expect(isVisible).toBe(true);
    });

    test('[YT-07] Video player controls appear on tap', async ({ device, screen }) => {
      const homePage   = new YoutubeHomePage(device, screen);
      const searchPage = new YoutubeSearchPage(device, screen);
      const playerPage = new YoutubePlayerPage(device, screen);

      await homePage.goto();
      await homePage.tapSearch();
      await searchPage.waitForSearchInput();
      await searchPage.search(TD.search.shortQuery);
      await searchPage.waitForResults();
      await searchPage.tapFirstResult();
      await playerPage.waitForPlayer();
      await playerPage.revealControls();

      await expect(screen.getByRole('button', { name: /play|pause/i }))
        .toBeVisible({ timeout: TD.timeouts.screenTransition });
    });

  });

});
