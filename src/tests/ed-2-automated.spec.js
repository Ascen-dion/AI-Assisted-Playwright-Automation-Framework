import { test, expect } from '@playwright/test';

const homepageUrl = 'https://www.endpointclinical.com';
const headlineSelector = 'h1';

test.describe('Homepage Headline Tests', () => {
  
  test('Verify the presence of the headline on the homepage', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const headline = page.locator(headlineSelector);
    const text = await headline.textContent();
    
    // Assert that the headline contains the expected keywords
    expect(text.toLowerCase()).toContain('hidden');
    expect(text.toLowerCase()).toContain('advantage');
    expect(text.toLowerCase()).toContain('rtsm');
  });

  test('Check visibility of the headline without scrolling', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.setViewportSize({ width: 1280, height: 800 }); // Maximize for desktop
    const headline = page.locator(headlineSelector);
    
    // Assert that the headline is visible without scrolling
    await expect(headline).toBeVisible();
    await expect(headline).toBeInViewport();
  });

  test('Verify the headline formatting on desktop', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.setViewportSize({ width: 1280, height: 800 }); // Desktop view
    const headline = page.locator(headlineSelector);
    
    // Assert that the headline contains the expected keywords
    const text = await headline.textContent();
    expect(text.toLowerCase()).toContain('hidden');
    expect(text.toLowerCase()).toContain('advantage');
    expect(text.toLowerCase()).toContain('rtsm');
  });

  test('Verify the headline formatting on tablet', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet view
    const headline = page.locator(headlineSelector);
    
    // Assert that the headline contains the expected keywords
    const text = await headline.textContent();
    expect(text.toLowerCase()).toContain('hidden');
    expect(text.toLowerCase()).toContain('advantage');
    expect(text.toLowerCase()).toContain('rtsm');
  });

  test('Verify the headline formatting on mobile', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile view
    const headline = page.locator(headlineSelector);
    
    // Assert that the headline contains the expected keywords
    const text = await headline.textContent();
    expect(text.toLowerCase()).toContain('hidden');
    expect(text.toLowerCase()).toContain('advantage');
    expect(text.toLowerCase()).toContain('rtsm');
  });

  test('Negative test: Verify the absence of incorrect text', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const headline = page.locator(headlineSelector);
    const text = await headline.textContent();
    
    // Assert that the headline contains the expected keywords and does not contain incorrect text
    expect(text.toLowerCase()).toContain('hidden');
    expect(text.toLowerCase()).toContain('advantage');
    expect(text.toLowerCase()).toContain('rtsm');
    expect(text.toLowerCase()).not.toContain('incorrect text'); // Example of incorrect text
  });

});