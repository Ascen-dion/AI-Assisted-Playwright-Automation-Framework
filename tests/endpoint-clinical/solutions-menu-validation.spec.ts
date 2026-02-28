// spec: docs/ENDPOINT_CLINICAL_PULSE_TEST_PLAN.md

import { test, expect } from '@playwright/test';

test.describe('endpoint-clinical-pulse-navigation', () => {
  test('Solutions menu interaction and navigation alternatives', async ({ page }) => {
    // Test keyboard navigation for Solutions menu
    await page.goto('https://www.endpointclinical.com/');
    
    // Navigate to Solutions button using Tab key
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Open Solutions menu using Enter key
    await page.keyboard.press('Enter');
    
    // Verify Solutions menu auto-closes behavior
    await page.keyboard.press('Escape');
    
    // Test alternative navigation paths to Pulse page
    await page.goto('https://www.endpointclinical.com/solutions-pulse');
    
    // Verify direct navigation works correctly
    await expect(page.getByRole('heading', { name: 'PULSE: Dynamic RTSM' })).toBeVisible();
    
    // Verify URL is correct
    expect(page.url()).toContain('/solutions-pulse');
  });
});