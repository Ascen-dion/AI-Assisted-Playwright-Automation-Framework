// === FILE: src/pages/adaptive-planning.page.js ===
/**
 * Page object for Workday Adaptive Planning.
 *
 * Extends BasePage for shared goto(), getPageUrl(), getPageTitle().
 * All navigation methods use gotoXxx() pattern calling super.goto(url).
 * Never assert inside page objects — assertions belong in specs.
 */

const BasePage = require('./base.page');
const loc = require('./locators/adaptive-planning.locators');
const TD = require('../data/adaptive-planning-test-data');

class AdaptivePlanningPage extends BasePage {

  // ── Navigation ─────────────────────────────────────────────────────────

  /** Navigate to the Adaptive Planning login page. */
  async gotoLogin() {
    await super.goto(TD.urls.login);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  /** Navigate to the Budget Entry - Sales page (post-login landing). */
  async gotoBudgetEntrySales() {
    await super.goto(TD.urls.budgetEntrySales);
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  // ── Authentication ─────────────────────────────────────────────────────

  /**
   * Log in to Adaptive Planning with the given credentials.
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await loc.login.usernameField(this.page).waitFor({ state: 'visible', timeout: 15000 });
    await loc.login.usernameField(this.page).fill(username);
    await loc.login.passwordField(this.page).fill(password);
    await loc.login.signInButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  /** Log in using credentials from environment / test data. */
  async loginWithDefaults() {
    await this.login(TD.credentials.username, TD.credentials.password);
  }

  // ── Login Page Helpers ─────────────────────────────────────────────────

  /** Check if the login form is visible. */
  async isLoginFormVisible() {
    try {
      await loc.login.usernameField(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  /** Get login error message text. Returns empty string if no error visible. */
  async getLoginError() {
    try {
      await loc.login.errorMessage(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return await loc.login.errorMessage(this.page).textContent();
    } catch {
      return '';
    }
  }

  /** Check if the Sign In button is visible. */
  async isSignInButtonVisible() {
    try {
      await loc.login.signInButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Budget Entry Tab Bar ───────────────────────────────────────────────

  /** Get all tab labels from the tab bar, in order. */
  async getAllTabLabels() {
    await loc.budgetTabs.tabList(this.page).waitFor({ state: 'visible', timeout: 15000 });
    const tabs = loc.budgetTabs.allTabs(this.page);
    return await tabs.allTextContents();
  }

  /** Get the count of tabs in the tab bar. */
  async getTabCount() {
    await loc.budgetTabs.tabList(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return await loc.budgetTabs.allTabs(this.page).count();
  }

  /** Get the text of the currently active tab. */
  async getActiveTabText() {
    await loc.budgetTabs.activeTab(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return (await loc.budgetTabs.activeTab(this.page).textContent()).trim();
  }

  /** Click a specific tab by name. */
  async clickTab(tabName) {
    await loc.budgetTabs.tab(this.page, tabName).click();
    await this.page.waitForTimeout(1000); // allow tab content to render
  }

  /** Check if a specific tab is the currently selected tab. */
  async isTabActive(tabName) {
    const tab = loc.budgetTabs.tab(this.page, tabName);
    const ariaSelected = await tab.getAttribute('aria-selected');
    return ariaSelected === 'true';
  }

  /** Check if the tab content area is visible and has content. */
  async isTabContentVisible() {
    try {
      await loc.budgetTabs.tabContent(this.page).waitFor({ state: 'visible', timeout: 15000 });
      const content = await loc.budgetTabs.tabContent(this.page).textContent();
      return content.trim().length > 0;
    } catch {
      return false;
    }
  }

  /** Check if the scroll-left arrow is disabled. */
  async isScrollLeftDisabled() {
    const btn = loc.budgetTabs.scrollLeft(this.page);
    const disabled = await btn.getAttribute('disabled');
    const ariaDisabled = await btn.getAttribute('aria-disabled');
    const className = await btn.getAttribute('class');
    return disabled !== null || ariaDisabled === 'true' || (className && className.includes('disabled'));
  }

  /** Check if the scroll-right arrow is visible. */
  async isScrollRightVisible() {
    try {
      await loc.budgetTabs.scrollRight(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /** Check if the scroll-left arrow is visible. */
  async isScrollLeftVisible() {
    try {
      await loc.budgetTabs.scrollLeft(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Budget Entry Header / Context ─────────────────────────────────────

  /** Get the page title text (e.g. "Budget Entry - Sales"). */
  async getBudgetPageTitle() {
    await loc.budgetHeader.pageTitle(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return (await loc.budgetHeader.pageTitle(this.page).textContent()).trim();
  }

  /** Get the current version text (e.g. "Working Budget"). */
  async getVersionText() {
    await loc.budgetHeader.versionButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
    return (await loc.budgetHeader.versionButton(this.page).textContent()).trim();
  }

  /** Get all context selector values (time, level, currency). */
  async getContextValues() {
    const time = await loc.budgetHeader.timeSelector(this.page).textContent().catch(() => '');
    const level = await loc.budgetHeader.levelSelector(this.page).textContent().catch(() => '');
    const currency = await loc.budgetHeader.currencySelector(this.page).textContent().catch(() => '');
    const version = await this.getVersionText().catch(() => '');
    return { time: time.trim(), level: level.trim(), currency: currency.trim(), version: version.trim() };
  }

  // ── Navigation Helpers ─────────────────────────────────────────────────

  /** Click the Back button in the toolbar. */
  async clickBackButton() {
    await loc.nav.backButton(this.page).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }

  // ── Dashboard Helpers ──────────────────────────────────────────────────

  /** Get the dashboard welcome message text. */
  async getDashboardWelcome() {
    try {
      await loc.dashboard.welcomeMsg(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return await loc.dashboard.welcomeMsg(this.page).textContent();
    } catch {
      return '';
    }
  }

  /** Check if the main dashboard container is visible. */
  async isDashboardVisible() {
    try {
      await loc.dashboard.container(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  /** Click a navigation menu item by visible text. */
  async clickNavItem(itemText) {
    await loc.nav.menuItem(this.page, itemText).click();
    await this.page.waitForLoadState('networkidle', { timeout: 60000 });
  }
}

module.exports = AdaptivePlanningPage;
