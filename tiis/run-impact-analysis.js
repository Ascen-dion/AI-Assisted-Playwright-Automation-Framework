#!/usr/bin/env node
/**
 * TIIS — CLI Entry Point
 *
 * Usage:
 *   node tiis/run-impact-analysis.js --pr=<PR_NUMBER>
 *   node tiis/run-impact-analysis.js --pr=5
 *   node tiis/run-impact-analysis.js --pr=5 --config=./tiis/config/tiis.config.js
 *
 * Environment variables required:
 *   GITHUB_TOKEN   — GitHub personal access token (read:repo scope)
 *   AI_PROVIDER    — openrouter | openai | anthropic | copilot | local (default: openrouter)
 *   OPENROUTER_API_KEY / OPENAI_API_KEY / ANTHROPIC_API_KEY — depending on provider
 *
 * Output:
 *   tiis/reports/latest-impact-report.json
 *   tiis/reports/latest-impact-report.html
 *   tiis/reports/impact-report-PR<N>-<timestamp>.json
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const path = require('path');
const logger = require('../utils/logger');
const TIISOrchestrator = require('./orchestrator');

async function main() {
  // ── Parse CLI arguments: --key=value ──────────────────────────────────────
  const args = process.argv.slice(2).reduce((acc, arg) => {
    const eq = arg.indexOf('=');
    if (eq > -1) {
      const key = arg.slice(2, eq);
      acc[key] = arg.slice(eq + 1);
    }
    return acc;
  }, {});

  const prNumber = args.pr || process.env.PR_NUMBER;
  const configPath = args.config || './tiis/config/tiis.config.js';

  // ── Validate required inputs ───────────────────────────────────────────────
  if (!prNumber) {
    console.error('\n❌ PR number is required.');
    console.error('   Usage  : node tiis/run-impact-analysis.js --pr=<NUMBER>');
    console.error('   Example: node tiis/run-impact-analysis.js --pr=5\n');
    process.exit(1);
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error('\n❌ GITHUB_TOKEN is not set.');
    console.error('   Add GITHUB_TOKEN=<your_token> to your .env file.');
    console.error('   The token needs read access to the target repository.\n');
    process.exit(1);
  }

  // ── Load config ────────────────────────────────────────────────────────────
  let config;
  try {
    config = require(path.resolve(process.cwd(), configPath));
  } catch (e) {
    console.error(`\n❌ Could not load config from "${configPath}": ${e.message}\n`);
    process.exit(1);
  }

  // ── Run analysis ───────────────────────────────────────────────────────────
  try {
    const orchestrator = new TIISOrchestrator(config);
    const report = await orchestrator.run(Number(prNumber));
    printSummary(report);
  } catch (err) {
    logger.error(`\n❌ Impact analysis failed: ${err.message}`);

    if (err.response?.status === 404) {
      logger.error(
        `   PR #${prNumber} not found in ${config.vcs.owner}/${config.vcs.repo}.\n` +
        '   Check the PR number and ensure vcs.owner / vcs.repo in tiis.config.js are correct.'
      );
    } else if (err.response?.status === 401 || err.response?.status === 403) {
      logger.error('   GitHub authentication failed. Verify your GITHUB_TOKEN is valid and has repo read access.');
    } else if (err.message?.includes('AI provider')) {
      logger.error('   AI provider error. Check your AI API key in .env and AI_PROVIDER setting.');
    }

    process.exit(1);
  }
}

/**
 * Print a concise human-readable summary to stdout.
 */
function printSummary(report) {
  const m = report.metadata || {};
  const RISK_EMOJI = { critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' };
  const riskEmoji = RISK_EMOJI[(m.overallRisk || '').toLowerCase()] || '⚪';
  const SEP = '═'.repeat(65);
  const sep = '─'.repeat(65);

  console.log(`\n${SEP}`);
  console.log('  TIIS — IMPACT ANALYSIS REPORT');
  console.log(SEP);
  console.log(`  Project  : ${m.project}`);
  console.log(`  PR       : #${m.pr?.number} — ${m.pr?.title}`);
  console.log(`  Author   : ${m.pr?.author}`);
  console.log(`  Type     : ${m.changeType}`);
  console.log(`  Risk     : ${riskEmoji} ${(m.overallRisk || '').toUpperCase()}`);
  console.log(`  App      : ${m.appUrl}`);
  console.log(sep);

  if (report.executiveSummary) {
    console.log(`\n  ${report.executiveSummary}\n`);
  }

  // Impacted areas
  const allImpacted = [
    ...(report.impactedAreas?.critical || []).map((a) => ({ ...a, label: '🔴 CRITICAL' })),
    ...(report.impactedAreas?.high     || []).map((a) => ({ ...a, label: '🟠 HIGH    ' })),
    ...(report.impactedAreas?.medium   || []).map((a) => ({ ...a, label: '🟡 MEDIUM  ' })),
    ...(report.impactedAreas?.low      || []).map((a) => ({ ...a, label: '🟢 LOW     ' })),
  ];

  if (allImpacted.length) {
    console.log('  IMPACTED AREAS:');
    for (const area of allImpacted) {
      console.log(`  ${area.label}  ${area.feature}`);
      console.log(`              └─ ${area.reason}`);
      if (area.tests?.length) {
        console.log(`              └─ Tests: ${area.tests.join(', ')}`);
      }
    }
  } else {
    console.log('  No impacted areas identified.');
  }

  // Coverage gaps
  if (report.coverageGaps?.length) {
    console.log(`\n  ⚠️  COVERAGE GAPS (${report.coverageGaps.length} area(s) with no tests):`);
    for (const gap of report.coverageGaps) {
      console.log(`  ❌ ${gap.feature}`);
      console.log(`     └─ ${gap.recommendation}`);
    }
  } else {
    console.log('\n  ✅ No coverage gaps in impacted areas.');
  }

  // Regression suite
  const suite = report.recommendedRegressionSuite;
  if (suite?.testFiles?.length) {
    console.log('\n  RECOMMENDED REGRESSION SUITE:');
    for (const f of suite.testFiles) {
      console.log(`  ▶  ${f}`);
    }
    console.log(`\n  Run command: ${suite.runCommand}`);
  } else {
    console.log('\n  ⚠️  No existing tests cover impacted areas — manual testing required.');
  }

  console.log(`\n${SEP}`);
  console.log('  Reports saved to:');
  console.log('    tiis/reports/latest-impact-report.json');
  console.log('    tiis/reports/latest-impact-report.html');
  console.log(`${SEP}\n`);
}

main();
