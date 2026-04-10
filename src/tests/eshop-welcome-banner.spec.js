const { test, expect } = require('@playwright/test');

const TARGET_URL = 'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/';

test.describe('E-Shop Home Page - Welcome Banner', () => {
  test('should display "Welcome to E-Shop" heading when user navigates to the home page', async ({ page }) => {
    // Navigate to the application
    await page.goto(TARGET_URL);

    // Wait for the main heading to be visible
    const welcomeHeading = page.locator('h1', { hasText: 'Welcome to E-Shop' });
    await expect(welcomeHeading).toBeVisible();

    // Verify the exact text content
    await expect(welcomeHeading).toHaveText('Welcome to E-Shop');
  });
});
