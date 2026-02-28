// spec: docs/ENDPOINT_CLINICAL_PULSE_TEST_PLAN.md

import { test, expect } from '@playwright/test';

test.describe('endpoint-clinical-pulse-navigation', () => {
  test('Pulse page content validation and interactive elements', async ({ page }) => {
    // Verify all expandable sections on Pulse page
    await page.goto('https://www.endpointclinical.com/solutions-pulse');
    
    // Test expandable section functionality
    await page.locator('div').filter({ hasText: 'Standard and Ad-Hoc Reports' }).nth(5).click();
    
    // Verify expanded content is visible
    await expect(page.getByText('Stay informed with 40+ pre-validated standard reports')).toBeVisible();
    
    // Test Call-to-Action buttons functionality
    await expect(page.getByRole('link', { name: 'Request a Demo' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
    
    // Validate page SEO and meta information
    await expect(page).toHaveTitle(/PULSE.*Dynamic RTSM/);
    
    // Verify proper heading hierarchy
    await expect(page.getByRole('heading', { name: 'PULSE: Dynamic RTSM', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Why PULSE?', level: 2 })).toBeVisible();
    
    // Verify additional expandable sections exist
    await expect(page.getByRole('heading', { name: 'Advanced Supply Management' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Self-Service Capabilities' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Flexible Study Workflows' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Electronic Data Change Logs' })).toBeVisible();
  });
});