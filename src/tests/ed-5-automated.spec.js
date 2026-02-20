import { test, expect } from '@playwright/test';

test.describe('Yahoo Sign In Button Tests', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://www.yahoo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  });

  test('Verify Sign In Button Visibility', async () => {
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeVisible({ timeout: 10000 });
  });

  test('Verify Sign In Button Enabled State', async () => {
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeEnabled();
  });

  test('Verify Sign In Button Label', async () => {
    const signInButton = page.locator('text=Sign in').first();
    const buttonText = await signInButton.textContent();
    expect(buttonText).toContain('Sign in');
  });

  test('Verify Sign In Button Positioning', async () => {
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeInViewport();
  });

  test('Verify Sign In Button Click Functionality', async () => {
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeVisible({ timeout: 10000 });
    await signInButton.click();
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    await expect(page).toHaveURL(/login\.yahoo\.com/);
  });

  test('Verify Sign In Button Disabled State (Negative Test)', async () => {
    // Simulate a condition where the Sign in button should be disabled (e.g., user is already signed in).
    // This would typically require a setup step to sign in first, which is not included here.
    // For the sake of this example, we will assume the user is signed in.

    // Navigate to the homepage again to ensure we are in the correct state
    await page.goto('https://www.yahoo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });

    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeDisabled();
  });

  test.afterAll(async () => {
    await page.close();
  });
});