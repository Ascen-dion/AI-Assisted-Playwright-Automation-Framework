import { test, expect } from '@playwright/test';

test.describe('Yahoo Homepage Sign In Button Tests', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Verify Sign In Button Visibility on Yahoo Homepage', async () => {
    await page.goto('https://www.yahoo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });

  test('Verify Sign In Button is Enabled and Clickable', async () => {
    await page.goto('https://www.yahoo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeEnabled();
    await signInButton.click();
  });

  test('Verify Sign In Button Position on Yahoo Homepage', async () => {
    await page.goto('https://www.yahoo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeVisible({ timeout: 10000 });
    await expect(signInButton).toBeInViewport();
  });

  test('Verify Sign In Button Label', async () => {
    await page.goto('https://www.yahoo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toHaveText('Sign in');
  });

  test('Verify Sign In Button Not Present on Other Pages', async () => {
    await page.goto('https://www.yahoo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const signInButton = page.locator('text=Sign in').first();
    await page.goto('https://news.yahoo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await expect(signInButton).not.toBeVisible({ timeout: 10000 });
  });
});