import { test, expect } from '@playwright/test';
import { AIPage } from './src/core/ai-page.js';

test.describe('YouTube Video Search Test', () => {
    let page;

    test.beforeAll(async ({ browser }) => {
        // Launch a new browser instance
        page = await browser.newPage();
    });

    test.afterAll(async () => {
        // Close the browser after tests are done
        await page.close();
    });

    test('Search for "Viplove QA - SDET" and open the first video', async () => {
        try {
            // Navigate to YouTube
            await page.goto('https://www.youtube.com/');

            // Handle cookie consent dialog if it appears
            const cookieConsentButton = await page.locator('button[aria-label="Accept all"]');
            if (await cookieConsentButton.isVisible()) {
                await cookieConsentButton.click();
            }

            // Search for "Viplove QA - SDET"
            await page.fill('input#search', 'Viplove QA - SDET');
            await page.click('button#search-icon-legacy');

            // Verify that search results are displayed
            const results = await page.locator('ytd-video-renderer');
            await expect(results).toHaveCountGreaterThan(0);

            // Click on the first video
            await results.first().click();

            // Verify video page loads
            await expect(page).toHaveURL(/watch/);

            // Verify video player is visible
            const videoPlayer = await page.locator('video');
            await expect(videoPlayer).toBeVisible();
        } catch (error) {
            console.error('Test failed:', error);
            throw error; // Rethrow the error to fail the test
        }
    });
});
