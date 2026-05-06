const ElementFinder = require('./element-finder');
const aiEngine = require('./ai-engine');
const logger = require('../../utils/logger');

/**
 * AI-enhanced Page wrapper for Playwright
 * Provides intelligent automation methods
 */
class AIPage {
  constructor(page) {
    this.page = page;
    this.elementFinder = new ElementFinder(page);
    this.actionHistory = [];
    this.screenshots = [];
  }

  /**
   * Navigate to URL with AI validation
   */
  async navigateTo(url, options = {}) {
    logger.info(`Navigating to: ${url}`);
    this.recordAction('navigate', { url });

    await this.page.goto(url, {
      waitUntil: options.waitUntil || 'domcontentloaded',
      timeout: options.timeout || 30000
    });

    // Wait for page to be ready
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      logger.warn('Network idle timeout - continuing anyway');
    });

    logger.info(`Navigation complete: ${url}`);
  }

  /**
   * Fill a field using AI element detection
   */
  async fillField(description, value, options = {}) {
    logger.info(`Filling field: ${description} with value: ${value}`);
    this.recordAction('fill', { description, value });

    const element = await this.elementFinder.findElement(description, options);
    
    // Clear existing value first
    await element.clear();
    
    // Type with human-like delay
    await element.fill(value, {
      delay: options.delay || 50
    });

    logger.info(`Field filled successfully: ${description}`);
  }

  /**
   * Click an element using AI detection
   */
  async clickElement(description, options = {}) {
    logger.info(`Clicking element: ${description}`);
    this.recordAction('click', { description });

    const element = await this.elementFinder.findElement(description, options);
    
    // Scroll element into view
    await element.scrollIntoViewIfNeeded();
    
    // Click with optional modifiers
    await element.click({
      modifiers: options.modifiers || [],
      force: options.force || false,
      delay: options.delay || 0
    });

    // Wait for any navigation or network activity
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});

    logger.info(`Element clicked successfully: ${description}`);
  }

  /**
   * Verify element exists and is visible
   */
  async verifyElement(description, options = {}) {
    logger.info(`Verifying element: ${description}`);
    this.recordAction('verify', { description });

    const element = await this.elementFinder.findElement(description, options);
    
    const isVisible = await element.isVisible();
    
    if (!isVisible) {
      throw new Error(`Element found but not visible: ${description}`);
    }

    logger.info(`Element verified: ${description}`);
    return true;
  }

  /**
   * Verify text content
   */
  async verifyText(description, expectedText, options = {}) {
    logger.info(`Verifying text in ${description}: ${expectedText}`);
    this.recordAction('verifyText', { description, expectedText });

    const element = await this.elementFinder.findElement(description, options);
    const actualText = await element.textContent();

    const matches = options.exact 
      ? actualText.trim() === expectedText.trim()
      : actualText.toLowerCase().includes(expectedText.toLowerCase());

    if (!matches) {
      throw new Error(`Text mismatch. Expected: "${expectedText}", Got: "${actualText}"`);
    }

    logger.info(`Text verified: ${description}`);
    return true;
  }

  /**
   * Select option from dropdown
   */
  async selectOption(description, optionValue, options = {}) {
    logger.info(`Selecting option "${optionValue}" from ${description}`);
    this.recordAction('select', { description, optionValue });

    const element = await this.elementFinder.findElement(description, options);
    
    await element.selectOption(optionValue);

    logger.info(`Option selected: ${optionValue}`);
  }

  /**
   * Upload file
   */
  async uploadFile(description, filePath, options = {}) {
    logger.info(`Uploading file to ${description}: ${filePath}`);
    this.recordAction('upload', { description, filePath });

    const element = await this.elementFinder.findElement(description, options);
    
    await element.setInputFiles(filePath);

    logger.info(`File uploaded successfully`);
  }

  /**
   * Wait for element with AI detection
   */
  async waitForElement(description, options = {}) {
    logger.info(`Waiting for element: ${description}`);
    
    const timeout = options.timeout || 30000;
    const element = await this.elementFinder.findElement(description, { timeout });
    
    return element;
  }

  /**
   * Take screenshot with AI analysis
   */
  async takeScreenshot(name, options = {}) {
    logger.info(`Taking screenshot: ${name}`);

    const screenshot = await this.page.screenshot({
      path: options.path,
      fullPage: options.fullPage || false,
      type: options.type || 'png'
    });

    this.screenshots.push({
      name,
      timestamp: new Date(),
      buffer: screenshot
    });

    // Optional AI analysis
    if (options.analyze && options.expectedState) {
      const analysis = await aiEngine.analyzeScreenshot(
        screenshot,
        options.expectedState
      );
      logger.info(`Screenshot analysis: ${JSON.stringify(analysis)}`);
      return analysis;
    }

    return screenshot;
  }

  /**
   * Validate page state using AI
   */
  async validatePageState(expectedState) {
    logger.info(`Validating page state: ${expectedState}`);

    const screenshot = await this.page.screenshot();
    const analysis = await aiEngine.analyzeScreenshot(screenshot, expectedState);

    if (!analysis.matches) {
      throw new Error(`Page state validation failed: ${analysis.issues.join(', ')}`);
    }

    logger.info('Page state validated successfully');
    return analysis;
  }

  /**
   * Execute custom script
   */
  async executeScript(script) {
    logger.info('Executing custom script');
    this.recordAction('script', { script });

    const result = await this.page.evaluate(script);
    return result;
  }

  /**
   * Get page information
   */
  async getPageInfo() {
    const info = {
      url: this.page.url(),
      title: await this.page.title(),
      html: await this.page.content()
    };
    return info;
  }

  /**
   * Hover over element
   */
  async hoverElement(description, options = {}) {
    logger.info(`Hovering over: ${description}`);
    this.recordAction('hover', { description });

    const element = await this.elementFinder.findElement(description, options);
    await element.hover();

    logger.info(`Hover complete: ${description}`);
  }

  /**
   * Double click element
   */
  async doubleClickElement(description, options = {}) {
    logger.info(`Double clicking: ${description}`);
    this.recordAction('doubleClick', { description });

    const element = await this.elementFinder.findElement(description, options);
    await element.dblclick();

    logger.info(`Double click complete: ${description}`);
  }

  /**
   * Right click element
   */
  async rightClickElement(description, options = {}) {
    logger.info(`Right clicking: ${description}`);
    this.recordAction('rightClick', { description });

    const element = await this.elementFinder.findElement(description, options);
    await element.click({ button: 'right' });

    logger.info(`Right click complete: ${description}`);
  }

  /**
   * Press keyboard key
   */
  async pressKey(key) {
    logger.info(`Pressing key: ${key}`);
    this.recordAction('pressKey', { key });

    await this.page.keyboard.press(key);
  }

  /**
   * Type text with human-like delay
   */
  async typeText(text, delay = 50) {
    logger.info(`Typing text: ${text}`);
    this.recordAction('type', { text });

    await this.page.keyboard.type(text, { delay });
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(options = {}) {
    logger.info('Waiting for navigation');
    
    await this.page.waitForNavigation({
      waitUntil: options.waitUntil || 'domcontentloaded',
      timeout: options.timeout || 30000
    });
  }

  /**
   * Clear element finder cache
   */
  clearCache() {
    this.elementFinder.clearCache();
  }

  /**
   * Record action for history
   */
  recordAction(action, details) {
    this.actionHistory.push({
      action,
      details,
      timestamp: new Date()
    });
  }

  /**
   * Get action history
   */
  getActionHistory() {
    return this.actionHistory;
  }

  /**
   * Get all screenshots
   */
  getScreenshots() {
    return this.screenshots;
  }
}

module.exports = AIPage;
