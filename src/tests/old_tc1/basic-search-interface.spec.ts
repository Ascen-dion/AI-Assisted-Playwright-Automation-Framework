// spec: docs/GOOGLE_HOMEPAGE_TEST_PLAN.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Search Functionality Testing', () => {
  test('Basic Search Input and Interface', async ({ page }) => {
    // Navigate to Google homepage to begin search input testing
    await page.goto('https://www.google.com');

    // 1. Click on the search input field to ensure it receives focus
    await page.getByRole('combobox', { name: 'Search' }).click();

    // Verify search input field becomes focused and ready to receive text
    await expect(page.getByRole('combobox', { name: 'Search' })).toBeFocused();

    // 2. Type 'hello world' in the search input to test typing functionality
    await page.getByRole('combobox', { name: 'Search' }).fill('hello world');

    // Verify that 'hello world' text appears in the search input field as typed
    await expect(page.getByRole('combobox', { name: 'Search' })).toHaveValue('hello world');

    // 3. Clear the search input and verify empty state
    await page.getByRole('combobox', { name: 'Search' }).fill('');

    // Verify that the input field becomes empty when cleared
    await expect(page.getByRole('combobox', { name: 'Search' })).toHaveValue('');

    // Verify input field remains functional after clearing
    await expect(page.getByRole('combobox', { name: 'Search' })).toBeVisible();
  });
});