// === FILE: src/fixtures/auto-healing.js ===
/**
 * 🔧 Automatic Self-Healing Fixture
 * 
 * Extends Playwright's page fixture to add real-time selector healing during test execution.
 * 
 * Features:
 * - Automatic fallback selector strategies (ARIA, text, CSS, XPath)
 * - Optional real-time AI-powered selector generation
 * - Healing history tracking and learning
 * - Zero test code changes required
 * 
 * Usage in spec files:
 *   const { test, expect } = require('../../fixtures/auto-healing');
 * 
 * Configuration (.env):
 *   AUTO_HEALING_ENABLED=true          # Enable automatic healing (default: true)
 *   AUTO_HEALING_USE_AI=false          # Use AI for real-time healing (default: false, expensive)
 *   AUTO_HEALING_MAX_ATTEMPTS=3        # Max fallback attempts before failing (default: 3)
 *   AUTO_HEALING_TIMEOUT=5000          # Timeout per healing attempt in ms (default: 5000)
 */

const { test: base, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const aiEngine = require('../core/ai-engine');

const HEALING_ENABLED = process.env.AUTO_HEALING_ENABLED !== 'false';
const USE_AI_HEALING = process.env.AUTO_HEALING_USE_AI === 'true';
const MAX_ATTEMPTS = parseInt(process.env.AUTO_HEALING_MAX_ATTEMPTS || '3', 10);
const HEALING_TIMEOUT = parseInt(process.env.AUTO_HEALING_TIMEOUT || '5000', 10);
const HEALING_HISTORY_PATH = path.resolve(__dirname, '../../test-results/healing-history.json');
const HEALING_QUEUE_PATH = path.resolve(__dirname, '../../test-results/healing-queue.json');

/**
 * Healing strategies in priority order
 */
class HealingStrategies {
  constructor(page) {
    this.page = page;
  }

  /**
   * Strategy 1: Try ARIA role + accessible name
   * Most stable for UI elements
   */
  async tryARIA(originalLocator, elementHint) {
    const strategies = [];
    
    // Extract text from original selector if possible
    const textMatch = originalLocator.match(/['"]([^'"]+)['"]/);
    if (textMatch) {
      const text = textMatch[1];
      strategies.push(
        this.page.getByRole('button', { name: text }),
        this.page.getByRole('link', { name: text }),
        this.page.getByRole('button', { name: new RegExp(text, 'i') }),
        this.page.getByRole('link', { name: new RegExp(text, 'i') })
      );
    }
    
    return strategies;
  }

  /**
   * Strategy 2: Try visible text matching
   */
  async tryText(originalLocator, elementHint) {
    const strategies = [];
    
    const textMatch = originalLocator.match(/['"]([^'"]+)['"]/);
    if (textMatch) {
      const text = textMatch[1];
      strategies.push(
        this.page.getByText(text, { exact: true }),
        this.page.getByText(text, { exact: false }),
        this.page.getByText(new RegExp(text, 'i')),
        this.page.getByLabel(text),
        this.page.getByPlaceholder(text)
      );
    }
    
    return strategies;
  }

  /**
   * Strategy 3: Try CSS variations
   */
  async tryCSS(originalLocator, elementHint) {
    const strategies = [];
    
    // Handle common CSS selector variations
    if (originalLocator.includes('.')) {
      const className = originalLocator.replace(/\./g, '');
      strategies.push(
        this.page.locator(`[class*="${className}"]`),
        this.page.locator(`[class~="${className}"]`)
      );
    }
    
    if (originalLocator.includes('#')) {
      const idName = originalLocator.replace(/#/g, '');
      strategies.push(
        this.page.locator(`[id*="${idName}"]`)
      );
    }
    
    // Try data attributes
    strategies.push(
      this.page.locator(`[data-testid*="${elementHint}"]`),
      this.page.locator(`[data-test*="${elementHint}"]`),
      this.page.locator(`[data-cy*="${elementHint}"]`)
    );
    
    return strategies;
  }

  /**
   * Strategy 4: Try XPath fallbacks
   */
  async tryXPath(originalLocator, elementHint) {
    const strategies = [];
    
    const textMatch = originalLocator.match(/['"]([^'"]+)['"]/);
    if (textMatch) {
      const text = textMatch[1];
      strategies.push(
        this.page.locator(`xpath=//*[contains(text(), "${text}")]`),
        this.page.locator(`xpath=//*[contains(@class, "${elementHint}")]`),
        this.page.locator(`xpath=//*[contains(@id, "${elementHint}")]`)
      );
    }
    
    return strategies;
  }
}

/**
 * Healing history manager
 */
class HealingHistory {
  constructor() {
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      if (fs.existsSync(HEALING_HISTORY_PATH)) {
        return JSON.parse(fs.readFileSync(HEALING_HISTORY_PATH, 'utf8'));
      }
    } catch (error) {
      console.warn('[AutoHeal] Could not load healing history:', error.message);
    }
    return [];
  }

  saveHistory() {
    try {
      fs.mkdirSync(path.dirname(HEALING_HISTORY_PATH), { recursive: true });
      fs.writeFileSync(HEALING_HISTORY_PATH, JSON.stringify(this.history, null, 2));
    } catch (error) {
      console.warn('[AutoHeal] Could not save healing history:', error.message);
    }
  }

  findSuccessfulHealing(originalSelector, testFile) {
    return this.history
      .filter(h => h.success && h.oldSelector === originalSelector && h.testFile === testFile)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  }

  recordHealing(record) {
    this.history.push({
      ...record,
      timestamp: new Date().toISOString()
    });
    this.saveHistory();
  }
}

/**
 * Smart locator wrapper with automatic healing
 */
class HealingLocator {
  constructor(originalLocator, originalSelector, elementHint, page, testInfo) {
    this.originalLocator = originalLocator;
    this.originalSelector = originalSelector;
    this.elementHint = elementHint;
    this.page = page;
    this.testInfo = testInfo;
    this.strategies = new HealingStrategies(page);
    this.history = new HealingHistory();
  }

  async tryHealing() {
    if (!HEALING_ENABLED) {
      throw new Error(`[AutoHeal] Element not found: ${this.originalSelector}`);
    }

    console.log(`[AutoHeal] 🔍 Attempting to heal selector: ${this.originalSelector}`);

    // Step 1: Check healing history for this exact selector
    const historicalHealing = this.history.findSuccessfulHealing(
      this.originalSelector,
      this.testInfo.file
    );

    if (historicalHealing) {
      console.log(`[AutoHeal] 📚 Found successful healing in history, trying: ${historicalHealing.newSelector}`);
      try {
        const locator = this.page.locator(historicalHealing.newSelector);
        await locator.waitFor({ state: 'visible', timeout: HEALING_TIMEOUT });
        console.log(`[AutoHeal] ✅ History-based healing succeeded!`);
        return { success: true, locator, strategy: 'history', selector: historicalHealing.newSelector };
      } catch (error) {
        console.log(`[AutoHeal] ⚠️  Historical selector no longer works`);
      }
    }

    // Step 2: Try intelligent fallback strategies
    const fallbackStrategies = [
      { name: 'ARIA', fn: () => this.strategies.tryARIA(this.originalSelector, this.elementHint) },
      { name: 'Text', fn: () => this.strategies.tryText(this.originalSelector, this.elementHint) },
      { name: 'CSS', fn: () => this.strategies.tryCSS(this.originalSelector, this.elementHint) },
      { name: 'XPath', fn: () => this.strategies.tryXPath(this.originalSelector, this.elementHint) }
    ];

    for (const { name, fn } of fallbackStrategies) {
      const locators = await fn();
      
      for (let i = 0; i < locators.length && i < MAX_ATTEMPTS; i++) {
        try {
          console.log(`[AutoHeal] 🔧 Trying ${name} strategy (${i + 1}/${locators.length})...`);
          await locators[i].waitFor({ state: 'visible', timeout: HEALING_TIMEOUT });
          
          const newSelector = locators[i].toString();
          console.log(`[AutoHeal] ✅ ${name} strategy succeeded with: ${newSelector}`);
          
          // Record successful healing
          this.history.recordHealing({
            testFile: this.testInfo.file,
            testTitle: this.testInfo.title,
            oldSelector: this.originalSelector,
            newSelector,
            strategy: name,
            success: true,
            elementHint: this.elementHint
          });
          
          return { success: true, locator: locators[i], strategy: name, selector: newSelector };
        } catch (error) {
          // Strategy failed, try next
          continue;
        }
      }
    }

    // Step 3: Optional AI-powered healing (expensive, use sparingly)
    if (USE_AI_HEALING) {
      try {
        console.log(`[AutoHeal] 🤖 Attempting AI-powered healing...`);
        const pageContent = await this.page.content();
        
        const aiResult = await aiEngine.selfHealSelector(
          pageContent,
          this.originalSelector,
          this.elementHint
        );

        if (aiResult.newSelectors && aiResult.newSelectors.length > 0) {
          for (const newSelector of aiResult.newSelectors.slice(0, 2)) {
            try {
              const locator = this.page.locator(newSelector);
              await locator.waitFor({ state: 'visible', timeout: HEALING_TIMEOUT });
              
              console.log(`[AutoHeal] ✅ AI healing succeeded with: ${newSelector}`);
              
              this.history.recordHealing({
                testFile: this.testInfo.file,
                testTitle: this.testInfo.title,
                oldSelector: this.originalSelector,
                newSelector,
                strategy: 'AI',
                success: true,
                elementHint: this.elementHint,
                aiDiagnosis: aiResult.diagnosis
              });
              
              return { success: true, locator, strategy: 'AI', selector: newSelector };
            } catch (error) {
              continue;
            }
          }
        }
      } catch (aiError) {
        console.log(`[AutoHeal] ⚠️  AI healing failed: ${aiError.message}`);
      }
    }

    // Step 4: All strategies failed - queue for offline batch repair
    this.enqueueForOfflineHealing();
    
    console.log(`[AutoHeal] ❌ All healing strategies exhausted for: ${this.originalSelector}`);
    return { success: false };
  }

  enqueueForOfflineHealing() {
    let queue = [];
    if (fs.existsSync(HEALING_QUEUE_PATH)) {
      try {
        queue = JSON.parse(fs.readFileSync(HEALING_QUEUE_PATH, 'utf8'));
      } catch {
        queue = [];
      }
    }

    queue.push({
      timestamp: new Date().toISOString(),
      testTitle: this.testInfo.title,
      testFile: this.testInfo.file,
      selector: this.originalSelector,
      elementHint: this.elementHint,
      note: 'Automatic healing failed - queued for offline AI repair'
    });

    try {
      fs.mkdirSync(path.dirname(HEALING_QUEUE_PATH), { recursive: true });
      fs.writeFileSync(HEALING_QUEUE_PATH, JSON.stringify(queue, null, 2));
    } catch (error) {
      console.warn('[AutoHeal] Could not write to healing queue:', error.message);
    }
  }
}

/**
 * Enhanced page fixture with automatic healing
 */
exports.test = base.extend({
  page: async ({ page }, use, testInfo) => {
    if (!HEALING_ENABLED) {
      await use(page);
      return;
    }

    // Wrap the page object to intercept locator operations
    const originalLocator = page.locator.bind(page);
    const originalGetByRole = page.getByRole.bind(page);
    const originalGetByText = page.getByText.bind(page);

    // Override locator method with healing wrapper
    page.locator = function(selector, options) {
      const originalLocatorObj = originalLocator(selector, options);
      
      // Wrap common locator methods
      const wrapMethod = (methodName) => {
        const originalMethod = originalLocatorObj[methodName].bind(originalLocatorObj);
        
        return async function(...args) {
          try {
            return await originalMethod(...args);
          } catch (error) {
            if (error.message.includes('Timeout') || error.message.includes('not visible')) {
              console.log(`[AutoHeal] 🚨 ${methodName} failed for selector: ${selector}`);
              
              const healer = new HealingLocator(
                originalLocatorObj,
                selector,
                selector,
                page,
                testInfo
              );
              
              const result = await healer.tryHealing();
              
              if (result.success) {
                console.log(`[AutoHeal] 🎉 Continuing test with healed selector`);
                return await result.locator[methodName](...args);
              }
            }
            throw error;
          }
        };
      };

      // Wrap critical methods that commonly fail
      originalLocatorObj.click = wrapMethod('click');
      originalLocatorObj.fill = wrapMethod('fill');
      originalLocatorObj.waitFor = wrapMethod('waitFor');
      originalLocatorObj.isVisible = wrapMethod('isVisible');
      originalLocatorObj.textContent = wrapMethod('textContent');
      
      return originalLocatorObj;
    };

    // Use the enhanced page
    await use(page);

    // Cleanup: record test outcome
    if (testInfo.status === 'failed' && testInfo.errors?.length > 0) {
      console.log(`[AutoHeal] Test failed despite healing attempts, queued for offline analysis`);
    }
  }
});

exports.expect = expect;
