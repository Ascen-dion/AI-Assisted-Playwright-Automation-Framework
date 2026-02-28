import { test, expect } from '@playwright/test';

// Generated via Playwright MCP browser interaction
// MCP recorded locators: getByRole('button'), getByLabel(), getByRole('link')

test.describe('Endpoint Clinical - Company Tab Verification (MCP Generated)', () => {
  test.beforeEach(async ({ page }) => {
    // MCP generated: await page.goto('https://www.endpointclinical.com');
    await page.goto('https://www.endpointclinical.com');
    await expect(page).toHaveTitle(/Endpoint Clinical/);
  });

  test('should display homepage with correct title', async ({ page }) => {
    await expect(page).toHaveURL('https://www.endpointclinical.com/');
    await expect(page).toHaveTitle('Home | Endpoint Clinical: Discover Your Hidden Advantage in RTSM');
  });

  test('should have Company button visible in navigation', async ({ page }) => {
    // MCP snapshot confirmed: button "Company" [ref=e17] inside navigation [ref=e7]
    const companyButton = page.getByRole('button', { name: 'Company' });
    await expect(companyButton).toBeVisible();
  });

  test('should expand Company dropdown on click', async ({ page }) => {
    // MCP generated: await page.getByRole('button', { name: 'Company' }).click();
    await page.getByRole('button', { name: 'Company' }).click();

    // MCP snapshot confirmed: button "Company" [expanded] [active] with navigation "Company" [ref=e218]
    const companyButton = page.getByRole('button', { name: 'Company' });
    await expect(companyButton).toHaveAttribute('aria-expanded', 'true');

    // MCP snapshot confirmed dropdown links: About Us, Careers, Events, Sustainability, Integrations
    const companyDropdown = page.getByLabel('Company');
    await expect(companyDropdown.getByRole('link', { name: 'About Us' })).toBeVisible();
    await expect(companyDropdown.getByRole('link', { name: 'Careers' })).toBeVisible();
    await expect(companyDropdown.getByRole('link', { name: 'Events' })).toBeVisible();
    await expect(companyDropdown.getByRole('link', { name: 'Sustainability' })).toBeVisible();
    await expect(companyDropdown.getByRole('link', { name: 'Integrations' })).toBeVisible();
  });

  test('should navigate to /company page via About Us link', async ({ page }) => {
    // MCP generated: await page.getByRole('button', { name: 'Company' }).click();
    await page.getByRole('button', { name: 'Company' }).click();

    // MCP generated: await page.getByLabel('Company').getByRole('link', { name: 'About Us' }).click();
    await page.getByLabel('Company').getByRole('link', { name: 'About Us' }).click();

    // MCP confirmed final URL and title after navigation
    await expect(page).toHaveURL('https://www.endpointclinical.com/company');
    await expect(page).toHaveTitle('About Endpoint Clinical: Your Partner in RTSM Solutions');
  });
});
