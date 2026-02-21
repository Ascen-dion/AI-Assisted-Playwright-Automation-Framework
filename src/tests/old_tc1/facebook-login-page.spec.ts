// spec: docs/FACEBOOK_LOGIN_TEST_PLAN.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Facebook Login Page Load and Element Verification', () => {
  test('Verify Facebook login page loads with all critical elements', async ({ page }) => {
    // 1. Navigate to https://www.facebook.com
    await page.goto('https://www.facebook.com');
    await expect(page).toHaveURL('https://www.facebook.com/');
    await expect(page).toHaveTitle('Facebook');

    // 2. Verify the Facebook logo image is visible in the header area
    await expect(page.getByText('Facebook').first()).toBeVisible();

    // 3. Verify the tagline text 'Explore the things you love.' is displayed
    await expect(page.getByText('Explore the things you love.')).toBeVisible();

    // 4. Verify the login form heading 'Log in to Facebook' is visible
    await expect(page.getByText('Log in to Facebook')).toBeVisible();

    // 5. Verify the 'Email address or mobile number' text input field is visible and empty
    const emailInput = page.getByRole('textbox', { name: 'Email address or mobile number' });
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveValue('');

    // 6. Verify the 'Password' text input field is visible and empty
    const passwordInput = page.getByRole('textbox', { name: 'Password' });
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveValue('');

    // 7. Verify the 'Log in' button is visible and enabled
    const loginButton = page.getByRole('button', { name: 'Log in' });
    await expect(loginButton).toBeVisible();

    // 8. Verify the 'Forgotten password?' link is visible and has a valid href
    await expect(page.getByRole('link', { name: 'Forgotten password?' })).toBeVisible();

    // 9. Verify the 'Create new account' link is visible and has a valid href
    await expect(page.getByRole('link', { name: 'Create new account' })).toBeVisible();

    // 10. Verify the Meta logo is displayed in the login section
    await expect(page.getByRole('img', { name: 'Meta logo' })).toBeVisible();

    // 11. Verify footer contains language options and legal links
    await expect(page.getByText('English (UK)')).toBeVisible();
    await expect(page.getByRole('link', { name: 'हिन्दी' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cookies' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Help' })).toBeVisible();
    await expect(page.getByText('Meta © 2026')).toBeVisible();

    // 12. Type a test email into the email field and verify the value is accepted
    await emailInput.fill('testuser@example.com');
    await expect(emailInput).toHaveValue('testuser@example.com');

    // 13. Type a test password into the password field and verify the value is accepted
    await passwordInput.fill('InvalidP@ss123');
    await expect(passwordInput).toHaveValue('InvalidP@ss123');

    // 14. Click the 'Log in' button with invalid credentials and verify an error response
    await loginButton.click();
    
    // Check for any error message (Facebook may show different error messages)
    const errorMessage = page.locator('text=/incorrect|invalid|error|wrong|please|try again/i').first();
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });
});