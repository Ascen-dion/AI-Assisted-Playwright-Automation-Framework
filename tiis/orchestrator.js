/**
 * TIIS — Orchestrator
 *
 * Chains all 4 agents in sequence and saves the final report.
 *
 *  Agent 1 (PR Fetcher)         → prData
 *        ↓
 *  Agent 2 (Change Analyst)     → changeAnalysis        [AI]
 *  Agent 3 (Test Scanner)       → testInventory         [parallel, no AI]
 *        ↓
 *  Agent 4 (Impact Reporter)    → fullReport            [AI]
 *        ↓
 *  Save JSON + HTML report to tiis/reports/
 */

const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const GitHubPRFetcher = require('./agents/agent1-pr-fetcher');
const ChangeAnalyst = require('./agents/agent2-change-analyst');
const TestInventoryScanner = require('./agents/agent3-test-scanner');
const ImpactReporter = require('./agents/agent4-impact-reporter');

class TIISOrchestrator {
  constructor(config) {
    this.config = config;
    this.agent1 = new GitHubPRFetcher(config);
    this.agent2 = new ChangeAnalyst(config);
    this.agent3 = new TestInventoryScanner(config);
    this.agent4 = new ImpactReporter(config);
  }

  /**
   * Run the full impact analysis pipeline for a given PR number.
   * @param {number} prNumber
   * @returns {Promise<Object>} fullReport
   */
  async run(prNumber) {
    logger.info(`\n${'═'.repeat(62)}`);
    logger.info('  TIIS — Test Impact Intelligence System');
    logger.info(`  Project : ${this.config.project.name}`);
    logger.info(`  PR      : #${prNumber}  (${this.config.vcs.owner}/${this.config.vcs.repo})`);
    logger.info(`${'═'.repeat(62)}\n`);

    const startTime = Date.now();

    // ── Step 1: Fetch PR from GitHub ────────────────────────────────────────
    const prData = await this.agent1.fetchPR(prNumber);

    // ── Step 2 + 3: AI analysis + test scan (Agent 3 is sync, run before AI) ─
    // Run test scanner first (fast, no API) so Agent 4 has full context
    const testInventory = this.agent3.scan();

    // Agent 2 is AI — run after scan so both results are ready for Agent 4
    const changeAnalysis = await this.agent2.analyze(prData);

    // ── Step 4: Generate final impact report ────────────────────────────────
    const report = await this.agent4.generateReport(prData, changeAnalysis, testInventory);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    logger.info(`\n⏱  Total analysis time: ${elapsed}s`);

    // ── Save report ──────────────────────────────────────────────────────────
    await this._saveReport(report, prNumber);

    return report;
  }

  async _saveReport(report, prNumber) {
    const reportsDir = path.resolve(process.cwd(), this.config.output.reportsDir);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const baseName = `impact-report-PR${prNumber}-${timestamp}`;

    // Always save a timestamped copy + overwrite latest
    const jsonPath = path.join(reportsDir, `${baseName}.json`);
    const latestPath = path.join(reportsDir, 'latest-impact-report.json');

    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    fs.writeFileSync(latestPath, JSON.stringify(report, null, 2));
    logger.info(`💾 JSON report  → ${jsonPath}`);

    // Optionally generate HTML
    if (this.config.output.formats.includes('html')) {
      const htmlPath = path.join(reportsDir, `${baseName}.html`);
      const latestHtmlPath = path.join(reportsDir, 'latest-impact-report.html');
      const html = this._generateHTML(report);
      fs.writeFileSync(htmlPath, html);
      fs.writeFileSync(latestHtmlPath, html);
      logger.info(`🌐 HTML report  → ${htmlPath}`);
    }
  }

  _generateHTML(report) {
    const m = report.metadata || {};
    const riskColor = { critical: '#c0392b', high: '#e67e22', medium: '#f39c12', low: '#27ae60' };
    const risk = (m.overallRisk || 'low').toLowerCase();
    const color = riskColor[risk] || '#888';

    const renderAreaList = (areas = []) =>
      areas.length
        ? areas.map((a) =>
            `<li><strong>${a.feature}</strong> — ${a.reason}` +
            (a.tests?.length ? `<br/><code>${a.tests.join(', ')}</code>` : '') +
            '</li>'
          ).join('')
        : '<li><em>None</em></li>';

    const renderGaps = (gaps = []) =>
      gaps.length
        ? gaps.map((g) =>
            `<li><strong>${g.feature}</strong>: ${g.reason}<br/>
             <em>Recommendation: ${g.recommendation}</em></li>`
          ).join('')
        : '<li><em>No gaps detected</em></li>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>TIIS Impact Report — PR #${m.pr?.number}</title>
  <style>
    body{font-family:Calibri,Arial,sans-serif;margin:32px 48px;color:#222;line-height:1.6;}
    h1{color:#1a3c6e;border-bottom:3px solid #1a3c6e;padding-bottom:6px;}
    h2{color:#1a3c6e;margin-top:36px;border-bottom:1px solid #c0c8d8;padding-bottom:3px;}
    .risk-badge{display:inline-block;padding:4px 14px;border-radius:14px;font-weight:bold;
      font-size:14px;color:#fff;background:${color};}
    table{border-collapse:collapse;width:100%;margin:12px 0;}
    th{background:#1a3c6e;color:#fff;padding:9px 14px;text-align:left;}
    td{border:1px solid #c0c8d8;padding:8px 14px;vertical-align:top;}
    tr:nth-child(even) td{background:#f4f7fd;}
    ul{margin:6px 0 6px 20px;}
    code{background:#f0f4fb;padding:2px 6px;border-radius:3px;font-size:13px;}
    pre{background:#f0f4fb;padding:14px;border-radius:4px;overflow-x:auto;font-size:13px;}
    .section{background:#fafbff;border:1px solid #dde4f0;border-radius:6px;padding:16px 20px;margin:14px 0;}
    .gap{background:#fff5f5;border-left:4px solid #c0392b;padding:10px 14px;margin:8px 0;border-radius:3px;}
    footer{color:#aaa;font-size:12px;margin-top:48px;text-align:center;}
  </style>
</head>
<body>
<h1>Test Impact Report</h1>
<p><strong>Project:</strong> ${m.project} &nbsp;|&nbsp;
   <strong>PR:</strong> #${m.pr?.number} — ${m.pr?.title} &nbsp;|&nbsp;
   <strong>Author:</strong> ${m.pr?.author}<br/>
   <strong>Branch:</strong> ${m.pr?.branch} &nbsp;|&nbsp;
   <strong>Change Type:</strong> ${m.changeType} &nbsp;|&nbsp;
   <strong>Generated:</strong> ${new Date(report.generatedAt).toLocaleString()}<br/>
   <strong>App:</strong> <a href="${m.appUrl}">${m.appUrl}</a>
</p>
<p>Overall Risk: <span class="risk-badge">${(m.overallRisk || '').toUpperCase()}</span></p>

<div class="section">
  <strong>Executive Summary</strong><br/>
  ${report.executiveSummary || '—'}
</div>

<h2>Impacted Areas</h2>
<table>
  <tr><th>Priority</th><th>Feature</th><th>Reason</th><th>Test Files</th></tr>
  ${[
    ...((report.impactedAreas?.critical || []).map((a) => ({ ...a, p: '🔴 Critical', bg: '#fde8e8' }))),
    ...((report.impactedAreas?.high     || []).map((a) => ({ ...a, p: '🟠 High',     bg: '#fef0e6' }))),
    ...((report.impactedAreas?.medium   || []).map((a) => ({ ...a, p: '🟡 Medium',   bg: '#fefbe6' }))),
    ...((report.impactedAreas?.low      || []).map((a) => ({ ...a, p: '🟢 Low',      bg: '#edfbee' }))),
  ].map((a) =>
    `<tr style="background:${a.bg}">
      <td>${a.p}</td>
      <td><strong>${a.feature}</strong></td>
      <td>${a.reason}</td>
      <td>${(a.tests || []).map((t) => `<code>${t}</code>`).join('<br/>') || '<em>No tests</em>'}</td>
    </tr>`
  ).join('') || '<tr><td colspan="4"><em>No impacted areas identified</em></td></tr>'}
</table>

<h2>⚠️ Coverage Gaps</h2>
${(report.coverageGaps || []).length
  ? (report.coverageGaps || []).map((g) =>
      `<div class="gap"><strong>${g.feature}</strong>: ${g.reason}<br/>
       <em>→ ${g.recommendation}</em></div>`
    ).join('')
  : '<p><em>No coverage gaps detected.</em></p>'}

<h2>Recommended Regression Suite</h2>
<ul>
  ${(report.recommendedRegressionSuite?.testFiles || []).map((f) => `<li><code>${f}</code></li>`).join('') ||
    '<li><em>No existing tests cover impacted areas — manual testing required.</em></li>'}
</ul>
<pre>${report.recommendedRegressionSuite?.runCommand || 'npx playwright test'}</pre>

<h2>Safe to Skip</h2>
<ul>
  ${(report.safeToSkip || []).map((s) => `<li>${s}</li>`).join('') || '<li><em>None listed</em></li>'}
</ul>

<footer>Generated by Test Impact Intelligence System (TIIS) &nbsp;|&nbsp; ${report.generatedAt}</footer>
</body>
</html>`;
  }
}

module.exports = TIISOrchestrator;
