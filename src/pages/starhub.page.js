// === FILE: src/pages/starhub.page.js ===
/**
 * Page object for StarHub Personal website (www.starhub.com/personal.html).
 *
 * Extends BasePage for shared goto(), getPageUrl(), getPageTitle().
 * Never assert inside page objects — assertions belong in specs/steps.
 */

const BasePage = require('./base.page');
const loc = require('./locators/starhub.locators');
const TD = require('../data/starhub-test-data');

class StarHubPage extends BasePage {

  // ── Navigation ─────────────────────────────────────────────────────────

  /** Navigate to the StarHub Personal home page. */
  async gotoHome() {
    await super.goto(TD.urls.home);
    // Wait for any visible interactive element instead of a single button
    await this.page.locator('nav').first().waitFor({ state: 'visible', timeout: 45000 });
  }

  /** Navigate to the StarHub Broadband page. */
  async gotoBroadband() {
    await super.goto(TD.urls.broadband);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  // ── Cookie Consent ─────────────────────────────────────────────────────

  /** Dismiss the cookie consent banner and any overlay if visible. */
  async dismissCookieConsent() {
    try {
      await loc.cookieConsent.gotItButton(this.page).click({ timeout: 5000 });
      await this.page.waitForTimeout(500);
    } catch {
      // Banner may not appear — non-fatal
    }
    // Dismiss global important message overlay that blocks clicks
    try {
      const overlay = this.page.locator('.global-important-message-overlay');
      if (await overlay.isVisible({ timeout: 2000 })) {
        await overlay.evaluate(el => el.remove());
      }
    } catch {
      // Overlay may not appear — non-fatal
    }
  }

  // ── Top Navigation Helpers ─────────────────────────────────────────────

  /** Check if the top navigation Personal link is visible. */
  async isTopNavVisible() {
    try {
      await loc.topNav.personalLink(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  /** Click a top navigation link by name (Personal, SME, Enterprise, About Us). */
  async clickTopNavLink(name) {
    await this.page.getByRole('link', { name }).first().click({ force: true, timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
  }

  // ── Main Navigation Helpers ────────────────────────────────────────────

  /** Check if the main navigation menu is visible. */
  async isMainNavVisible() {
    try {
      await loc.mainNav.mobileButton(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  /** Click a main navigation menu button by name. */
  async clickMainNavButton(name) {
    await this.page.getByRole('button', { name }).click();
  }

  /** Check if Support link is visible. */
  async isSupportLinkVisible() {
    try {
      const supportEl = this.page.getByText('Support', { exact: true }).first();
      await supportEl.waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Hero / Content Helpers ─────────────────────────────────────────────

  /** Get the hero section heading text. */
  async getHeroHeadingText() {
    try {
      // The carousel heading may take time to render content
      const heading = this.page.getByRole('heading').first();
      await heading.waitFor({ state: 'visible', timeout: 15000 });
      // Wait for text content to populate (carousel lazy-loads)
      let text = '';
      for (let i = 0; i < 10; i++) {
        text = (await heading.textContent() || '').trim();
        if (text) break;
        await this.page.waitForTimeout(500);
      }
      return text;
    } catch {
      return '';
    }
  }

  /** Check if a section heading is visible by text pattern. */
  async isSectionHeadingVisible(headingPattern) {
    try {
      await this.page.getByRole('heading', { name: headingPattern }).first()
        .waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Value Propositions ─────────────────────────────────────────────────

  /** Check if all four value proposition items are visible. */
  async areValuePropsVisible() {
    try {
      await loc.valueProps.peaceOfMind(this.page).waitFor({ state: 'visible', timeout: 15000 });
      await loc.valueProps.fullFlexibility(this.page).waitFor({ state: 'visible', timeout: 5000 });
      await loc.valueProps.multiServiceSavings(this.page).waitFor({ state: 'visible', timeout: 5000 });
      await loc.valueProps.hubCare(this.page).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // ── Footer Helpers ─────────────────────────────────────────────────────

  /** Check if the footer copyright notice is visible. */
  async isFooterVisible() {
    try {
      await loc.footer.copyright(this.page).scrollIntoViewIfNeeded();
      await loc.footer.copyright(this.page).waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  /** Get footer copyright text. */
  async getFooterCopyrightText() {
    try {
      await loc.footer.copyright(this.page).scrollIntoViewIfNeeded();
      return (await loc.footer.copyright(this.page).textContent()).trim();
    } catch {
      return '';
    }
  }
}

module.exports = StarHubPage;
