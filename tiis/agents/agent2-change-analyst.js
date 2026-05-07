/**
 * TIIS — Agent 2: Change Analyst
 *
 * Responsibility: Use AI to understand WHAT changed and WHY it matters.
 * Maps changed files to application business features.
 *
 * Input:  prData (from Agent 1)
 * Output: {
 *   changeType, changeSummary, affectedLayers,
 *   directlyImpactedFeatures[], indirectlyImpactedFeatures[],
 *   riskLevel, riskReason, keyChanges[]
 * }
 *
 * AI-powered — works for any language (Java, JS, Python, C#, Swift, etc.)
 */

const aiEngine = require('../../src/shared/core/ai-engine');
const logger = require('../../utils/logger');

class ChangeAnalyst {
  constructor(config) {
    this.featureMap = config.appKnowledge.featureMap;
    this.featureNames = Object.keys(this.featureMap);
  }

  /**
   * Analyze the PR diff and identify impacted business areas.
   * @param {Object} prData - Output from Agent 1
   * @returns {Promise<Object>}
   */
  async analyze(prData) {
    logger.info('🧠 Agent 2 — Change Analyst: Analyzing what changed...');

    const featureMapContext = this.featureNames
      .map((name) => {
        const f = this.featureMap[name];
        const endpoints = f.endpoints ? `\n    Endpoints: ${f.endpoints.join(', ')}` : '';
        return (
          `Feature: "${name}"\n` +
          `  Files: ${f.files.join(', ')}${endpoints}\n` +
          `  Description: ${f.description}`
        );
      })
      .join('\n\n');

    const changedFilesList = prData.changedFiles
      .map((f) => `  [${f.status.toUpperCase()}] ${f.filename}  (+${f.additions}/-${f.deletions})`)
      .join('\n');

    const prompt = `You are a senior software engineer performing a code change impact analysis.

## Pull Request
- Title: ${prData.title}
- Description: ${prData.description || '(none provided)'}
- Branch: ${prData.headBranch} → ${prData.baseBranch}

## Changed Files (${prData.stats.totalFiles} total)
${changedFilesList}

## Code Diff (truncated to ${prData.diffText.length} chars)
\`\`\`
${prData.diffText}
\`\`\`

## Application Feature Map
These are ALL the known features in this app. Use ONLY these feature names in your response.

${featureMapContext}

## Your Task
1. Determine the change type and summarize in plain English what this PR does.
2. Identify which application layers are affected (UI, API, Business Logic, Data Layer, Configuration, Navigation).
3. From the feature map above, identify:
   - directlyImpactedFeatures: features whose OWN files were changed
   - indirectlyImpactedFeatures: features that DEPEND ON or are DOWNSTREAM from the changed features
4. Assign a risk level and explain why.

IMPORTANT: Use ONLY feature names that appear EXACTLY as written in the feature map above.

Return ONLY valid JSON — no explanation, no markdown, no code fences. Example structure:
{
  "changeType": "feature",
  "changeSummary": "Adds a price sorting dropdown to the products catalog page",
  "affectedLayers": ["UI"],
  "directlyImpactedFeatures": ["Products Catalog"],
  "indirectlyImpactedFeatures": ["Shopping Cart", "Navigation"],
  "riskLevel": "medium",
  "riskReason": "UI-only change to product listing; cart logic is unchanged but display integration should be verified",
  "keyChanges": [
    "New sort dropdown component added to Products.js",
    "CSS updated for filter bar layout"
  ]
}`;

    const response = await aiEngine.query(prompt, { maxTokens: 1500 });
    const analysis = this._parseJSON(response);

    // Validate that returned feature names actually exist in the feature map
    analysis.directlyImpactedFeatures = this._filterValidFeatures(analysis.directlyImpactedFeatures);
    analysis.indirectlyImpactedFeatures = this._filterValidFeatures(analysis.indirectlyImpactedFeatures);

    logger.info(
      `✅ Agent 2 done — Type: ${analysis.changeType}, Risk: ${analysis.riskLevel}, ` +
      `Direct impacts: ${analysis.directlyImpactedFeatures.length} feature(s)`
    );

    return analysis;
  }

  _filterValidFeatures(features = []) {
    return (features || []).filter((f) => this.featureNames.includes(f));
  }

  _parseJSON(text) {
    try {
      // Strip any markdown fences the LLM may have added
      const cleaned = text.replace(/```(?:json)?/g, '').trim();
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch (e) {
      logger.warn(`⚠️  Agent 2 could not parse AI JSON response: ${e.message}`);
    }

    // Safe fallback — analysis is still usable with default values
    return {
      changeType: 'unknown',
      changeSummary: 'AI analysis unavailable — review diff manually.',
      affectedLayers: [],
      directlyImpactedFeatures: [],
      indirectlyImpactedFeatures: [],
      riskLevel: 'high',
      riskReason: 'Could not determine risk automatically — defaulting to high.',
      keyChanges: [],
    };
  }
}

module.exports = ChangeAnalyst;
