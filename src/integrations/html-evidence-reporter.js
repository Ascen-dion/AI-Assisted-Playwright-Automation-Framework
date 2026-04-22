// === FILE: src/integrations/html-evidence-reporter.js ===
/**
 * Self-contained HTML Evidence Reporter for Playwright.
 *
 * Generates a single .html file per test run with:
 *   - Dashboard: Test Cases (unique) vs Executions (incl. retries)
 *   - Per-execution step logs with durations
 *   - Screenshots embedded as base64 data-URIs (no external files)
 *   - Video & trace artifacts as clickable file:// links (local) or relative paths (CI)
 *   - Error messages and stack traces
 *   - Unique timestamped filename — no overwrites
 *
 * Output: test-results/reports/evidence-report-YYYY-MM-DD_HHmmss.html
 * Opens in any browser — zero dependencies, zero server needed.
 * Works in both local dev and CI/CD pipelines.
 *
 * Wired via playwright.config.js:
 *   [path.resolve(__dirname, '../src/integrations/html-evidence-reporter.js')]
 */

const fs = require('fs');
const path = require('path');

// CI detection — true when running in GitHub Actions, GitLab CI, Jenkins, Azure DevOps, etc.
const IS_CI = !!(process.env.CI || process.env.GITHUB_ACTIONS || process.env.JENKINS_URL ||
  process.env.GITLAB_CI || process.env.TF_BUILD || process.env.CIRCLECI);

// ── Helpers ──────────────────────────────────────────────────────────────────

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function durationStr(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Read a file and return base64 data-URI, or null on error. */
function fileToDataUri(filePath, mime) {
  try {
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      return `data:${mime};base64,${buf.toString('base64')}`;
    }
  } catch { /* ignore */ }
  return null;
}

// Step titles worth recording in the evidence report
const LOGGABLE_ACTIONS = [
  'click', 'fill', 'type', 'select', 'check', 'uncheck', 'hover',
  'goto', 'navigate', 'reload',
  'waitfor', 'wait for',
  'expect', 'tobevisible', 'tohaveurl', 'tohavetitle', 'tohavetext',
  'tocontaintext', 'tobechecked', 'tobe',
  'press', 'tap', 'dblclick',
  'screenshot', 'evaluate',
];

// ── Reporter class ───────────────────────────────────────────────────────────

class HtmlEvidenceReporter {
  constructor(options = {}) {
    this._outputDir = options.outputDir || path.resolve(process.cwd(), 'test-results/reports');
    this._tests = [];          // collected test results
    this._runStart = null;
    this._config = null;
    this._suite = null;
    this._currentSteps = new Map(); // testId → [{ title, status, duration, error }]
  }

  // ── Lifecycle hooks ─────────────────────────────────────────────────────

  onBegin(config, suite) {
    this._runStart = Date.now();
    this._config = config;
    this._suite = suite;
  }

  onTestBegin(test) {
    this._currentSteps.set(test.id, []);
  }

  onStepBegin(test, _result, step) {
    if (step.category !== 'pw:api') return;
    if (!LOGGABLE_ACTIONS.some((k) => step.title.toLowerCase().includes(k))) return;
    const steps = this._currentSteps.get(test.id) || [];
    steps.push({ title: step.title, status: 'running', duration: 0, error: null, _start: Date.now() });
    this._currentSteps.set(test.id, steps);
  }

  onStepEnd(test, _result, step) {
    if (step.category !== 'pw:api') return;
    const steps = this._currentSteps.get(test.id);
    if (!steps) return;
    const entry = [...steps].reverse().find((s) => s.title === step.title && s.status === 'running');
    if (entry) {
      entry.duration = step.duration || (Date.now() - entry._start);
      entry.status = step.error ? 'failed' : 'passed';
      entry.error = step.error?.message || null;
      delete entry._start;
    }
  }

  onTestEnd(test, result) {
    // Collect attachments
    const screenshots = [];
    const videos = [];
    const traces = [];
    for (const att of result.attachments || []) {
      if (att.contentType?.startsWith('image/')) {
        // Prefer body (buffer) first, fall back to path
        if (att.body) {
          screenshots.push({ name: att.name, dataUri: `data:${att.contentType};base64,${att.body.toString('base64')}` });
        } else if (att.path) {
          const uri = fileToDataUri(att.path, att.contentType);
          if (uri) screenshots.push({ name: att.name, dataUri: uri });
        }
      } else if (att.contentType?.startsWith('video/') && att.path) {
        videos.push(att.path);
      } else if (att.name === 'trace' && att.path) {
        traces.push(att.path);
      }
    }

    const entry = {
      title: test.title,
      fullTitle: test.titlePath().join(' > '),
      file: test.location?.file || '',
      line: test.location?.line || 0,
      // Store the actual attempt status — PASSED or FAILED per execution
      status: result.status,
      duration: result.duration,
      retry: result.retry,
      error: result.error ? { message: result.error.message, stack: result.error.stack } : null,
      steps: this._currentSteps.get(test.id) || [],
      screenshots,
      videos,
      traces,
      tags: test.tags || [],
    };

    // Push every execution attempt — retries are shown separately
    this._tests.push(entry);
  }

  async onEnd(runResult) {
    const runDuration = Date.now() - this._runStart;
    const ts = timestamp();
    const reportDir = this._outputDir;
    const reportPath = path.join(reportDir, `evidence-report-${ts}.html`);

    fs.mkdirSync(reportDir, { recursive: true });

    // ── Stats ──────────────────────────────────────────────────────────
    // "Test Cases" = unique tests (deduplicated by fullTitle)
    const uniqueTests = new Set(this._tests.map((t) => t.fullTitle));
    const testCases = uniqueTests.size;

    // "Executions" = total attempts including retries
    const executions = this._tests.length;

    // Group all attempts by test — ORDER-INDEPENDENT final outcome
    // In serial mode, Playwright may report 'skipped' events for interrupted
    // tests after their retry passes, so "last entry wins" is unreliable.
    const attemptsByTest = new Map();
    for (const t of this._tests) {
      if (!attemptsByTest.has(t.fullTitle)) attemptsByTest.set(t.fullTitle, []);
      attemptsByTest.get(t.fullTitle).push(t.status);
    }

    const finalOutcome = new Map();
    const flakySet = new Set();
    for (const [title, statuses] of attemptsByTest) {
      if (statuses.includes('passed')) {
        // PASSED: at least one attempt succeeded
        finalOutcome.set(title, 'passed');
        // FLAKY: it passed, but also had failures/timeouts (not just skips)
        if (statuses.some((s) => s === 'failed' || s === 'timedOut')) {
          flakySet.add(title);
        }
      } else if (statuses.some((s) => s === 'failed' || s === 'timedOut')) {
        // FAILED: never passed, at least one real failure
        finalOutcome.set(title, 'failed');
      } else {
        // SKIPPED: only skipped/interrupted attempts
        finalOutcome.set(title, 'skipped');
      }
    }

    const passed  = [...finalOutcome.values()].filter((s) => s === 'passed').length;
    const failed  = [...finalOutcome.values()].filter((s) => s === 'failed').length;
    const skipped = [...finalOutcome.values()].filter((s) => s === 'skipped').length;
    const flaky   = flakySet.size;
    const passRate = testCases ? ((passed / testCases) * 100).toFixed(1) : '0.0';

    const html = this._buildHtml({
      ts,
      testCases,
      executions,
      passed,
      failed,
      flaky,
      skipped,
      passRate,
      runDuration,
      tests: this._tests,
    });

    fs.writeFileSync(reportPath, html, 'utf-8');

    // Also write a convenience "latest" copy
    const latestPath = path.join(reportDir, 'evidence-report-latest.html');
    try { fs.copyFileSync(reportPath, latestPath); } catch { /* ignore */ }

    console.log(`\n📊 Evidence Report: ${reportPath}`);
    console.log(`   Latest copy   : ${latestPath}\n`);
  }

  // ── HTML builder ────────────────────────────────────────────────────────

  _buildHtml({ ts, testCases, executions, passed, failed, flaky, skipped, passRate, runDuration, tests }) {
    const testRows = tests.map((t, idx) => this._testCard(t, idx)).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Test Evidence Report — ${ts}</title>
<style>
/* ── Reset & Base ───────────────────────────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#0f1117;color:#e0e0e0;line-height:1.6;padding:0}
a{color:#58a6ff;text-decoration:none}
a:hover{text-decoration:underline}

/* ── Header ─────────────────────────────────────────────────── */
.header{background:linear-gradient(135deg,#161b22 0%,#1c2333 100%);padding:32px 40px;border-bottom:1px solid #30363d}
.header h1{font-size:1.6rem;font-weight:600;color:#f0f6fc}
.header .meta{color:#8b949e;font-size:.85rem;margin-top:6px}
.header .env-badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:.72rem;font-weight:700;letter-spacing:.5px;margin-left:8px}
.env-local{background:#1f3a1f;color:#3fb950}
.env-ci{background:#1f2d3a;color:#58a6ff}

/* ── Dashboard Cards ────────────────────────────────────────── */
.dashboard{display:flex;gap:16px;padding:24px 40px;flex-wrap:wrap}
.card{flex:1;min-width:110px;background:#161b22;border:1px solid #30363d;border-radius:10px;padding:20px;text-align:center}
.card .value{font-size:2rem;font-weight:700;line-height:1}
.card .label{font-size:.72rem;color:#8b949e;text-transform:uppercase;letter-spacing:1px;margin-top:6px}
.card.tests   .value{color:#58a6ff}
.card.execs   .value{color:#79c0ff}
.card.passed  .value{color:#3fb950}
.card.failed  .value{color:#f85149}
.card.flaky   .value{color:#d29922}
.card.skipped .value{color:#8b949e}
.card.rate    .value{color:#bc8cff}
.card.duration .value{color:#79c0ff;font-size:1.4rem}

/* ── Filters ────────────────────────────────────────────────── */
.filters{padding:8px 40px 16px;display:flex;gap:8px;flex-wrap:wrap}
.filters button{background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:.82rem;transition:all .15s}
.filters button:hover,.filters button.active{background:#388bfd;border-color:#388bfd;color:#fff}

/* ── Test Card ──────────────────────────────────────────────── */
.test-list{padding:0 40px 40px}
.test-card{background:#161b22;border:1px solid #30363d;border-radius:10px;margin-bottom:12px;overflow:hidden;transition:border-color .15s}
.test-card:hover{border-color:#484f58}
.test-card.status-passed{border-left:4px solid #3fb950}
.test-card.status-failed,.test-card.status-timedOut{border-left:4px solid #f85149}
.test-card.status-flaky{border-left:4px solid #d29922}
.test-card.status-skipped{border-left:4px solid #8b949e}

.test-header{padding:14px 20px;display:flex;align-items:center;cursor:pointer;gap:12px;user-select:none}
.test-header:hover{background:#1c2333}
.status-badge{font-size:.72rem;font-weight:700;text-transform:uppercase;padding:3px 10px;border-radius:12px;letter-spacing:.5px;white-space:nowrap}
.badge-passed{background:#23312a;color:#3fb950}
.badge-failed,.badge-timedOut{background:#31201f;color:#f85149}
.badge-flaky{background:#2d2a1e;color:#d29922}
.badge-skipped{background:#21262d;color:#8b949e}
.retry-badge{background:#2d2a1e;color:#d29922;font-size:.68rem;padding:2px 7px;border-radius:8px;font-weight:600}
.test-title{flex:1;font-weight:500;font-size:.92rem}
.test-duration{color:#8b949e;font-size:.82rem;white-space:nowrap}
.chevron{transition:transform .2s;color:#8b949e;font-size:.8rem}
.test-card.open .chevron{transform:rotate(90deg)}

.test-body{display:none;padding:0 20px 18px;border-top:1px solid #21262d}
.test-card.open .test-body{display:block}

/* ── Sections inside test body ──────────────────────────────── */
.section-title{font-size:.78rem;color:#8b949e;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;font-weight:600}
.file-ref{font-size:.8rem;color:#58a6ff;margin-bottom:8px;word-break:break-all}
.tags{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px}
.tag{background:#21262d;color:#79c0ff;padding:2px 8px;border-radius:4px;font-size:.72rem}

/* Steps */
.step{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:.84rem;border-bottom:1px solid #21262d}
.step:last-child{border-bottom:none}
.step-icon{width:16px;text-align:center;flex-shrink:0}
.step-icon.ok{color:#3fb950}
.step-icon.fail{color:#f85149}
.step-title{flex:1;word-break:break-word}
.step-dur{color:#8b949e;font-size:.78rem;white-space:nowrap}

/* Error */
.error-box{background:#1c1012;border:1px solid #5d1a1a;border-radius:8px;padding:14px;margin-top:8px}
.error-msg{color:#f85149;font-weight:600;font-size:.88rem;margin-bottom:6px;word-break:break-word}
.error-stack{color:#8b949e;font-size:.76rem;white-space:pre-wrap;word-break:break-word;max-height:200px;overflow-y:auto}

/* Screenshots */
.screenshots{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
.screenshot-thumb{max-width:420px;border-radius:6px;border:1px solid #30363d;cursor:pointer;transition:transform .15s}
.screenshot-thumb:hover{transform:scale(1.02)}

/* Lightbox */
.lightbox{display:none;position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:1000;justify-content:center;align-items:center;cursor:zoom-out}
.lightbox.show{display:flex}
.lightbox img{max-width:92vw;max-height:92vh;border-radius:8px}

/* Artifacts */
.artifact{font-size:.82rem;padding:4px 0;display:flex;align-items:center;gap:6px}
.artifact a{color:#58a6ff}
.artifact .artifact-icon{flex-shrink:0}
.artifact .artifact-cmd{color:#8b949e;font-size:.74rem;font-style:italic}

/* ── Responsive ─────────────────────────────────────────────── */
@media(max-width:700px){
  .header,.dashboard,.filters,.test-list{padding-left:16px;padding-right:16px}
  .card{min-width:90px;padding:14px}
  .card .value{font-size:1.4rem}
}
</style>
</head>
<body>

<!-- ── Header ──────────────────────────────────────────────── -->
<div class="header">
  <h1>Test Execution Evidence Report <span class="env-badge ${IS_CI ? 'env-ci' : 'env-local'}">${IS_CI ? 'CI/CD' : 'LOCAL'}</span></h1>
  <div class="meta">Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp; Run Duration: ${durationStr(runDuration)} &nbsp;|&nbsp; Report ID: ${ts}</div>
</div>

<!-- ── Dashboard ───────────────────────────────────────────── -->
<div class="dashboard">
  <div class="card tests"><div class="value">${testCases}</div><div class="label">Test Cases</div></div>
  <div class="card execs"><div class="value">${executions}</div><div class="label">Executions (incl. retries)</div></div>
  <div class="card passed"><div class="value">${passed}</div><div class="label">Passed</div></div>
  <div class="card failed"><div class="value">${failed}</div><div class="label">Failed</div></div>
  <div class="card flaky"><div class="value">${flaky}</div><div class="label">Flaky</div></div>
  <div class="card skipped"><div class="value">${skipped}</div><div class="label">Skipped</div></div>
  <div class="card rate"><div class="value">${passRate}%</div><div class="label">Pass Rate</div></div>
  <div class="card duration"><div class="value">${durationStr(runDuration)}</div><div class="label">Duration</div></div>
</div>

<!-- ── Filters ─────────────────────────────────────────────── -->
<div class="filters">
  <button class="active" data-filter="all">All (${executions})</button>
  <button data-filter="passed">Passed (${passed})</button>
  <button data-filter="failed">Failed (${failed})</button>
  <button data-filter="flaky">Flaky (${flaky})</button>
  <button data-filter="skipped">Skipped (${skipped})</button>
</div>

<!-- ── Test List ───────────────────────────────────────────── -->
<div class="test-list">
${testRows}
</div>

<!-- ── Lightbox ────────────────────────────────────────────── -->
<div class="lightbox" id="lightbox" onclick="this.classList.remove('show')">
  <img id="lightbox-img" src="" alt="Evidence screenshot">
</div>

<!-- ── Script ──────────────────────────────────────────────── -->
<script>
// Toggle test card expand/collapse
document.querySelectorAll('.test-header').forEach(h=>{
  h.addEventListener('click',()=>h.parentElement.classList.toggle('open'));
});

// Filter buttons
document.querySelectorAll('.filters button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.test-card').forEach(c=>{
      if(f==='all') c.style.display='';
      else c.style.display=c.classList.contains('status-'+f)?'':'none';
    });
  });
});

// Lightbox
function showImg(src){
  const lb=document.getElementById('lightbox');
  document.getElementById('lightbox-img').src=src;
  lb.classList.add('show');
}

// Expand all failed by default
document.querySelectorAll('.test-card.status-failed,.test-card.status-timedOut').forEach(c=>c.classList.add('open'));
</script>
</body>
</html>`;
  }

  _testCard(t, idx) {
    const statusClass = t.status === 'timedOut' ? 'timedOut' : t.status;
    const badgeClass = t.status === 'timedOut' ? 'timedOut' : t.status;
    const badgeLabel = t.status === 'timedOut' ? 'TIMEOUT' : t.status.toUpperCase();
    const retryBadge = t.retry > 0 ? `<span class="retry-badge">Retry #${t.retry}</span>` : '';

    // Steps HTML
    let stepsHtml = '';
    if (t.steps.length > 0) {
      stepsHtml = `<div class="section-title">Execution Steps</div>` +
        t.steps.map((s) => {
          const icon = s.status === 'passed' ? `<span class="step-icon ok">&#10003;</span>` : `<span class="step-icon fail">&#10007;</span>`;
          return `<div class="step">${icon}<span class="step-title">${escapeHtml(s.title)}</span><span class="step-dur">${durationStr(s.duration)}</span></div>`;
        }).join('');
    }

    // Error HTML
    let errorHtml = '';
    if (t.error) {
      errorHtml = `<div class="error-box">
        <div class="error-msg">${escapeHtml(t.error.message)}</div>
        <div class="error-stack">${escapeHtml(t.error.stack)}</div>
      </div>`;
    }

    // Screenshots HTML
    let screenshotHtml = '';
    if (t.screenshots.length > 0) {
      screenshotHtml = `<div class="section-title">Screenshots (Evidence)</div><div class="screenshots">` +
        t.screenshots.map((s) => `<img class="screenshot-thumb" src="${s.dataUri}" alt="${escapeHtml(s.name)}" title="${escapeHtml(s.name)}" onclick="showImg(this.src)">`).join('') +
        `</div>`;
    }

    // Videos & Traces — clickable links with short names
    let artifactHtml = '';
    const artifactItems = [];
    const cwd = process.cwd();
    t.videos.forEach((v) => {
      const shortName = path.basename(v);
      const relPath = path.relative(cwd, v).replace(/\\/g, '/');
      if (IS_CI) {
        artifactItems.push(`<div class="artifact"><span class="artifact-icon">🎬</span> <span>Video: ${escapeHtml(relPath)}</span></div>`);
      } else {
        const fileUri = 'file:///' + v.replace(/\\/g, '/');
        artifactItems.push(`<div class="artifact"><span class="artifact-icon">🎬</span> <a href="${escapeHtml(fileUri)}" title="${escapeHtml(relPath)}">${escapeHtml(shortName)}</a></div>`);
      }
    });
    t.traces.forEach((v) => {
      const shortName = path.basename(v);
      const relPath = path.relative(cwd, v).replace(/\\/g, '/');
      if (IS_CI) {
        artifactItems.push(`<div class="artifact"><span class="artifact-icon">📋</span> <span>Trace: ${escapeHtml(relPath)}</span> <span class="artifact-cmd">npx playwright show-trace ${escapeHtml(relPath)}</span></div>`);
      } else {
        const fileUri = 'file:///' + v.replace(/\\/g, '/');
        artifactItems.push(`<div class="artifact"><span class="artifact-icon">📋</span> <a href="${escapeHtml(fileUri)}" title="${escapeHtml(relPath)}">${escapeHtml(shortName)}</a> <span class="artifact-cmd">npx playwright show-trace "${escapeHtml(relPath)}"</span></div>`);
      }
    });
    if (artifactItems.length) {
      artifactHtml = `<div class="section-title">Artifacts</div>` + artifactItems.join('');
    }

    // Tags
    let tagHtml = '';
    if (t.tags.length > 0) {
      tagHtml = `<div class="tags">${t.tags.map((tg) => `<span class="tag">${escapeHtml(tg)}</span>`).join('')}</div>`;
    }

    return `<div class="test-card status-${statusClass}" data-idx="${idx}">
  <div class="test-header">
    <span class="status-badge badge-${badgeClass}">${badgeLabel}</span>
    ${retryBadge}
    <span class="test-title">${escapeHtml(t.title)}</span>
    <span class="test-duration">${durationStr(t.duration)}</span>
    <span class="chevron">&#9654;</span>
  </div>
  <div class="test-body">
    <div class="file-ref">${escapeHtml(t.file)}:${t.line}</div>
    ${tagHtml}
    ${stepsHtml}
    ${errorHtml}
    ${screenshotHtml}
    ${artifactHtml}
  </div>
</div>`;
  }
}

module.exports = HtmlEvidenceReporter;
