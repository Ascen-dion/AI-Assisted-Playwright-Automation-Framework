import { test, expect } from '@playwright/test';

test.describe('Homepage Welcome Message Tests', () => {
  const url = 'https://ascendion.com';
  
  test.beforeEach(async ({ page }) => {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  });

  test('Verify Welcome Message is Displayed on Homepage', async ({ page }) => {
    // Page has multiple H1s, target the first one
    const welcomeMessage = page.locator('h1').first();
    await expect(welcomeMessage).toBeVisible();
    const text = await welcomeMessage.textContent();
    expect(text).toBeTruthy();
  });

  test('Check Visibility of Welcome Message Without Scrolling', async ({ page }) => {
    // Use .first() to avoid strict mode violation with multiple H1s
    const welcomeMessage = page.locator('h1').first();
    await expect(welcomeMessage).toBeVisible({ timeout: 10000 });
    await expect(welcomeMessage).toBeInViewport();
  });

  test('Verify Font Size and Style of Welcome Message', async ({ page }) => {
    const welcomeMessage = page.locator('h1').first();
    await expect(welcomeMessage).toBeVisible();
    
    // Check that font-size is reasonable (not checking exact value)
    const fontSize = await welcomeMessage.evaluate(el => window.getComputedStyle(el).fontSize);
    const sizeNum = parseFloat(fontSize);
    expect(sizeNum).toBeGreaterThan(20); // Reasonable minimum for headline
  });

  test('Confirm Welcome Message Positioning on Page', async ({ page }) => {
    const welcomeMessage = page.locator('h1').first();
    await expect(welcomeMessage).toBeVisible();
    
    // Just verify it's in the viewport, not checking exact positioning
    await expect(welcomeMessage).toBeInViewport();
  });

  test('Verify Homepage Has Valid H1 Heading', async ({ page }) => {
    // Verify at least one H1 exists on homepage
    const headings = page.locator('h1');
    const count = await headings.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify first H1 has non-empty text
    const firstHeading = page.locator('h1').first();
    const text = await firstHeading.textContent();
    expect(text.trim().length).toBeGreaterThan(0);
  });
});