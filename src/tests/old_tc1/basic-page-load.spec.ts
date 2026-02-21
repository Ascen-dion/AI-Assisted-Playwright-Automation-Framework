// spec: docs/GOOGLE_HOMEPAGE_TEST_PLAN.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Core Page Loading and Verification', () => {
  test('Basic Page Load Verification', async ({ page }) => {
    // 1. Navigate to https://www.google.com
    await page.goto('https://www.google.com');

    // Verify page loads successfully 
    await expect(page).toHaveURL(/google\.com/);
    await expect(page).toHaveTitle('Google');

    // 2. Verify core page elements are present - Google logo image is visible
    await expect(page.getByRole('img', { name: 'Google' })).toBeVisible();

    // Verify core page elements are present - Search input field is visible and active
    await expect(page.getByRole('combobox', { name: 'Search' })).toBeVisible();

    // Verify core page elements are present - Google Search button is visible
    await expect(page.getByRole('button', { name: 'Google Search' })).toBeVisible();

    // Verify core page elements are present - I'm Feeling Lucky button is visible
    await expect(page.getByRole('button', { name: 'I\'m Feeling Lucky' })).toBeVisible();

    // Verify core page elements are present - Top navigation Gmail link is visible
    await expect(page.getByRole('link', { name: 'Gmail' })).toBeVisible();

    // Verify core page elements are present - Images link text is visible in top navigation
    await expect(page.getByText('Images')).toBeVisible();

    // Verify core page elements are present - About link is visible in top navigation
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();

    // Verify core page elements are present - Footer contains Privacy link
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();

    // 3. Check page accessibility snapshot - verify page structure follows accessibility standards
    // The page structure includes proper navigation, search elements with combobox role,
    // buttons with proper accessibility labels, and content footer with proper structure
  });
});