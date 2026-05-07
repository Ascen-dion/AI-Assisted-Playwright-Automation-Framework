/**
 * TIIS — Agent 4: Impact Reporter
 *
 * Responsibility: Combine the outputs of Agents 1, 2, and 3 and produce
 * a prioritized, human-readable impact report using AI.
 *
 * Input:  prData, changeAnalysis, testInventory
 * Output: Full impact report (JSON) with:
 *   - executiveSummary
 *   - impactedAreas (critical / high / medium / low)
 *   - coverageGaps
 *   - recommendedRegressionSuite
 *   - safeToSkip
 */

const aiEngine = require('../../src/shared/core/ai-engine');
const logger = require('../../utils/logger');

class ImpactReporter {
  constructor(config) {
    this.featureMap = config.appKnowledge.featureMap;
    this.appUrl = config.project.appUrl;
    this.projectName = config.project.name;
  }

  /**
   * Generate the full impact report.
   * @param {Object} prData          - from Agent 1
   * @param {Object} changeAnalysis  - from Agent 2
   * @param {Object} testInventory   - from Agent 3
   * @returns {Promise<Object>}
   */
  async generateReport(prData, changeAnalysis, testInventory) {
    logger.info('📊 Agent 4 — Impact Reporter: Generating impact report...');

    // Build a readable coverage summary for the AI prompt
    const coverageSummary = Object.entries(testInventory.coverageMap)
      .map(([feature, data]) => {
        if (data.covered) {
          const files = data.tests.map((t) => t.file).join(', ');
          return `  ✅ "${feature}" → covered by [${files}]`;
        }
        return `  ❌ "${feature}" → NO TESTS EXIST`;
      })
      .join('\n');

    const prompt = `You are a QA Lead performing a test impact analysis for a pull request.
Your job: determine which regression tests to run and flag any coverage gaps.

## Project: ${this.projectName}
## Live App: ${this.appUrl}

## PR Details
- Number: #${prData.prNumber}
- Title: ${prData.title}
- Author: ${prData.author}
- Change Type: ${changeAnalysis.changeType}
- Risk Level: ${changeAnalysis.riskLevel}
- Summary: ${changeAnalysis.changeSummary}

## Directly Impacted Features (code was changed in these features)
${changeAnalysis.directlyImpactedFeatures.map((f) => `  - ${f}`).join('\n') || '  (none)'}

## Indirectly Impacted Features (depend on the changed features)
${changeAnalysis.indirectlyImpactedFeatures.map((f) => `  - ${f}`).join('\n') || '  (none)'}

## Key Changes Made
${(changeAnalysis.keyChanges || []).map((c) => `  - ${c}`).join('\n') || '  (none listed)'}

## Full Test Coverage Map
${coverageSummary}

## Your Task
1. Write a 2–3 sentence executive summary for a non-technical manager.
2. For each IMPACTED feature (directly AND indirectly), assign a regression priority:
   - critical: must test before merge
   - high: test before release
   - medium: include in next regression cycle
   - low: monitor but not blocking
3. Identify coverage gaps (impacted features with NO tests).
4. List features that are SAFE TO SKIP (not related to this change).
5. Produce the recommended regression run command.

Return ONLY valid JSON — no markdown, no code fences:
{
  "executiveSummary": "2-3 sentence plain English summary for management",
  "overallRisk": "critical|high|medium|low",
  "impactedAreas": {
    "critical": [
      { "feature": "exact feature name", "reason": "why critical", "tests": ["test/file/path.spec.js"] }
    ],
    "high":   [{ "feature": "...", "reason": "...", "tests": ["..."] }],
    "medium": [{ "feature": "...", "reason": "...", "tests": ["..."] }],
    "low":    [{ "feature": "...", "reason": "...", "tests": ["..."] }]
  },
  "coverageGaps": [
    {
      "feature": "exact feature name",
      "reason": "what is missing",
      "recommendation": "specific test scenario to create"
    }
  ],
  "recommendedRegressionSuite": {
    "testFiles": ["src/web/tests/example.spec.js"],
    "estimatedCoverage": "~X% of impacted area",
    "runCommand": "npx playwright test src/web/tests/example.spec.js"
  },
  "safeToSkip": [
    "Feature Name — reason it is unaffected"
  ]
}`;

    const response = await aiEngine.query(prompt, { maxTokens: 2000 });
    const parsed = this._parseJSON(response);

    // Attach metadata
    const fullReport = {
      reportVersion: '1.0',
      generatedAt: new Date().toISOString(),
      metadata: {
        project: this.projectName,
        appUrl: this.appUrl,
        pr: {
          number: prData.prNumber,
          title: prData.title,
          author: prData.author,
          branch: `${prData.headBranch} → ${prData.baseBranch}`,
        },
        changeType: changeAnalysis.changeType,
        riskLevel: changeAnalysis.riskLevel,
        overallRisk: parsed.overallRisk || changeAnalysis.riskLevel,
        stats: {
          filesChanged: prData.stats.totalFiles,
          testFilesFound: testInventory.totalTestFiles,
          coveredFeatures: testInventory.coveredFeatures.length,
          gapFeatures: testInventory.gapFeatures.length,
        },
      },
      ...parsed,
    };

    const impactCount =
      (fullReport.impactedAreas?.critical?.length || 0) +
      (fullReport.impactedAreas?.high?.length || 0) +
      (fullReport.impactedAreas?.medium?.length || 0) +
      (fullReport.impactedAreas?.low?.length || 0);

    logger.info(
      `✅ Agent 4 done — Overall risk: ${fullReport.metadata.overallRisk.toUpperCase()}, ` +
      `${impactCount} impacted area(s), ${fullReport.coverageGaps?.length || 0} gap(s)`
    );

    return fullReport;
  }

  _parseJSON(text) {
    try {
      const cleaned = text.replace(/```(?:json)?/g, '').trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {
      logger.warn(`⚠️  Agent 4 could not parse AI JSON: ${e.message}`);
    }

    // Safe fallback
    return {
      executiveSummary: 'Impact report could not be generated automatically. Manual review required.',
      overallRisk: 'high',
      impactedAreas: { critical: [], high: [], medium: [], low: [] },
      coverageGaps: [],
      recommendedRegressionSuite: {
        testFiles: [],
        estimatedCoverage: 'unknown',
        runCommand: 'npx playwright test',
      },
      safeToSkip: [],
    };
  }
}

module.exports = ImpactReporter;
