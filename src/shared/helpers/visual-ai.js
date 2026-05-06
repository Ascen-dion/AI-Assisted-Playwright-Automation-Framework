const aiEngine = require('../core/ai-engine');
const logger = require('../../utils/logger');
const sharp = require('sharp');

/**
 * Visual AI helper for screenshot comparison and analysis
 */
class VisualAI {
  constructor() {
    this.baselineDir = './test-results/baselines';
    this.diffDir = './test-results/diffs';
  }

  /**
   * Compare screenshots using AI
   * @param {Buffer} currentScreenshot - Current screenshot
   * @param {Buffer} baselineScreenshot - Baseline screenshot
   * @returns {Promise<Object>} - Comparison result
   */
  async compareScreenshots(currentScreenshot, baselineScreenshot) {
    try {
      logger.info('AI comparing screenshots');

      // Use Claude to analyze both images
      const prompt = `Compare these two screenshots and identify any visual differences.
Focus on:
1. Layout changes
2. Text content differences
3. Color or styling changes
4. Missing or added elements
5. Position changes

Provide response in JSON:
{
  "identical": true/false,
  "confidence": 0.95,
  "differences": [
    {
      "type": "layout/content/style/element",
      "description": "what changed",
      "severity": "critical/major/minor",
      "location": "where in the page"
    }
  ],
  "overallAssessment": "summary of changes"
}`;

      const response = await aiEngine.client.messages.create({
        model: aiEngine.model,
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: baselineScreenshot.toString('base64')
                }
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: currentScreenshot.toString('base64')
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      });

      const result = JSON.parse(response.content[0].text);
      logger.info(`Visual comparison: ${result.identical ? 'PASS' : 'FAIL'}`);
      
      return result;
    } catch (error) {
      logger.error(`Screenshot comparison error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Detect UI anomalies using AI
   * @param {Buffer} screenshot - Screenshot to analyze
   * @param {Array} expectedElements - Elements that should be present
   * @returns {Promise<Object>} - Anomaly detection result
   */
  async detectAnomalies(screenshot, expectedElements = []) {
    try {
      logger.info('AI detecting UI anomalies');

      const prompt = `Analyze this screenshot for UI/UX issues and anomalies.
Check for:
1. Broken layouts or overlapping elements
2. Missing expected elements: ${expectedElements.join(', ')}
3. Alignment issues
4. Inconsistent spacing
5. Visual glitches or rendering problems
6. Accessibility issues (contrast, sizes)

Response format:
{
  "hasAnomalies": true/false,
  "anomalies": [
    {
      "type": "layout/missing/alignment/visual/accessibility",
      "severity": "critical/major/minor",
      "description": "issue description",
      "recommendation": "how to fix"
    }
  ],
  "overallScore": 0.85,
  "summary": "brief assessment"
}`;

      const response = await aiEngine.client.messages.create({
        model: aiEngine.model,
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: screenshot.toString('base64')
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      });

      const result = JSON.parse(response.content[0].text);
      logger.info(`Anomaly detection: ${result.hasAnomalies ? 'Issues found' : 'No issues'}`);
      
      return result;
    } catch (error) {
      logger.error(`Anomaly detection error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate responsive design across viewports
   * @param {Array} screenshots - Screenshots from different viewports
   * @returns {Promise<Object>} - Responsive validation result
   */
  async validateResponsiveDesign(screenshots) {
    try {
      logger.info('AI validating responsive design');

      const imageContent = screenshots.map(({ viewport, screenshot }) => ({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/png',
          data: screenshot.toString('base64')
        }
      }));

      const prompt = `Analyze these screenshots from different viewports and validate responsive design.
Viewports: ${screenshots.map(s => s.viewport).join(', ')}

Check for:
1. Content adaptation across screen sizes
2. Navigation changes (mobile menu, etc)
3. Image scaling and quality
4. Text readability
5. Touch target sizes on mobile
6. Layout consistency

Response format:
{
  "isResponsive": true/false,
  "score": 0.9,
  "viewportIssues": [
    {
      "viewport": "mobile/tablet/desktop",
      "issues": ["issue descriptions"],
      "severity": "critical/major/minor"
    }
  ],
  "recommendations": ["improvements"]
}`;

      const response = await aiEngine.client.messages.create({
        model: aiEngine.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              ...imageContent,
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      });

      const result = JSON.parse(response.content[0].text);
      logger.info(`Responsive validation score: ${result.score}`);
      
      return result;
    } catch (error) {
      logger.error(`Responsive validation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract text from screenshot using AI
   * @param {Buffer} screenshot - Screenshot buffer
   * @returns {Promise<Object>} - Extracted text and structure
   */
  async extractText(screenshot) {
    try {
      logger.info('AI extracting text from screenshot');

      const response = await aiEngine.client.messages.create({
        model: aiEngine.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/png',
                  data: screenshot.toString('base64')
                }
              },
              {
                type: 'text',
                text: `Extract all visible text from this screenshot, preserving structure.

Response format:
{
  "text": "all extracted text",
  "structure": [
    {
      "type": "heading/paragraph/button/link",
      "content": "text content",
      "location": "top/middle/bottom"
    }
  ],
  "keyElements": ["important text items"]
}`
              }
            ]
          }
        ]
      });

      const result = JSON.parse(response.content[0].text);
      logger.info('Text extraction complete');
      
      return result;
    } catch (error) {
      logger.error(`Text extraction error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Resize screenshot for comparison
   * @param {Buffer} screenshot - Original screenshot
   * @param {Object} dimensions - Target dimensions
   * @returns {Promise<Buffer>} - Resized screenshot
   */
  async resizeScreenshot(screenshot, dimensions) {
    try {
      const resized = await sharp(screenshot)
        .resize(dimensions.width, dimensions.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toBuffer();
      
      return resized;
    } catch (error) {
      logger.error(`Screenshot resize error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new VisualAI();
