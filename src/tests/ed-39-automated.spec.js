const { test, expect } = require('@playwright/test');

test('Load GitHub Homepage', async ({ page }) => {
  try {
    await page.goto('https://github.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });
    
    // Dismiss any consent/cookie dialogs
    try {
      const consentBtn = page.getByRole('button', { name: /accept|agree|consent|got it|I agree/i }).first();
      await consentBtn.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
    } catch (e) { /* No consent dialog */ }

    await expect(page).toHaveURL(/github/i);
    await expect(page).toHaveTitle(/GitHub/i);
    console.log('✓ GitHub homepage loaded successfully');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
});

test('Check for Sign in Button', async ({ page }) => {
  try {
    await page.goto('https://github.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });

    const signInButton = page.getByRole('link', { name: 'Sign in' }).first();
    await expect(signInButton).toBeVisible({ timeout: 15000 });
    console.log('✓ Sign in button is present in the top navigation area');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
});

test('Verify Visibility of Sign in Button', async ({ page }) => {
  try {
    await page.goto('https://github.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });

    const signInButton = page.getByRole('link', { name: 'Sign in' }).first();
    await expect(signInButton).toBeVisible({ timeout: 15000 });
    await expect(signInButton).toBeEnabled();
    console.log('✓ Sign in button is clearly visible and accessible to users');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
});