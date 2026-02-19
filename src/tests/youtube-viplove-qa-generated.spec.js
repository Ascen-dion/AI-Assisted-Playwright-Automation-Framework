// Import necessary modules from Playwright
const { test, expect } = require('@playwright/test');

// Test suite for YouTube Search and Video Opening

test.describe('YouTube Search and Video Opening Test', () => {
  // Setup before each test
  test.beforeEach(async ({ page }) => {
    // Clear cache and cookies for a fresh start
    await page.context().clearCookies();
    await page.context().clearCache();
  });

  // Test case for searching and opening a video
  test('Search for a video and open it', async ({ page }) => {
    // Navigate to the YouTube homepage
    await aiPage.navigateTo('https://www.youtube.com/');

    // Enter the search term into the search bar
    await aiPage.fillField('search bar', 'Viplove QA - SDET');

    // Click on the search button to initiate the search
    await aiPage.clickElement('search button');

    // Wait for the search results to load
    await page.waitForSelector('ytd-video-renderer'); // Wait for video results to appear

    // Verify that the search results are displayed
    await aiPage.verifyElement('search results');

    // Click on the first video from the search results
    await aiPage.clickElement('first video in search results');

    // Wait for the video page to load
    await page.waitForSelector('video'); // Wait for the video player to appear

    // Verify that the video page loads successfully
    expect(page.url()).toContain('watch'); // Check if the URL contains 'watch'

    // Verify that the video player is visible on the video page
    await aiPage.verifyElement('video player');
  });

  // Cleanup after each test
  test.afterEach(async ({ page }) => {
    // Close the web browser
    await page.close();
  });
});