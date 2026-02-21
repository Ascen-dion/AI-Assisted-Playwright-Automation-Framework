/**
 * YouTube Test - Viplove QA - SDET Channel
 * Test Plan: Search for Viplove QA channel and open a video
 * 
 * Test Case: TC001 - Search and Open Viplove QA Video
 * Steps:
 * 1. Navigate to YouTube homepage
 * 2. Search for "Viplove QA - SDET"
 * 3. Verify search results are displayed
 * 4. Open the first video from search results
 * 5. Verify video page loads successfully
 */

const { test, expect } = require('@playwright/test');

test.describe('YouTube - Viplove QA - SDET Channel Tests', () => {
  
  test('TC001: Search for Viplove QA - SDET and open a video', async ({ page }) => {
    console.log('\n🎬 Starting YouTube Test...\n');
    
    // Step 1: Navigate to YouTube homepage
    console.log('📍 Step 1: Navigating to YouTube homepage...');
    await page.goto('https://www.youtube.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await expect(page).toHaveTitle(/YouTube/);
    console.log('✅ YouTube homepage loaded successfully');
    
    // Handle potential cookie consent dialog
    try {
      const acceptButton = page.locator('button[aria-label*="Accept"], button:has-text("Accept all")').first();
      if (await acceptButton.isVisible({ timeout: 3000 })) {
        await acceptButton.click();
        console.log('✅ Accepted cookie consent');
      }
    } catch (e) {
      console.log('ℹ️  No cookie consent dialog found');
    }
    
    // Step 2: Search for "Viplove QA - SDET"
    console.log('\n📍 Step 2: Searching for "Viplove QA - SDET"...');
    
    // Wait for page to be fully loaded
    await page.waitForTimeout(2000);
    
    // Find and click the search box - try multiple selectors
    let searchBox;
    try {
      // Try main search input
      searchBox = page.locator('input#search, input[name="search_query"], input[type="text"][placeholder*="Search"]').first();
      await searchBox.waitFor({ state: 'visible', timeout: 5000 });
    } catch (e) {
      // If not visible, try clicking the search button to open search
      console.log('ℹ️  Trying to open search box...');
      const searchButtonOpener = page.locator('button#search-icon-legacy, ytd-searchbox button, button[aria-label*="Search"]').first();
      await searchButtonOpener.click();
      await page.waitForTimeout(1000);
      searchBox = page.locator('input#search, input[name="search_query"], input[type="text"]').first();
      await searchBox.waitFor({ state: 'visible', timeout: 5000 });
    }
    
    await searchBox.click();
    await searchBox.fill('Viplove QA - SDET');
    console.log('✅ Entered search term: "Viplove QA - SDET"');
    
    // Submit search - press Enter key
    await searchBox.press('Enter');
    console.log('✅ Submitted search');
    
    // Step 3: Wait for search results
    console.log('\n📍 Step 3: Waiting for search results...');
    await page.waitForTimeout(2000); // Wait for search results to load
    
    // Verify we're on the search results page
    await expect(page).toHaveURL(/search_query/);
    console.log('✅ Search results page loaded');
    
    // Step 4: Find and click the first video from search results
    console.log('\n📍 Step 4: Opening the first video...');
    
    // Wait for video results to appear - try multiple selectors
    const videoLink = page.locator('a#video-title, ytd-video-renderer a#video-title, a[href*="/watch?v="]').first();
    await videoLink.waitFor({ state: 'visible', timeout: 15000 });
    
    // Get video title before clicking
    const videoTitle = await videoLink.getAttribute('title') || await videoLink.textContent();
    console.log(`📹 Found video: "${videoTitle}"`);
    
    // Click the video
    await videoLink.click();
    console.log('✅ Clicked on the first video');
    
    // Step 5: Verify video page loads
    console.log('\n📍 Step 5: Verifying video page loaded...');
    await page.waitForTimeout(3000); // Wait for video page to load
    
    // Verify we're on a video watch page (regular video or shorts)
    await expect(page).toHaveURL(/watch\?v=|shorts\//);
    console.log('✅ Video page loaded successfully');
    
    // Determine if it's a regular video or short
    const currentUrl = page.url();
    const isShorts = currentUrl.includes('/shorts/');
    console.log(`📹 Video Type: ${isShorts ? 'YouTube Shorts' : 'Regular Video'}`);
    
    // Verify video player is present
    const videoPlayer = page.locator('video').first();
    await videoPlayer.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Video player is visible');
    
    // Get final video title
    const pageTitle = await page.title();
    console.log(`\n📊 Test Summary:`);
    console.log(`   ✅ Successfully searched for "Viplove QA - SDET"`);
    console.log(`   ✅ Found and opened video: "${videoTitle}"`);
    console.log(`   ✅ Video page title: "${pageTitle}"`);
    console.log(`   ✅ Video player is ready\n`);
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'test-results/youtube-viplove-qa-video.png', fullPage: false });
    console.log('📸 Screenshot saved: test-results/youtube-viplove-qa-video.png\n');
  });
  
});
