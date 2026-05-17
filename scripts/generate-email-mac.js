/**
 * generate-email-mac.js
 *
 * Generates a dark-theme HTML email report for the HP Smart macOS (WDIO) tests.
 * Reads the current run's report-0-0.json written by wdio-html-nice-reporter,
 * which contains proper test titles, states, and durations.
 *
 * Called by GitHub Actions "Generate email report" step:
 *   node scripts/generate-email-mac.js
 *
 * Writes: email-body.html
 *
 * Required env vars (GitHub Actions supplies these automatically):
 *   GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID, GITHUB_RUN_NUMBER
 *   GITHUB_REF_NAME, GITHUB_ACTOR, GITHUB_SHA
 * Optional:
 *   REPORT_TITLE  (default: "HP Smart macOS Tests")
 */
'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs   = require('fs');
const path = require('path');
const glob = require('glob');

// ── CI context ────────────────────────────────────────────────────────────────
const RUN_URL      = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
const REPORT_TITLE = process.env.REPORT_TITLE || 'HP Smart macOS Tests';
const REPO         = process.env.GITHUB_REPOSITORY  || 'local';
const BRANCH       = process.env.GITHUB_REF_NAME    || 'local';
const ACTOR        = process.env.GITHUB_ACTOR       || 'local';
const RUN_NUM      = process.env.GITHUB_RUN_NUMBER  || '0';
const SHA          = (process.env.GITHUB_SHA || '').slice(0, 7) || 'local';

// ── Parse WDIO per-run JSON ───────────────────────────────────────────────────
let passed = 0, failed = 0, skipped = 0, duration = 0;
let testRows = '';

try {
  const htmlDir   = path.resolve(__dirname, '../test-results/mac/html');
  const jsonFiles = glob.sync('report-*-*.json', { cwd: htmlDir, absolute: true });

  if (jsonFiles.length === 0) {
    throw new Error('No report-N-N.json files found in test-results/mac/html/');
  }

  const latest = jsonFiles
    .map(f => ({ f, mtime: fs.statSync(f).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0].f;

  const report = JSON.parse(fs.readFileSync(latest, 'utf8'));

  if (report.metrics) {
    passed   = report.metrics.passed  || 0;
    failed   = report.metrics.failed  || 0;
    skipped  = report.metrics.skipped || 0;
    duration = report.metrics.duration || 0;
  }

  const badgeBg  = s => s === 'passed' ? '#0d2318' : s === 'failed' ? '#2d1016' : '#1c1a10';
  const badgeBdr = s => s === 'passed' ? '#1a4030' : s === 'failed' ? '#5a1a2a' : '#3a3210';
  const badgeClr = s => s === 'passed' ? '#00c896' : s === 'failed' ? '#ff4d6d' : '#f59e0b';
  const icon     = s => s === 'passed' ? '&#10004;' : s === 'failed' ? '&#10008;' : '&#9654;';
  const ms       = n => n >= 1000 ? (n / 1000).toFixed(1) + 's' : n + 'ms';

  const walkSuite = (suite) => {
    for (const test of (suite.tests || [])) {
      const state  = test.state || 'unknown';
      const title  = test.title || '(no title)';
      const dur    = test._duration || 0;
      const errMsg = (test.events || [])
        .filter(e => e.type && e.type.toLowerCase().includes('error'))
        .map(e => ((e.value || {}).message || '').split('\n')[0].slice(0, 200))
        .filter(Boolean)
        .join('<br>');

      testRows += [
        `<tr style="background:#1a1d27;">`,
        `  <td style="padding:10px 14px;border-bottom:1px solid #2a2d3a;white-space:nowrap;">`,
        `    <span style="display:inline-block;background:${badgeBg(state)};color:${badgeClr(state)};`,
        `      border:1px solid ${badgeBdr(state)};font-size:10px;font-weight:700;letter-spacing:.5px;`,
        `      padding:3px 8px;border-radius:999px;white-space:nowrap;">`,
        `      ${icon(state)} ${state.toUpperCase()}`,
        `    </span>`,
        `  </td>`,
        `  <td style="padding:10px 14px;border-bottom:1px solid #2a2d3a;font-size:12px;color:#e2e8f0;">${title}</td>`,
        `  <td style="padding:10px 14px;border-bottom:1px solid #2a2d3a;font-size:12px;color:#94a3b8;text-align:right;white-space:nowrap;">${ms(dur)}</td>`,
        `  <td style="padding:10px 14px;border-bottom:1px solid #2a2d3a;font-size:11px;color:#ff4d6d;font-family:monospace;">${errMsg}</td>`,
        `</tr>`,
      ].join('\n');
    }
    for (const child of (suite.suites || [])) walkSuite(child);
  };

  for (const suite of (report.suites || [])) walkSuite(suite);

} catch (e) {
  console.warn('⚠ Could not parse WDIO report JSON:', e.message);
  testRows = `<tr><td colspan="4" style="padding:16px 14px;color:#94a3b8;font-style:italic;font-size:13px;background:#1a1d27;">` +
    `No test results found — tests may not have run or the results file is missing.</td></tr>`;
}

// ── Layout constants ──────────────────────────────────────────────────────────
const total       = passed + failed + skipped;
const passRate    = total > 0 ? Math.round((passed / total) * 100) : 0;
const totalDurSec = (duration / 1000).toFixed(1);
const isFailed    = failed > 0;

const BRAND       = '#6c47ff';
const SUCCESS     = '#00c896';
const DANGER      = '#ff4d6d';
const MUTED       = '#94a3b8';
const CARD        = '#1a1d27';
const BORDER      = '#2a2d3a';
const TEXT        = '#e2e8f0';
const TEXT_DIM    = '#94a3b8';

const accentStripe = isFailed ? DANGER : SUCCESS;
const headerGrad   = isFailed
  ? 'linear-gradient(135deg,#2d1016 0%,#1a1d27 100%)'
  : 'linear-gradient(135deg,#0d2318 0%,#1a1d27 100%)';
const statusLabel  = isFailed ? '&#10008; FAILED' : '&#10004; PASSED';
const statusBg     = isFailed ? DANGER : SUCCESS;

const pPass = total > 0 ? (passed  / total * 100).toFixed(1) : '0';
const pFail = total > 0 ? (failed  / total * 100).toFixed(1) : '0';
const pSkip = total > 0 ? (skipped / total * 100).toFixed(1) : '0';

// ── HTML ──────────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HP Smart macOS Test Report</title>
</head>
<body style="margin:0;padding:0;background:#080b12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#080b12;padding:32px 16px;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" role="presentation"
  style="background:${CARD};border-radius:16px;overflow:hidden;border:1px solid ${BORDER};max-width:640px;width:100%;">

  <!-- accent stripe -->
  <tr><td style="height:4px;background:${accentStripe};font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- header -->
  <tr><td style="background:${headerGrad};padding:32px 36px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td>
          <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:2px;color:${MUTED};text-transform:uppercase;">macOS App Automation</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:${TEXT};line-height:1.2;">&#xF8FF; ${REPORT_TITLE}</h1>
          <p style="margin:8px 0 0;font-size:13px;color:${TEXT_DIM};">
            Run&nbsp;<strong style="color:${TEXT};">#${RUN_NUM}</strong>
            &nbsp;&middot;&nbsp;${BRANCH}
            &nbsp;&middot;&nbsp;<code style="background:#ffffff10;padding:1px 6px;border-radius:4px;font-size:12px;">${SHA}</code>
          </p>
        </td>
        <td align="right" valign="top">
          <span style="display:inline-block;background:${statusBg};color:#fff;font-size:13px;font-weight:700;letter-spacing:.5px;padding:8px 18px;border-radius:999px;">
            ${statusLabel}
          </span>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- stats bar -->
  <tr><td style="padding:24px 36px 20px;border-bottom:1px solid ${BORDER};">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="text-align:center;padding:0 12px;">
          <p style="margin:0;font-size:28px;font-weight:700;color:${SUCCESS};">${passed}</p>
          <p style="margin:4px 0 0;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:1px;">Passed</p>
        </td>
        <td style="text-align:center;padding:0 12px;border-left:1px solid ${BORDER};">
          <p style="margin:0;font-size:28px;font-weight:700;color:${DANGER};">${failed}</p>
          <p style="margin:4px 0 0;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:1px;">Failed</p>
        </td>
        <td style="text-align:center;padding:0 12px;border-left:1px solid ${BORDER};">
          <p style="margin:0;font-size:28px;font-weight:700;color:#f59e0b;">${skipped}</p>
          <p style="margin:4px 0 0;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:1px;">Skipped</p>
        </td>
        <td style="text-align:center;padding:0 12px;border-left:1px solid ${BORDER};">
          <p style="margin:0;font-size:28px;font-weight:700;color:${TEXT};">${passRate}%</p>
          <p style="margin:4px 0 0;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:1px;">Pass Rate</p>
        </td>
        <td style="text-align:center;padding:0 12px;border-left:1px solid ${BORDER};">
          <p style="margin:0;font-size:28px;font-weight:700;color:${TEXT};">${totalDurSec}s</p>
          <p style="margin:4px 0 0;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:1px;">Duration</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- pass rate bar -->
  <tr><td style="padding:16px 36px;">
    <p style="margin:0 0 8px;font-size:11px;color:${MUTED};text-transform:uppercase;letter-spacing:1px;">Pass Rate</p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
      style="background:#0d1117;border-radius:999px;overflow:hidden;height:8px;">
      <tr>
        <td style="width:${pPass}%;background:${SUCCESS};height:8px;font-size:0;">&nbsp;</td>
        <td style="width:${pFail}%;background:${DANGER};height:8px;font-size:0;">&nbsp;</td>
        <td style="background:#1a2030;height:8px;font-size:0;">&nbsp;</td>
      </tr>
    </table>
    <p style="margin:6px 0 0;font-size:11px;color:${TEXT_DIM};">${pPass}% passed &middot; ${pFail}% failed &middot; ${pSkip}% skipped</p>
  </td></tr>

  <!-- env details -->
  <tr><td style="padding:0 36px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
      style="background:#0d1117;border-radius:8px;padding:14px 18px;border:1px solid ${BORDER};">
      <tr>
        <td style="font-size:12px;color:${TEXT_DIM};line-height:1.8;">
          <strong style="color:${TEXT};">&#xF8FF; Platform</strong>&nbsp;&nbsp;macOS (macos-latest)<br>
          <strong style="color:${TEXT};">&#x1F50D; App</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HP Smart (com.hp.SmartForDesktop)<br>
          <strong style="color:${TEXT};">&#x26A1; Driver</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Appium + mac2 Driver (XCTest)<br>
          <strong style="color:${TEXT};">&#x1F4E6; Suite</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HP Smart Smoke Tests (6 TCs)<br>
          <strong style="color:${TEXT};">&#x1F91D; Actor</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ACTOR}<br>
          <strong style="color:${TEXT};">&#x1F4E6; Repo</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${REPO}
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- test results table -->
  <tr><td style="padding:0 36px 24px;">
    <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:${TEXT};">Test Results</p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
      style="border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#0d1117;">
          <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:${MUTED};text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid ${BORDER};white-space:nowrap;">Status</th>
          <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:${MUTED};text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid ${BORDER};">Test Case</th>
          <th style="padding:10px 14px;text-align:right;font-size:11px;font-weight:600;color:${MUTED};text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid ${BORDER};white-space:nowrap;">Duration</th>
          <th style="padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:${MUTED};text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid ${BORDER};">Error</th>
        </tr>
      </thead>
      <tbody>
        ${testRows || `<tr><td colspan="4" style="padding:16px 14px;color:${MUTED};font-style:italic;font-size:13px;background:#1a1d27;">No test data available.</td></tr>`}
      </tbody>
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="padding:0 36px 28px;text-align:center;">
    <a href="${RUN_URL}"
      style="display:inline-block;background:${BRAND};color:#fff;font-size:13px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;letter-spacing:.3px;">
      &#x1F4CA; View Full Run Details
    </a>
    &nbsp;&nbsp;
    <a href="${RUN_URL}"
      style="display:inline-block;background:#0d1117;color:${TEXT};border:1px solid ${BORDER};font-size:13px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;letter-spacing:.3px;">
      &#x1F4E5; Download Artifacts
    </a>
  </td></tr>

  <!-- footer -->
  <tr><td style="padding:18px 36px;border-top:1px solid ${BORDER};text-align:center;">
    <p style="margin:0;font-size:11px;color:${MUTED};">
      Powered by AI-Assisted Test Automation Framework &middot; WDIO v9 + Appium + mac2 Driver<br>
      <a href="${RUN_URL}" style="color:${BRAND};text-decoration:none;">Run #${RUN_NUM}</a>
      &nbsp;&middot;&nbsp;${BRANCH}
    </p>
  </td></tr>

</table>
</td></tr>
</table>

</body>
</html>`;

// ── Write output ──────────────────────────────────────────────────────────────
const outPath = path.resolve(__dirname, '../email-body.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`✅ email-body.html written (${passed} passed, ${failed} failed, ${skipped} skipped)`);
