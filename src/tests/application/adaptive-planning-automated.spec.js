// === FILE: src/tests/application/adaptive-planning-automated.spec.js ===
const { test, expect } = require('../../fixtures');
const AdaptivePlanningPage = require('../../pages/adaptive-planning.page');
const TD = require('../../data/adaptive-planning-test-data');

test.describe('[UI] Adaptive Planning: Login & Dashboard Smoke', {
  tag: ['@smoke', '@regression', '@adaptive-planning'],
}, () => {
  let planning;

  test('[C0] Test Case 1: Login page loads with correct form fields', async ({ page }) => {
    planning = new AdaptivePlanningPage(page);
    await planning.gotoLogin();

    // Assert login form is visible
    const loginVisible = await planning.isLoginFormVisible();
    expect(loginVisible).toBe(true);

    // Assert Sign In button is visible
    const signInVisible = await planning.isSignInButtonVisible();
    expect(signInVisible).toBe(true);

    // Assert page title matches expected pattern
    await expect(page).toHaveTitle(TD.pageTitles.login);
  });

  test('[C0] Test Case 2: Successful login navigates to dashboard', async ({ page }) => {
    planning = new AdaptivePlanningPage(page);
    await planning.gotoLogin();
    await planning.loginWithDefaults();

    // Assert URL changes from login page
    await expect(page).toHaveURL(TD.urlPatterns.dashboard, { timeout: 30000 });
  });

  test('[C0] Test Case 3: Login with invalid credentials shows error', async ({ page }) => {
    planning = new AdaptivePlanningPage(page);
    await planning.gotoLogin();
    await planning.login('invalid@test.com', 'wrongpassword');

    // Assert error message appears
    const errorText = await planning.getLoginError();
    expect(errorText).toBeTruthy();
  });
});
