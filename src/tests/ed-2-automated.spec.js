import { test, expect } from '@playwright/test';

const homepageUrl = 'https://www.endpointclinical.com/';
const invalidPageUrl = 'https://www.endpointclinical.com/invalidpage';
const headlineSelector = 'h1';

test.describe('Homepage Headline Tests', () => {
  
  test('Verify the presence of the headline on the homepage', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const headline = page.locator(headlineSelector).first();
    await expect(headline).toBeVisible({ timeout: 10000 });
    const text = await headline.textContent();
    expect(text).toContain('Your hidden advantage in RTSM');
  });

  test('Verify the visibility of the headline without scrolling', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const headline = page.locator(headlineSelector).first();
    await expect(headline).toBeVisible({ timeout: 10000 });
    const isInViewport = await headline.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    });
    expect(isInViewport).toBe(true);
  });

  test('Verify the headline formatting on desktop', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const headline = page.locator(headlineSelector).first();
    await expect(headline).toBeVisible({ timeout: 10000 });
    const fontSize = await headline.evaluate(el => window.getComputedStyle(el).fontSize);
    expect(parseFloat(fontSize)).toBeGreaterThan(20);
  });

  test('Verify the headline formatting on tablet', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const headline = page.locator(headlineSelector).first();
    await expect(headline).toBeVisible({ timeout: 10000 });
    const fontSize = await headline.evaluate(el => window.getComputedStyle(el).fontSize);
    expect(parseFloat(fontSize)).toBeGreaterThan(20);
  });

  test('Verify the headline formatting on mobile', async ({ page }) => {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const headline = page.locator(headlineSelector).first();
    await expect(headline).toBeVisible({ timeout: 10000 });
    const fontSize = await headline.evaluate(el => window.getComputedStyle(el).fontSize);
    expect(parseFloat(fontSize)).toBeGreaterThan(20);
  });

  test('Verify the absence of the headline when the homepage is not loaded', async ({ page }) => {
    await page.goto(invalidPageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const headline = page.locator(headlineSelector).first();
    await expect(headline).not.toBeVisible({ timeout: 10000 });
  });
});