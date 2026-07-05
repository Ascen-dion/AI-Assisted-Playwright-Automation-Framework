/**
 * PR Convention Checker
 * Validates changed files against the AI-Assisted Playwright Automation Framework conventions.
 * Outputs a JSON report to /tmp/convention-report.json
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const changedFilesPath = process.argv[2];
if (!changedFilesPath || !fs.existsSync(changedFilesPath)) {
  console.error('Usage: node check-pr-conventions.js <changed-files.txt>');
  process.exit(1);
}

const reportPath = process.env.CONVENTION_REPORT_PATH
  ? path.resolve(process.env.CONVENTION_REPORT_PATH)
  : path.join(os.tmpdir(), 'convention-report.json');

fs.mkdirSync(path.dirname(reportPath), { recursive: true });

const changedFiles = fs
  .readFileSync(changedFilesPath, 'utf8')
  .split('\n')
  .map(f => f.trim())
  .filter(Boolean);

const violations = [];
const warnings = [];
const passed = [];

// ── Helper ──────────────────────────────────────────────────────────────────
function readFileIfExists(filePath) {
  try {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  } catch {
    return null;
  }
}

function addViolation(file, message, line = null) {
  violations.push({ file, message, line });
}

function addWarning(file, message) {
  warnings.push({ file, message });
}

// ── Convention checks ────────────────────────────────────────────────────────

for (const file of changedFiles) {
  const content = readFileIfExists(file);
  if (!content) continue; // deleted or binary file

  const lines = content.split('\n');

  // ── 1. Spec files: no raw selectors ───────────────────────────────────────
  if (file.match(/\.spec\.(js|ts)$/)) {
    const rawSelectorPatterns = [
      { pattern: /page\.locator\(['"`][.#\[]/, label: 'Raw CSS locator in spec' },
      { pattern: /page\.locator\(['"`]\/\//, label: 'Raw XPath locator in spec' },
      { pattern: /\$\(['"`][.#\[]/, label: 'Raw CSS locator ($ shorthand) in spec' },
    ];

    lines.forEach((line, idx) => {
      rawSelectorPatterns.forEach(({ pattern, label }) => {
        if (pattern.test(line)) {
          addViolation(file, `${label} — move selector to a locators file`, idx + 1);
        }
      });
    });

    // ── 2. Spec files: must have @smoke or @regression tag ──────────────────
    const hasTag = content.includes('@smoke') || content.includes('@regression');
    if (!hasTag) {
      addWarning(file, 'Spec file has no @smoke or @regression tag — add one for CI filtering');
    } else {
      passed.push(`${file}: has CI tag (@smoke/@regression)`);
    }

    // ── 3. Spec files: TestRail C-ID in test titles ──────────────────────────
    const testTitles = [...content.matchAll(/test\(['"](.*?)['"]/g)].map(m => m[1]);
    testTitles.forEach(title => {
      if (!/\[C\d+\]/.test(title)) {
        addWarning(file, `Test title missing TestRail case ID [CXXXXX]: "${title.substring(0, 60)}"`);
      }
    });

    // ── 4. Spec files: hardcoded URLs ────────────────────────────────────────
    const hardcodedUrls = content.match(/https?:\/\/[^\s'"]+/g) || [];
    const nonImportUrls = hardcodedUrls.filter(url =>
      !file.includes('test-data') && !content.includes(`require(`)
    );
    if (nonImportUrls.length > 0 && !content.includes('test-data')) {
      addWarning(file, `Possible hardcoded URL(s) — use src/shared/data/test-data.js instead`);
    }
  }

  // ── 5. Locator files: must be in correct directory ────────────────────────
  if (file.match(/\.locators\.(js|ts)$/)) {
    const validLocatorPaths = [
      'src/web/locators/',
      'src/mobile/locators/',
      'src/mac/locators/',
      'src/windows/locators/',
    ];
    const inValidPath = validLocatorPaths.some(p => file.includes(p));
    if (!inValidPath) {
      addViolation(file, `Locator file must be in one of: ${validLocatorPaths.join(', ')}`);
    } else {
      passed.push(`${file}: locator file in correct directory`);
    }

    // Locator must export an object
    if (!content.includes('module.exports')) {
      addViolation(file, 'Locator file must use module.exports = { ... }');
    }
  }

  // ── 6. Page object files: must be in correct directory ───────────────────
  if (file.match(/\.page\.(js|ts)$/) && !file.includes('.spec.')) {
    const validPagePaths = ['src/web/pages/', 'src/mobile/screens/', 'src/mac/screens/', 'src/windows/screens/'];
    const inValidPath = validPagePaths.some(p => file.includes(p));
    if (!inValidPath) {
      addWarning(file, `Page object should be in one of: ${validPagePaths.join(', ')}`);
    } else {
      passed.push(`${file}: page object in correct directory`);
    }

    // Page objects should not contain expect() assertions
    if (content.includes('expect(')) {
      addViolation(file, 'Page object contains expect() assertions — move assertions to spec files');
    }

    // Page objects should have a goto() method (for web)
    if (file.includes('src/web/pages/') && !content.includes('goto(')) {
      addWarning(file, 'Web page object is missing a goto() method');
    }
  }

  // ── 7. Spec files must not import locators directly ───────────────────────
  if (file.match(/\.spec\.(js|ts)$/) && file.includes('src/web/')) {
    if (content.includes("require('../locators/") || content.includes("require('../../locators/")) {
      addViolation(file, 'Spec file imports locators directly — locators must be accessed via page objects only');
    }
  }

  // ── 8. Workflow files: check for hardcoded secrets ────────────────────────
  if (file.match(/\.ya?ml$/) && file.includes('.github/')) {
    const secretPatterns = [
      /password\s*[:=]\s*['"][^$][^'"]+['"]/i,
      /token\s*[:=]\s*['"][^$][^'"]{10,}['"]/i,
      /api_key\s*[:=]\s*['"][^$][^'"]+['"]/i,
    ];
    lines.forEach((line, idx) => {
      secretPatterns.forEach(pattern => {
        if (pattern.test(line) && !line.includes('${{') && !line.trim().startsWith('#')) {
          addViolation(file, 'Possible hardcoded secret in workflow — use ${{ secrets.SECRET_NAME }}', idx + 1);
        }
      });
    });
  }
}

// ── Summarise ────────────────────────────────────────────────────────────────
const report = { violations, warnings, passed };
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n📋 Convention Check Summary`);
console.log(`  ❌ Violations : ${violations.length}`);
console.log(`  ⚠️  Warnings  : ${warnings.length}`);
console.log(`  ✅ Passed     : ${passed.length}`);
console.log(`  📄 Report     : ${reportPath}`);

if (violations.length > 0) {
  console.log('\n❌ Violations:');
  violations.forEach(v => console.log(`  [${v.file}:${v.line || '?'}] ${v.message}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(w => console.log(`  [${w.file}] ${w.message}`));
}

process.exit(violations.length > 0 ? 1 : 0);
