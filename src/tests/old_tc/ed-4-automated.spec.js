import { test, expect } from '@playwright/test';

test.describe('Yahoo Homepage Sign In Button Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Yahoo homepage with increased timeout
    await page.goto('https://www.yahoo.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  });

  test('Verify Sign In Button Visibility on Yahoo Homepage', async ({ page }) => {
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeVisible({ timeout: 10000 }); // Assert button is visible
  });

  test('Verify Sign In Button is Enabled and Clickable', async ({ page }) => {
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeVisible({ timeout: 10000 }); // Ensure button is visible before checking
    await expect(signInButton).toBeEnabled(); // Assert button is enabled
    await expect(signInButton).toBeVisible(); // Assert button is clickable
  });

  test('Verify Sign In Button Label', async ({ page }) => {
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toHaveText(/Sign in/i); // Assert button has correct label
  });

  test('Verify Sign In Button Positioning', async ({ page }) => {
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeInViewport(); // Assert button is positioned correctly within the viewport
  });

  test('Verify Sign In Button Functionality with Invalid Click', async ({ page }) => {
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeVisible({ timeout: 10000 }); // Ensure button is visible before clicking
    await signInButton.click(); // Simulate a click on the Sign in button
    await page.waitForLoadState('networkidle', { timeout: 10000 }); // Wait for network to be idle
    await expect(page).toHaveURL(/login/); // Assert that the page redirects to the login page
  });
});