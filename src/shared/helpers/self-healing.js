const aiEngine = require('../core/ai-engine');
const logger = require('../../utils/logger');
const fs = require('fs').promises;
const path = require('path');

/**
 * Self-healing mechanism for test automation
 * Learns from failures and adapts selectors automatically
 */
class SelfHealing {
  constructor() {
    this.healingHistoryPath = './test-results/healing-history.json';
    this.healingHistory = [];
    this.loadHistory();
  }

  /**
   * Load healing history from file
   */
  async loadHistory() {
    try {
      const data = await fs.readFile(this.healingHistoryPath, 'utf-8');
      this.healingHistory = JSON.parse(data);
      logger.info(`Loaded ${this.healingHistory.length} healing records`);
    } catch (error) {
      // File doesn't exist yet, start fresh
      this.healingHistory = [];
      logger.info('Starting with empty healing history');
    }
  }

  /**
   * Save healing history to file
   */
  async saveHistory() {
    try {
      await fs.mkdir(path.dirname(this.healingHistoryPath), { recursive: true });
      await fs.writeFile(
        this.healingHistoryPath,
        JSON.stringify(this.healingHistory, null, 2)
      );
      logger.info('Healing history saved');
    } catch (error) {
      logger.error(`Failed to save healing history: ${error.message}`);
    }
  }

  /**
   * Record a successful healing event
   * @param {Object} event - Healing event details
   */
  async recordHealing(event) {
    const record = {
      timestamp: new Date().toISOString(),
      testName: event.testName,
      elementDescription: event.elementDescription,
      oldSelector: event.oldSelector,
      newSelector: event.newSelector,
      healingStrategy: event.strategy,
      success: event.success,
      confidence: event.confidence
    };

    this.healingHistory.push(record);
    await this.saveHistory();
    
    logger.info(`Healing recorded: ${event.elementDescription} -> ${event.newSelector}`);
  }

  /**
   * Attempt to heal a broken selector
   * @param {Object} context - Healing context
   * @returns {Promise<Object>} - Healing result
   */
  async attemptHealing(context) {
    const {
      page,
      elementDescription,
      failedSelector,
      testName
    } = context;

    logger.info(`Attempting self-healing for: ${elementDescription}`);

    try {
      // Get current page HTML
      const pageHTML = await page.content();

      // Check healing history for similar cases
      const similarHealing = this.findSimilarHealing(elementDescription, failedSelector);
      
      if (similarHealing) {
        logger.info(`Found similar healing case, trying selector: ${similarHealing.newSelector}`);
        
        const element = await this.trySelector(page, similarHealing.newSelector);
        if (element) {
          await this.recordHealing({
            testName,
            elementDescription,
            oldSelector: failedSelector,
            newSelector: similarHealing.newSelector,
            strategy: 'history-based',
            success: true,
            confidence: 0.8
          });
          
          return {
            success: true,
            selector: similarHealing.newSelector,
            strategy: 'history-based'
          };
        }
      }

      // Use AI to generate new selector
      const aiResult = await aiEngine.selfHealSelector(
        pageHTML,
        failedSelector,
        elementDescription
      );

      // Try AI-suggested selectors
      for (const newSelector of aiResult.newSelectors) {
        const element = await this.trySelector(page, newSelector);
        
        if (element) {
          await this.recordHealing({
            testName,
            elementDescription,
            oldSelector: failedSelector,
            newSelector,
            strategy: 'ai-generated',
            success: true,
            confidence: aiResult.confidence
          });

          return {
            success: true,
            selector: newSelector,
            strategy: 'ai-generated',
            diagnosis: aiResult.diagnosis
          };
        }
      }

      // Healing failed
      await this.recordHealing({
        testName,
        elementDescription,
        oldSelector: failedSelector,
        newSelector: null,
        strategy: 'failed',
        success: false,
        confidence: 0
      });

      return {
        success: false,
        diagnosis: aiResult.diagnosis,
        suggestions: aiResult.newSelectors
      };

    } catch (error) {
      logger.error(`Self-healing error: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Try a selector on the page
   * @param {Page} page - Playwright page
   * @param {string} selector - CSS or XPath selector
   * @returns {Promise<ElementHandle|null>} - Element if found
   */
  async trySelector(page, selector) {
    try {
      const isXPath = selector.startsWith('/') || selector.startsWith('(');
      
      const element = await page.waitForSelector(
        isXPath ? `xpath=${selector}` : selector,
        { timeout: 5000, state: 'visible' }
      ).catch(() => null);
      
      return element;
    } catch (error) {
      return null;
    }
  }

  /**
   * Find similar healing cases from history
   * @param {string} elementDescription - Element description
   * @param {string} failedSelector - Failed selector
   * @returns {Object|null} - Similar healing record
   */
  findSimilarHealing(elementDescription, failedSelector) {
    // Find records with similar element description
    const similar = this.healingHistory.filter(record => {
      return record.success &&
             record.elementDescription.toLowerCase() === elementDescription.toLowerCase() &&
             record.oldSelector === failedSelector;
    });

    // Return most recent successful healing
    if (similar.length > 0) {
      return similar[similar.length - 1];
    }

    return null;
  }

  /**
   * Get healing statistics
   * @returns {Object} - Statistics
   */
  getStatistics() {
    const total = this.healingHistory.length;
    const successful = this.healingHistory.filter(h => h.success).length;
    const failed = total - successful;

    const strategyCounts = this.healingHistory.reduce((acc, record) => {
      acc[record.healingStrategy] = (acc[record.healingStrategy] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : '0%',
      strategyCounts
    };
  }

  /**
   * Generate healing report
   * @returns {Promise<string>} - Report content
   */
  async generateReport() {
    const stats = this.getStatistics();

    const report = `
# Self-Healing Report

## Statistics
- Total Healing Attempts: ${stats.total}
- Successful Healings: ${stats.successful}
- Failed Healings: ${stats.failed}
- Success Rate: ${stats.successRate}

## Healing Strategies Used
${Object.entries(stats.strategyCounts).map(([strategy, count]) => 
  `- ${strategy}: ${count}`
).join('\n')}

## Recent Healing Events
${this.healingHistory.slice(-10).reverse().map(record => `
### ${record.elementDescription}
- Test: ${record.testName}
- Status: ${record.success ? '✅ Success' : '❌ Failed'}
- Old Selector: \`${record.oldSelector}\`
- New Selector: \`${record.newSelector || 'N/A'}\`
- Strategy: ${record.healingStrategy}
- Confidence: ${(record.confidence * 100).toFixed(0)}%
- Date: ${new Date(record.timestamp).toLocaleString()}
`).join('\n')}

## Recommendations
${this.generateRecommendations()}
`;

    return report;
  }

  /**
   * Generate recommendations based on healing history
   * @returns {string} - Recommendations
   */
  generateRecommendations() {
    const failedSelectors = this.healingHistory
      .filter(h => !h.success)
      .map(h => h.oldSelector);

    const frequentFailures = this.getMostFrequent(failedSelectors);

    if (frequentFailures.length === 0) {
      return '- No significant issues detected. Continue monitoring.';
    }

    return frequentFailures.map(({ item, count }) => 
      `- Review selector \`${item}\` (failed ${count} times) - consider using more robust locator strategy`
    ).join('\n');
  }

  /**
   * Get most frequent items in array
   * @param {Array} array - Input array
   * @returns {Array} - Frequency sorted items
   */
  getMostFrequent(array) {
    const frequency = array.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(frequency)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}

module.exports = new SelfHealing();
