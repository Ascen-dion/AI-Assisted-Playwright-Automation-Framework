const aiEngine = require('../core/ai-engine');
const logger = require('../../utils/logger');
const fs = require('fs').promises;
const path = require('path');

/**
 * AI-enhanced test reporting
 * Generates intelligent insights from test results
 */
class Reporting {
  constructor() {
    this.reportsDir = './test-results/ai-reports';
  }

  /**
   * Generate comprehensive test report with AI insights
   * @param {Object} testResults - Playwright test results
   * @returns {Promise<string>} - Report file path
   */
  async generateAIReport(testResults) {
    logger.info('Generating AI-powered test report');

    try {
      // Analyze test results with AI
      const analysis = await this.analyzeTestResults(testResults);

      // Generate HTML report
      const htmlReport = this.createHTMLReport(testResults, analysis);

      // Save report
      await fs.mkdir(this.reportsDir, { recursive: true });
      const reportPath = path.join(
        this.reportsDir,
        `ai-report-${Date.now()}.html`
      );
      await fs.writeFile(reportPath, htmlReport);

      logger.info(`AI report generated: ${reportPath}`);
      return reportPath;

    } catch (error) {
      logger.error(`Report generation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze test results using AI
   * @param {Object} testResults - Test results object
   * @returns {Promise<Object>} - AI analysis
   */
  async analyzeTestResults(testResults) {
    const prompt = `Analyze these test results and provide actionable insights:

Test Results Summary:
${JSON.stringify(testResults, null, 2)}

Provide analysis in JSON format:
{
  "overallHealth": "excellent/good/fair/poor",
  "healthScore": 0.85,
  "keyFindings": [
    "important observation 1",
    "important observation 2"
  ],
  "failurePatterns": [
    {
      "pattern": "pattern description",
      "frequency": "high/medium/low",
      "impact": "critical/major/minor",
      "recommendation": "how to address"
    }
  ],
  "testStability": {
    "flakyTests": ["test names"],
    "consistentFailures": ["test names"],
    "stableTests": ["test names"]
  },
  "performanceInsights": {
    "slowestTests": ["test names with durations"],
    "averageExecutionTime": "time in ms",
    "suggestions": ["optimization ideas"]
  },
  "recommendations": [
    {
      "priority": "high/medium/low",
      "category": "stability/performance/coverage/maintenance",
      "action": "specific recommendation",
      "expectedImpact": "what will improve"
    }
  ],
  "coverageAnalysis": {
    "wellTested": ["areas"],
    "gaps": ["areas needing more tests"],
    "redundant": ["potentially duplicate tests"]
  }
}`;

    try {
      const response = await aiEngine.client.messages.create({
        model: aiEngine.model,
        max_tokens: 2500,
        messages: [{ role: 'user', content: prompt }]
      });

      return JSON.parse(response.content[0].text);
    } catch (error) {
      logger.error(`AI analysis error: ${error.message}`);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Create HTML report
   * @param {Object} testResults - Test results
   * @param {Object} analysis - AI analysis
   * @returns {string} - HTML content
   */
  createHTMLReport(testResults, analysis) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI-Powered Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { font-size: 2.5em; margin-bottom: 10px; }
    .subtitle { opacity: 0.9; font-size: 1.1em; }
    .card {
      background: white;
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card h2 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 1.5em;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }
    .health-score {
      font-size: 3em;
      font-weight: bold;
      color: #667eea;
      text-align: center;
      margin: 20px 0;
    }
    .health-excellent { color: #10b981; }
    .health-good { color: #3b82f6; }
    .health-fair { color: #f59e0b; }
    .health-poor { color: #ef4444; }
    .metric {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .metric:last-child { border-bottom: none; }
    .metric-label { font-weight: 600; }
    .metric-value { color: #667eea; font-weight: bold; }
    .status-passed { color: #10b981; }
    .status-failed { color: #ef4444; }
    .status-skipped { color: #6b7280; }
    .recommendation {
      background: #f0f9ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
    }
    .recommendation.high {
      background: #fef2f2;
      border-left-color: #ef4444;
    }
    .recommendation.medium {
      background: #fffbeb;
      border-left-color: #f59e0b;
    }
    .priority-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 0.85em;
      font-weight: bold;
      margin-right: 10px;
    }
    .priority-high {
      background: #fecaca;
      color: #991b1b;
    }
    .priority-medium {
      background: #fde68a;
      color: #92400e;
    }
    .priority-low {
      background: #d1fae5;
      color: #065f46;
    }
    .test-list {
      list-style: none;
    }
    .test-list li {
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .test-list li:last-child { border-bottom: none; }
    .pattern {
      background: #fff7ed;
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
      border-left: 4px solid #f59e0b;
    }
    .timestamp {
      color: #6b7280;
      font-size: 0.9em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .stat-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }
    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      margin: 10px 0;
    }
    .stat-label {
      opacity: 0.9;
      text-transform: uppercase;
      font-size: 0.85em;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🤖 AI-Powered Test Report</h1>
      <div class="subtitle">Intelligent Analysis & Insights</div>
      <div class="timestamp">Generated: ${new Date().toLocaleString()}</div>
    </header>

    <div class="card">
      <h2>📊 Overall Health</h2>
      <div class="health-score health-${analysis.overallHealth}">
        ${(analysis.healthScore * 100).toFixed(0)}%
      </div>
      <div style="text-align: center; font-size: 1.2em; color: #6b7280;">
        ${analysis.overallHealth.toUpperCase()}
      </div>
    </div>

    <div class="grid">
      <div class="stat-box">
        <div class="stat-label">Total Tests</div>
        <div class="stat-number">${testResults.total || 0}</div>
      </div>
      <div class="stat-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
        <div class="stat-label">Passed</div>
        <div class="stat-number">${testResults.passed || 0}</div>
      </div>
      <div class="stat-box" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
        <div class="stat-label">Failed</div>
        <div class="stat-number">${testResults.failed || 0}</div>
      </div>
      <div class="stat-box" style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);">
        <div class="stat-label">Skipped</div>
        <div class="stat-number">${testResults.skipped || 0}</div>
      </div>
    </div>

    <div class="card">
      <h2>🔍 Key Findings</h2>
      <ul class="test-list">
        ${analysis.keyFindings.map(finding => `<li>• ${finding}</li>`).join('')}
      </ul>
    </div>

    ${analysis.failurePatterns && analysis.failurePatterns.length > 0 ? `
    <div class="card">
      <h2>⚠️ Failure Patterns</h2>
      ${analysis.failurePatterns.map(pattern => `
        <div class="pattern">
          <strong>${pattern.pattern}</strong>
          <div style="margin-top: 10px;">
            <span class="priority-badge priority-${pattern.impact}">${pattern.impact.toUpperCase()}</span>
            <span style="color: #6b7280;">Frequency: ${pattern.frequency}</span>
          </div>
          <div style="margin-top: 10px; color: #4b5563;">
            <strong>Recommendation:</strong> ${pattern.recommendation}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${analysis.recommendations && analysis.recommendations.length > 0 ? `
    <div class="card">
      <h2>💡 AI Recommendations</h2>
      ${analysis.recommendations.map(rec => `
        <div class="recommendation ${rec.priority}">
          <div>
            <span class="priority-badge priority-${rec.priority}">${rec.priority.toUpperCase()}</span>
            <strong>${rec.category.toUpperCase()}</strong>
          </div>
          <div style="margin-top: 10px;">${rec.action}</div>
          <div style="margin-top: 5px; color: #6b7280; font-size: 0.9em;">
            Expected Impact: ${rec.expectedImpact}
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}

    ${analysis.testStability ? `
    <div class="card">
      <h2>🎯 Test Stability</h2>
      ${analysis.testStability.flakyTests && analysis.testStability.flakyTests.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #f59e0b; margin-bottom: 10px;">Flaky Tests</h3>
          <ul class="test-list">
            ${analysis.testStability.flakyTests.map(test => `<li>• ${test}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      ${analysis.testStability.consistentFailures && analysis.testStability.consistentFailures.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #ef4444; margin-bottom: 10px;">Consistent Failures</h3>
          <ul class="test-list">
            ${analysis.testStability.consistentFailures.map(test => `<li>• ${test}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
    ` : ''}

    ${analysis.performanceInsights ? `
    <div class="card">
      <h2>⚡ Performance Insights</h2>
      <div class="metric">
        <span class="metric-label">Average Execution Time</span>
        <span class="metric-value">${analysis.performanceInsights.averageExecutionTime}</span>
      </div>
      ${analysis.performanceInsights.slowestTests && analysis.performanceInsights.slowestTests.length > 0 ? `
        <div style="margin-top: 15px;">
          <strong>Slowest Tests:</strong>
          <ul class="test-list">
            ${analysis.performanceInsights.slowestTests.map(test => `<li>• ${test}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      ${analysis.performanceInsights.suggestions && analysis.performanceInsights.suggestions.length > 0 ? `
        <div style="margin-top: 15px;">
          <strong>Optimization Suggestions:</strong>
          <ul class="test-list">
            ${analysis.performanceInsights.suggestions.map(suggestion => `<li>• ${suggestion}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
    ` : ''}

  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Get default analysis when AI fails
   * @returns {Object} - Default analysis object
   */
  getDefaultAnalysis() {
    return {
      overallHealth: 'unknown',
      healthScore: 0,
      keyFindings: ['AI analysis unavailable'],
      failurePatterns: [],
      testStability: null,
      performanceInsights: null,
      recommendations: [],
      coverageAnalysis: null
    };
  }
}

module.exports = new Reporting();
