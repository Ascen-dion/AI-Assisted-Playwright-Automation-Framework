/**
 * Base Page Object for AVVA Console
 * 
 * Contains common methods shared across all AVVA page objects.
 * All AVVA page objects should extend this class.
 */

class AVVABasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL with standard wait conditions for AVVA SPA
   * @param {string} url - Target URL
   * @param {Object} options - Navigation options
   */
  async goto(url, options = {}) {
    await this.page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000,
      ...options 
    });
    // AVVA is a React SPA — wait for network idle after navigation
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  /**
   * Get current page URL
   * @returns {Promise<string>}
   */
  async getPageUrl() {
    return this.page.url();
  }

  /**
   * Get current page title
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Wait for loading spinner to disappear
   * Common pattern in AVVA for async operations
   */
  async waitForLoaderToDisappear() {
    const spinner = this.page.locator('[data-testid="loading-spinner"]').first();
    try {
      await spinner.waitFor({ state: 'hidden', timeout: 15000 });
    } catch (error) {
      // Spinner might not appear for fast operations — ignore timeout
    }
  }

  /**
   * Get toast notification message
   * @returns {Promise<string>}
   */
  async getToastMessage() {
    const toast = this.page.locator('[data-testid="success-toast"], [data-testid="error-toast"]').first();
    await toast.waitFor({ state: 'visible', timeout: 15000 });
    return await toast.textContent();
  }

  /**
   * Click main navigation link
   * @param {string} section - Section name (dashboard, launchpad, testcases, results, settings)
   */
  async clickNavLink(section) {
    const navLink = this.page.locator(`[data-testid="nav-${section}"]`).first();
    await navLink.waitFor({ state: 'visible', timeout: 15000 });
    await navLink.click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  /**
   * Check if user is authenticated (auth token present)
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const token = await this.page.evaluate(() => {
      return localStorage.getItem('authToken');
    });
    return !!token;
  }

  /**
   * Logout user (click user menu → logout)
   */
  async logout() {
    const userMenu = this.page.locator('[data-testid="user-menu"]').first();
    await userMenu.waitFor({ state: 'visible', timeout: 15000 });
    await userMenu.click();
    
    const logoutBtn = this.page.locator('[data-testid="logout-btn"]').first();
    await logoutBtn.waitFor({ state: 'visible', timeout: 15000 });
    await logoutBtn.click();
    
    // Wait for redirect to login page
    await this.page.waitForURL(/login/, { timeout: 15000 });
  }
}

module.exports = AVVABasePage;
