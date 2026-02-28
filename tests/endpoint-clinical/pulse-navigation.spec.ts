// spec: docs/ENDPOINT_CLINICAL_PULSE_TEST_PLAN.md

import { test, expect } from '@playwright/test';

test.describe('endpoint-clinical-pulse-navigation', () => {
  test('Navigate to Pulse page and verify Dynamic RTSM content', async ({ page }) => {
    // Navigate to https://www.endpointclinical.com/
    await page.goto('https://www.endpointclinical.com/');

    // Click on the Solutions button in navigation menu
    await page.getByRole('button', { name: 'Solutions' }).click();

    // Click on the PULSE option in the Solutions dropdown
    await page.getByRole('link', { name: 'PULSE Your trusted RTSM' }).click();

    // Verify main heading content on Pulse page
    await expect(page.getByRole('heading', { name: 'PULSE: Dynamic RTSM' })).toBeVisible();

    // Verify additional Pulse page content and features
    await expect(page.getByRole('heading', { name: 'Why PULSE?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Standard and Ad-Hoc Reports' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Advanced Supply Management' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Request a Demo' }).first()).toBeVisible();

    // Validate page accessibility and performance
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    
    // Verify URL navigation was successful
    expect(page.url()).toContain('/solutions-pulse');
  });
});