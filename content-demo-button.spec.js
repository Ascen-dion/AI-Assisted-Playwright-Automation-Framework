const { test, expect } = require('@playwright/test');

test.describe('Endpoint Clinical REQUEST DEMO Button Verification', () => {
  test('Verify REQUEST DEMO Button in Main Content', async ({ page }) => {
    // Step 1: Navigate to the Endpoint Clinical homepage
    await page.goto('https://www.endpointclinical.com/', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });

    // Step 2: Handle cookie consent banner
    try {
      const acceptCookiesButton = page.getByRole('link', { name: 'Accept All' });
      await acceptCookiesButton.click({ timeout: 5000 });
    } catch (error) {
      // Cookie banner may not be present
      console.log('No cookie banner found or already accepted');
    }

    // Step 3: Verify the page title contains 'Endpoint Clinical'
    await expect(page).toHaveTitle(/Endpoint Clinical/);
    console.log('✓ Page title verified');

    // Step 4: Verify the hero section heading is visible
    await expect(page.getByRole('heading', { name: /Your hidden advantage in RTSM/ })).toBeVisible();
    console.log('✓ Hero section with main heading is displayed');

    // Step 5: Verify the Request a Demo button is visible in the main content
    const requestDemoButton = page.getByRole('link', { name: 'Request a Demo' }).nth(1); // Select the main content button (not navigation)
    await expect(requestDemoButton).toBeVisible({ timeout: 15000 });
    console.log('✓ Request a Demo button is visible in the main content');

    // Step 6: Verify the button is clickable and has proper href
    const href = await requestDemoButton.getAttribute('href');
    expect(href).toBe('/request-a-demo');
    console.log('✓ Request a Demo button has correct href: /request-a-demo');

    // Step 7: Test button functionality by clicking it
    await requestDemoButton.click();
    console.log('✓ Request a Demo button clicked successfully');

    // Step 8: Verify navigation to demo request page
    await expect(page).toHaveURL(/.*\/request-a-demo/);
    console.log('✓ Successfully navigated to demo request page');

    // Step 9: Verify the demo page loads with correct content
    await expect(page).toHaveTitle(/Request a Demo.*Endpoint Clinical/);
    await expect(page.getByRole('heading', { name: 'Request a Demo', level: 1 })).toBeVisible();
    console.log('✓ Demo request page loaded with correct heading');

    // Step 10: Verify demo page contains expected content
    await expect(page.getByText(/Get an insider's view of our RTSM in action/)).toBeVisible();
    console.log('✓ Demo page contains expected descriptive content');
  });
});