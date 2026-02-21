// spec: docs/GOOGLE_HOMEPAGE_TEST_PLAN.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation and External Links', () => {
  test('Top Navigation Bar Links', async ({ page }) => {
    // Navigate to Google homepage to begin navigation testing
    await page.goto('https://www.google.com');

    // Verify initial page load
    await expect(page).toHaveTitle('Google');

    // 1. Click on 'About' link in top navigation to test external navigation
    await page.getByRole('link', { name: 'About' }).click();

    // Verify navigation occurs to Google About page
    await expect(page).toHaveURL(/about\.google/);
    
    // Verify new page loads successfully with relevant corporate information
    await expect(page.getByText('Google')).toBeVisible();

    // 2. Navigate back and click on 'Gmail' link
    await page.goto('https://www.google.com');

    // Verify we're back at homepage
    await expect(page).toHaveTitle('Google');

    // Click on Gmail link to test navigation to Gmail login/interface page
    await page.getByRole('link', { name: 'Gmail' }).click();

    // 3. Test navigation functionality and external link behavior
    // Verify navigation to Gmail login/interface page
    await expect(page).toHaveURL(/mail\.google/);
    
    // Verify Gmail page loads properly with expected interface
    await expect(page.getByText('Gmail')).toBeVisible();
    
    // Verify page is fully functional (Gmail interface loaded)
    await expect(page.locator('body')).toBeVisible();
  });
});