/**
 * Generates a modern dark-theme HTML email report from test-results/results.json.
 * Called by the GitHub Actions "Prepare email content" step:
 *   node scripts/generate-email.js
 * Writes: email-body.html
 */
'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs   = require('fs');
const path = require('path');

const RUN_URL = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
const REPORT_TITLE = process.env.REPORT_TITLE || 'Playwright AI Framework';
const REPO    = process.env.GITHUB_REPOSITORY || '';
const BRANCH  = process.env.GITHUB_REF_NAME  || '';
const ACTOR   = process.env.GITHUB_ACTOR     || '';
const RUN_NUM = process.env.GITHUB_RUN_NUMBER || '';
const SHA     = (process.env.GITHUB_SHA || '').slice(0, 7);

// ── parse results.json ───────────────────────────────────────────────────────
let passed = 0, failed = 0, skipped = 0, duration = 0;
let testRows = '';

try {
  const raw    = fs.readFileSync('test-results/results.json', 'utf8');
  const report = JSON.parse(raw);

  const badgeBg  = s => s === 'passed' ? '#0d2318' : s === 'failed' ? '#2d1016' : '#1c1a10';
  const badgeBdr = s => s === 'passed' ? '#1a4030' : s === 'failed' ? '#5a1a2a' : '#3a3210';
  const badgeClr = s => s === 'passed' ? '#00c896' : s === 'failed' ? '#ff4d6d' : '#f59e0b';
  const icon     = s => s === 'passed' ? '&#10004;' : s === 'failed' ? '&#10008;' : s === 'skipped' ? '&#9654;' : '&#9888;';
  const ms       = n => n >= 1000 ? (n / 1000).toFixed(1) + 's' : n + 'ms';

  const resolveStatus = (test) => {
    const last = (test.results || []).at(-1);
    if (last) return last.status;
    const map = { expected: 'passed', unexpected: 'failed', flaky: 'flaky', skipped: 'skipped' };
    return map[test.status] || test.status || 'unknown';
  };

  const walk = (suites, parentName) => {
    for (const suite of (suites || [])) {
      const name = suite.title || parentName || '';
      walk(suite.suites || [], name);
      for (const spec of (suite.specs || [])) {
        for (const test of (spec.tests || [])) {
          const status   = resolveStatus(test);
          const fullName = [name, spec.title].filter(Boolean).join(' › ');
          const dur      = (test.results || []).reduce((a, r) => a + (r.duration || 0), 0);
          const errMsg   = (test.results || [])
            .flatMap(r => r.errors || [])
            .map(e => (e.message || '').split('\n')[0].slice(0, 200))
            .filter(Boolean)
            .join('<br>');

          if (status === 'passed')                              passed++;
          else if (status === 'failed' || status === 'timedOut') failed++;
          else                                                   skipped++;
          duration += dur;

          testRows += [
            `<tr style="background:#1a1d27;">`,
            `  <td style="padding:10px 14px;border-bottom:1px solid #2a2d3a;">`,
            `    <span style="display:inline-block;background:${badgeBg(status)};color:${badgeClr(status)};`,
            `      border:1px solid ${badgeBdr(status)};font-size:10px;font-weight:700;letter-spacing:.5px;`,
            `      padding:3px 8px;border-radius:999px;white-space:nowrap;">`,
            `      ${icon(status)} ${status.toUpperCase()}`,
            `    </span>`,
            `  </td>`,
            `  <td style="padding:10px 14px;border-bottom:1px solid #2a2d3a;font-size:12px;color:#e2e8f0;">${fullName}</td>`,
            `  <td style="padding:10px 14px;border-bottom:1px solid #2a2d3a;font-size:12px;color:#94a3b8;text-align:right;white-space:nowrap;">${ms(dur)}</td>`,
            `  <td style="padding:10px 14px;border-bottom:1px solid #2a2d3a;font-size:11px;color:#ff4d6d;font-family:monospace;">${errMsg}</td>`,
            `</tr>`,
          ].join('\n');
        }
      }
    }
  };

  walk(report.suites || []);
} catch (e) {
  testRows = `<tr><td colspan="4" style="padding:16px 14px;color:#94a3b8;font-style:italic;font-size:13px;background:#1a1d27;">No results.json found — tests may not have run or the file path is different.</td></tr>`;
}

// ── layout constants ─────────────────────────────────────────────────────────
const total        = passed + failed + skipped;
const passRate     = total > 0 ? Math.round((passed / total) * 100) : 0;
const totalDurSec  = (duration / 1000).toFixed(1);
const isFailed     = failed > 0;

const BRAND        = '#6c47ff';
const SUCCESS      = '#00c896';
const DANGER       = '#ff4d6d';
const WARN         = '#f59e0b';
const MUTED        = '#94a3b8';
const CARD         = '#1a1d27';
const BORDER       = '#2a2d3a';
const TEXT         = '#e2e8f0';
const TEXT_DIM     = '#94a3b8';

const accentStripe = isFailed ? DANGER : SUCCESS;
const headerGrad   = isFailed
  ? 'linear-gradient(135deg,#2d1016 0%,#1a1d27 100%)'
  : 'linear-gradient(135deg,#0d2318 0%,#1a1d27 100%)';
const statusLabel  = isFailed ? '&#10008; FAILED' : '&#10004; PASSED';
const statusBg     = isFailed ? DANGER : SUCCESS;

const pPass = total > 0 ? (passed  / total * 100).toFixed(1) : '0';
const pFail = total > 0 ? (failed  / total * 100).toFixed(1) : '0';
const pSkip = total > 0 ? (skipped / total * 100).toFixed(1) : '0';

// ── HTML ─────────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Playwright Report</title>
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
          <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:2px;color:${MUTED};text-transform:uppercase;">CI / CD Pipeline</p>
          <h1 style="margin:0;font-size:26px;font-weight:700;color:${TEXT};line-height:1.2;">${REPORT_TITLE}</h1>
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

  <!-- stat cards -->
  <tr><td style="padding:28px 36px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td width="23%" style="background:#0d2318;border:1px solid #1a4030;border-radius:12px;padding:16px 12px;text-align:center;">
          <p style="margin:0;font-size:30px;font-weight:800;color:${SUCCESS};">${passed}</p>
          <p style="margin:4px 0 0;font-size:11px;font-weight:600;letter-spacing:1px;color:${SUCCESS};text-transform:uppercase;opacity:.8;">Passed</p>
        </td>
        <td width="4%"></td>
        <td width="23%" style="background:${isFailed ? '#2d1016' : '#1a1d27'};border:1px solid ${isFailed ? '#5a1a2a' : BORDER};border-radius:12px;padding:16px 12px;text-align:center;">
          <p style="margin:0;font-size:30px;font-weight:800;color:${DANGER};">${failed}</p>
          <p style="margin:4px 0 0;font-size:11px;font-weight:600;letter-spacing:1px;color:${DANGER};text-transform:uppercase;opacity:.8;">Failed</p>
        </td>
        <td width="4%"></td>
        <td width="23%" style="background:#1c1a10;border:1px solid #3a3210;border-radius:12px;padding:16px 12px;text-align:center;">
          <p style="margin:0;font-size:30px;font-weight:800;color:${WARN};">${skipped}</p>
          <p style="margin:4px 0 0;font-size:11px;font-weight:600;letter-spacing:1px;color:${WARN};text-transform:uppercase;opacity:.8;">Skipped</p>
        </td>
        <td width="4%"></td>
        <td width="19%" style="background:#16122a;border:1px solid #2e2460;border-radius:12px;padding:16px 12px;text-align:center;">
          <p style="margin:0;font-size:30px;font-weight:800;color:${BRAND};">${passRate}%</p>
          <p style="margin:4px 0 0;font-size:11px;font-weight:600;letter-spacing:1px;color:${BRAND};text-transform:uppercase;opacity:.8;">Pass Rate</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- progress bar -->
  <tr><td style="padding:20px 36px 0;">
    <p style="margin:0 0 8px;font-size:11px;color:${TEXT_DIM};font-weight:500;">
      ${total} tests &nbsp;&middot;&nbsp; ${totalDurSec}s total
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:999px;overflow:hidden;height:8px;background:${BORDER};">
      <tr>
        <td width="${pPass}%" style="background:${SUCCESS};height:8px;font-size:0;">&nbsp;</td>
        <td width="${pFail}%" style="background:${DANGER};height:8px;font-size:0;">&nbsp;</td>
        <td width="${pSkip}%" style="background:${WARN};height:8px;font-size:0;">&nbsp;</td>
        <td style="background:${BORDER};height:8px;font-size:0;">&nbsp;</td>
      </tr>
    </table>
  </td></tr>

  <!-- meta -->
  <tr><td style="padding:20px 36px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#13161f;border:1px solid ${BORDER};border-radius:10px;">
      <tr>
        <td style="padding:14px 18px;border-right:1px solid ${BORDER};width:25%;">
          <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${MUTED};">Repo</p>
          <p style="margin:4px 0 0;font-size:12px;color:${TEXT};font-weight:500;word-break:break-all;">${REPO}</p>
        </td>
        <td style="padding:14px 18px;border-right:1px solid ${BORDER};width:25%;">
          <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${MUTED};">Branch</p>
          <p style="margin:4px 0 0;font-size:12px;color:${TEXT};font-weight:500;">${BRANCH}</p>
        </td>
        <td style="padding:14px 18px;border-right:1px solid ${BORDER};width:25%;">
          <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${MUTED};">Triggered by</p>
          <p style="margin:4px 0 0;font-size:12px;color:${TEXT};font-weight:500;">${ACTOR}</p>
        </td>
        <td style="padding:14px 18px;width:25%;">
          <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:${MUTED};">Run</p>
          <p style="margin:4px 0 0;font-size:12px;font-weight:500;">
            <a href="${RUN_URL}" style="color:${BRAND};text-decoration:none;">#${RUN_NUM} &rarr;</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- results table -->
  <tr><td style="padding:24px 36px 0;">
    <p style="margin:0 0 12px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${TEXT_DIM};">Test Results</p>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:10px;overflow:hidden;border:1px solid ${BORDER};">
      <tr style="background:#13161f;">
        <th style="padding:10px 14px;text-align:left;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};font-weight:600;width:80px;border-bottom:1px solid ${BORDER};">Status</th>
        <th style="padding:10px 14px;text-align:left;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};font-weight:600;border-bottom:1px solid ${BORDER};">Test Name</th>
        <th style="padding:10px 14px;text-align:right;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};font-weight:600;width:60px;border-bottom:1px solid ${BORDER};">Time</th>
        <th style="padding:10px 14px;text-align:left;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:${MUTED};font-weight:600;border-bottom:1px solid ${BORDER};">Error</th>
      </tr>
      ${testRows}
    </table>
  </td></tr>

  <!-- cta -->
  <tr><td style="padding:28px 36px;">
    <a href="${RUN_URL}" style="display:inline-block;background:${BRAND};color:#fff;padding:13px 28px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:.3px;">
      View Full Report &amp; Artifacts &nbsp;&rarr;
    </a>
  </td></tr>

  <!-- footer -->
  <tr><td style="background:#13161f;padding:16px 36px;border-top:1px solid ${BORDER};">
    <p style="margin:0;font-size:11px;color:${MUTED};">
      Automated by <strong style="color:${TEXT_DIM};">${REPORT_TITLE}</strong>
      &nbsp;&middot;&nbsp; ${REPO}
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

fs.writeFileSync('email-body.html', html);
console.log(`Email prepared: ${passed} passed, ${failed} failed, ${skipped} skipped (${passRate}% pass rate)`);
