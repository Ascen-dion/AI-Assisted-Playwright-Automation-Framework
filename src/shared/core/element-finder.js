const aiEngine = require('./ai-engine');
const logger = require('../../utils/logger');

/**
 * Smart element finder with AI-powered fallback strategies
 */
class ElementFinder {
  constructor(page) {
    this.page = page;
    this.selectorCache = new Map();
    this.retryAttempts = 3;
  }

  /**
   * Find element using AI-assisted strategies
   * @param {string} description - Natural language description
   * @param {Object} options - Finding options
   * @returns {Promise<ElementHandle>} - Found element
   */
  async findElement(description, options = {}) {
    const {
      timeout = 30000,
      enableAI = true,
      enableSelfHealing = true
    } = options;

    logger.info(`Finding element: ${description}`);

    // Check cache first
    const cacheKey = this.getCacheKey(description);
    if (this.selectorCache.has(cacheKey)) {
      try {
        const cachedSelector = this.selectorCache.get(cacheKey);
        const element = await this.trySelector(cachedSelector, timeout);
        if (element) {
          logger.info(`Element found using cached selector: ${cachedSelector}`);
          return element;
        }
      } catch (error) {
        logger.warn(`Cached selector failed, clearing cache for: ${description}`);
        this.selectorCache.delete(cacheKey);
      }
    }

    // Try standard strategies first
    // Use shorter timeout for each strategy to allow all to be tried
    const strategyTimeout = Math.min(timeout / 6, 5000); // Max 5 seconds per strategy
    
    const strategies = [
      () => this.findByTestId(description, strategyTimeout),
      () => this.findByLabel(description, strategyTimeout),
      () => this.findByPlaceholder(description, strategyTimeout),
      () => this.findByRole(description, strategyTimeout),
      () => this.findByText(description, strategyTimeout)
    ];

    for (const strategy of strategies) {
      try {
        const element = await strategy();
        if (element) {
          logger.info(`Element found using standard strategy`);
          return element;
        }
      } catch (error) {
        // Continue to next strategy
      }
    }

    // If standard strategies fail and AI is enabled, use AI
    if (enableAI) {
      try {
        const element = await this.findUsingAI(description, timeout);
        if (element) {
          return element;
        }
      } catch (error) {
        logger.error(`AI finding failed: ${error.message}`);
      }
    }

    // Self-healing attempt if enabled
    if (enableSelfHealing && this.selectorCache.has(cacheKey)) {
      const element = await this.attemptSelfHealing(description, timeout);
      if (element) {
        return element;
      }
    }

    throw new Error(`Could not find element: ${description} after all strategies`);
  }

  /**
   * Find element using AI
   */
  async findUsingAI(description, timeout) {
    logger.info(`Using AI to find: ${description}`);

    const pageHTML = await this.page.content();
    const aiResult = await aiEngine.findElementSelector(pageHTML, description);

    // Try primary selector
    let element = await this.trySelector(aiResult.primarySelector, timeout);
    
    if (!element) {
      // Try fallback selectors
      for (const fallbackSelector of aiResult.fallbackSelectors || []) {
        element = await this.trySelector(fallbackSelector, timeout);
        if (element) {
          logger.info(`Element found using fallback selector: ${fallbackSelector}`);
          break;
        }
      }
    }

    if (element) {
      // Cache the working selector
      const cacheKey = this.getCacheKey(description);
      this.selectorCache.set(cacheKey, aiResult.primarySelector);
      logger.info(`Cached selector for future use: ${aiResult.primarySelector}`);
    }

    return element;
  }

  /**
   * Attempt self-healing when selector fails
   */
  async attemptSelfHealing(description, timeout) {
    logger.info(`Attempting self-healing for: ${description}`);

    const cacheKey = this.getCacheKey(description);
    const lastKnownSelector = this.selectorCache.get(cacheKey);
    const pageHTML = await this.page.content();

    const healingResult = await aiEngine.selfHealSelector(
      pageHTML,
      lastKnownSelector,
      description
    );

    // Try new suggested selectors
    for (const newSelector of healingResult.newSelectors) {
      const element = await this.trySelector(newSelector, timeout);
      if (element) {
        logger.info(`Self-healing successful with: ${newSelector}`);
        this.selectorCache.set(cacheKey, newSelector);
        return element;
      }
    }

    return null;
  }

  /**
   * Try a specific selector
   */
  async trySelector(selector, timeout) {
    try {
      // Determine if CSS or XPath
      const isXPath = selector.startsWith('/') || selector.startsWith('(');
      
      if (isXPath) {
        const element = await this.page.waitForSelector(`xpath=${selector}`, {
          timeout,
          state: 'visible'
        }).catch(() => null);
        return element;
      } else {
        const element = await this.page.waitForSelector(selector, {
          timeout,
          state: 'visible'
        }).catch(() => null);
        return element;
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * Find by text content
   */
  async findByText(description, timeout) {
    // Extract potential text from description
    const textMatches = description.match(/'([^']+)'|"([^"]+)"/);
    const searchText = textMatches ? (textMatches[1] || textMatches[2]) : description;

    try {
      const element = await this.page.getByText(searchText, { exact: false }).first();
      await element.waitFor({ state: 'visible', timeout });
      return element;
    } catch (error) {
      return null;
    }
  }

  /**
   * Find by role
   */
  async findByRole(description, timeout) {
    const roles = ['button', 'link', 'textbox', 'checkbox', 'radio', 'combobox'];
    
    for (const role of roles) {
      if (description.toLowerCase().includes(role)) {
        try {
          const element = await this.page.getByRole(role).first();
          await element.waitFor({ state: 'visible', timeout });
          return element;
        } catch (error) {
          continue;
        }
      }
    }
    return null;
  }

  /**
   * Find by placeholder
   */
  async findByPlaceholder(description, timeout) {
    if (description.toLowerCase().includes('placeholder')) {
      try {
        const element = await this.page.getByPlaceholder(description).first();
        await element.waitFor({ state: 'visible', timeout });
        return element;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  /**
   * Find by label
   */
  async findByLabel(description, timeout) {
    try {
      const element = await this.page.getByLabel(description).first();
      await element.waitFor({ state: 'visible', timeout });
      return element;
    } catch (error) {
      return null;
    }
  }

  /**
   * Find by test ID
   */
  async findByTestId(description, timeout) {
    // Try common test id patterns
    const testIdPatterns = [
      description.toLowerCase().replace(/\s+/g, '-'),
      description.toLowerCase().replace(/\s+/g, '_'),
      description.replace(/\s+/g, ''),
      description // Also try the exact description
    ];

    for (const testId of testIdPatterns) {
      try {
        // Try data-testid attribute
        const element = await this.page.getByTestId(testId);
        await element.waitFor({ state: 'visible', timeout });
        return element;
      } catch (error) {
        // Try id attribute
        try {
          const elementById = await this.page.locator(`#${testId}`);
          await elementById.waitFor({ state: 'visible', timeout });
          return elementById;
        } catch (idError) {
          // Try data-test attribute
          try {
            const elementByDataTest = await this.page.locator(`[data-test="${testId}"]`);
            await elementByDataTest.waitFor({ state: 'visible', timeout });
            return elementByDataTest;
          } catch (dataTestError) {
            // Try class name
            try {
              const elementByClass = await this.page.locator(`.${testId}`);
              await elementByClass.first().waitFor({ state: 'visible', timeout });
              return elementByClass.first();
            } catch (classError) {
              continue;
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * Generate cache key
   */
  getCacheKey(description) {
    return description.toLowerCase().trim();
  }

  /**
   * Clear selector cache
   */
  clearCache() {
    this.selectorCache.clear();
    logger.info('Selector cache cleared');
  }
}

module.exports = ElementFinder;
