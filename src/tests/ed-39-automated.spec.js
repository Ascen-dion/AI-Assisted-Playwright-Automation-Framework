const { test, expect } = require('@playwright/test');

test('Load GitHub Homepage', async ({ page }) => {
  try {
    await page.goto('https://github.com', { timeout: 60000 });

    // Dismiss any consent/cookie dialogs
    try {
      const consentButton = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
      await consentButton.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
    } catch (e) { /* No consent dialog present */ }

    await expect(page).toHaveTitle(/GitHub/i);
    console.log('✓ GitHub homepage loaded successfully');
  } catch (error) {
    console.error('❌ Error loading GitHub homepage:', error);
    throw error;
  }
});

test('Check for Sign in Button Presence', async ({ page }) => {
  try {
    await page.goto('https://github.com', { timeout: 60000 });

    // Dismiss any consent/cookie dialogs
    try {
      const consentButton = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
      await consentButton.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
    } catch (e) { /* No consent dialog present */ }

    const signInButton = page.getByRole('link', { name: 'Sign in' }).first();
    await expect(signInButton).toBeVisible({ timeout: 15000 });
    console.log('✓ Sign in button is present on the homepage');
  } catch (error) {
    console.error('❌ Error checking for Sign in button presence:', error);
    throw error;
  }
});

test('Check Visibility of Sign in Button', async ({ page }) => {
  try {
    await page.goto('https://github.com', { timeout: 60000 });

    // Dismiss any consent/cookie dialogs
    try {
      const consentButton = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
      await consentButton.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
    } catch (e) { /* No consent dialog present */ }

    const signInButton = page.getByRole('link', { name: 'Sign in' }).first();
    await expect(signInButton).toBeVisible({ timeout: 15000 });
    await expect(signInButton).toBeEnabled();
    console.log('✓ Sign in button is visible and clickable');
  } catch (error) {
    console.error('❌ Error checking visibility of Sign in button:', error);
    throw error;
  }
});