const { test, expect } = require('@playwright/test');

// ─────────────────────────────────────────────
// Page Object – Login Page
// Centralises all selectors and actions so
// tests stay focused on intent, not mechanics.
// ─────────────────────────────────────────────
class LoginPage {
  constructor(page) {
    this.page = page;

    // Selectors with fallback chains for self-healing resilience
    this.usernameInput = page.locator('[data-test="username"], #user-name').first();
    this.passwordInput = page.locator('[data-test="password"], #password').first();
    this.loginButton   = page.locator('[data-test="login-button"], #login-button, input[type="submit"]').first();
    this.errorMessage  = page.locator('[data-test="error"], .error-message-container, [role="alert"]').first();
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await this._dismissConsentDialogIfPresent();
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async _dismissConsentDialogIfPresent() {
    const consentButton = this.page
      .getByRole('button', { name: /accept|agree|got it|ok|continue/i })
      .first();
    try {
      if (await consentButton.isVisible({ timeout: 2000 })) {
        await consentButton.click();
        await this.page.waitForLoadState('domcontentloaded');
      }
    } catch {
      // No consent dialog – continue
    }
  }
}

// ─────────────────────────────────────────────
// Inventory Page Object
// ─────────────────────────────────────────────
class InventoryPage {
  constructor(page) {
    this.page = page;
    this.container  = page.locator('.inventory_container, [data-test="inventory-container"]').first();
    this.items      = page.locator('[data-test="inventory-item"], .inventory_item');
    this.sortSelect = page.locator('[data-test="product_sort_container"]').first();
  }

  async isLoaded() {
    await expect(this.page).toHaveURL(/inventory/i, { timeout: 15000 });
    await expect(this.container).toBeVisible({ timeout: 10000 });
  }
}

// ─────────────────────────────────────────────
// Test Suite
// ─────────────────────────────────────────────
test.describe('SauceDemo – Login Tests', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Log page errors without failing the test
    page.on('pageerror', (err) => console.warn('[page error]', err.message));
  });

  // ── TC1: Navigation ──────────────────────────────────────────────────────────
  test('TC1 – User can navigate to https://www.saucedemo.com', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await expect(page).toHaveTitle(/swag labs/i);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  // ── TC2: Page Load Performance ───────────────────────────────────────────────
  test('TC2 – Login page loads within 15 seconds', async ({ page }) => {
    const start = Date.now();

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Measure from navigation start until the username field is interactive
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 10000 });
    const loadTime = Date.now() - start;

    console.log(`  Login page ready in ${loadTime} ms`);
    expect(loadTime, `Expected page to load within 15 000 ms, got ${loadTime} ms`).toBeLessThan(15000);

    await expect(page).toHaveTitle(/swag labs/i);
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  // ── TC3: Successful Login ─────────────────────────────────────────────────────
  test('TC3 – Valid credentials navigate to the inventory page', async ({ page }) => {
    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.isLoaded();

    // At least one product must be visible
    await expect(inventoryPage.items.first()).toBeVisible();
    expect(await inventoryPage.items.count()).toBeGreaterThan(0);
  });

  // ── TC4: Invalid Login Error ──────────────────────────────────────────────────
  test('TC4 – Invalid credentials display an error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('invalid_user', 'invalid_password');

    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });

    const text = (await loginPage.errorMessage.textContent()).toLowerCase();
    expect(text).toMatch(/username and password do not match|invalid|login failed|incorrect/);
  });

  // ── TC5: Cross-Browser Smoke ──────────────────────────────────────────────────
  test('TC5 – Site is accessible and login flow works in the current browser', async ({ page, browserName }) => {
    console.log(`  Running cross-browser smoke on: ${browserName}`);

    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();

    // Verify login form is fully rendered
    await expect(page).toHaveTitle(/swag labs/i);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // Verify fields accept input correctly
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.passwordInput.fill('secret_sauce');
    await expect(loginPage.usernameInput).toHaveValue('standard_user');
    await expect(loginPage.passwordInput).toHaveValue('secret_sauce');

    // Complete login and verify landing page
    await loginPage.loginButton.click();
    await inventoryPage.isLoaded();
  });
});
