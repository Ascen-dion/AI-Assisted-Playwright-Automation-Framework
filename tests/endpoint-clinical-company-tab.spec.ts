import { test, expect } from '@playwright/test';

test.describe('Endpoint Clinical - Company Tab Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.endpointclinical.com');
  });

  test('should load the homepage successfully', async ({ page }) => {
    await expect(page).toHaveURL('https://www.endpointclinical.com/');
    await expect(page).toHaveTitle(/Endpoint Clinical/);
  });

  test('should display the Company tab in the navigation', async ({ page }) => {
    const companyTab = page.getByRole('button', { name: 'Company' });
    await expect(companyTab).toBeVisible();
  });

  test('should expand the Company dropdown when clicked', async ({ page }) => {
    const companyTab = page.getByRole('button', { name: 'Company' });

    // Verify tab is present and collapsed initially
    await expect(companyTab).toBeVisible();

    // Click the Company tab
    await companyTab.click();

    // Verify the dropdown expanded
    await expect(companyTab).toHaveAttribute('aria-expanded', 'true');

    // Verify the Company navigation submenu is visible
    const companyNav = page.getByRole('navigation', { name: 'Company' });
    await expect(companyNav).toBeVisible();
  });

  test('should navigate to /company page from Company dropdown', async ({ page }) => {
    // Click the Company tab to open the dropdown
    await page.getByRole('button', { name: 'Company' }).click();

    // The Company dropdown expands with navigation links — click "About Us" which goes to /company
    const companyNav = page.getByRole('navigation', { name: 'Company' });
    await expect(companyNav).toBeVisible();

    await companyNav.getByRole('link', { name: 'About Us' }).click();

    // Verify navigation to the company page
    await expect(page).toHaveURL(/.*\/company/);
  });
});
