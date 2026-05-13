/**
 * TIIS — Agent 3: Test Inventory Scanner
 *
 * Responsibility: Build a coverage map linking each known application feature
 * to the tests that cover it. Supports two providers:
 *
 *   provider: 'testrail'   — reads testrail-case-map.json (case titles + IDs)
 *   provider: 'filesystem' — scans local spec files (*.spec.js/ts/mjs)
 *
 * Input:  config (feature map + testInventory settings)
 * Output: {
 *   totalTestFiles,   ← total cases (testrail) or spec files (filesystem)
 *   coverageMap: { featureName: { covered, tests: [{ caseId, title }|{ file, describes[] }] } },
 *   coveredFeatures[],
 *   gapFeatures[]
 * }
 *
 * NO AI — pure Node.js. Fast and deterministic.
 */

const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

class TestInventoryScanner {
  constructor(config) {
    this.provider = config.testInventory.provider || 'filesystem';
    this.rootPaths = config.testInventory.rootPaths || [];
    this.caseMapPath = config.testInventory.caseMapPath ||
      './src/shared/traceability/testrail-case-map.json';
    this.featureMap = config.appKnowledge.featureMap;
    this.featureNames = Object.keys(this.featureMap);
    this.cwd = process.cwd();
  }

  /**
   * Entry point — delegates to the correct provider.
   * @returns {Object}
   */
  scan() {
    if (this.provider === 'testrail') {
      return this._scanFromTestRail();
    }
    return this._scanFromFilesystem();
  }

  // ─── Provider: TestRail case map ──────────────────────────────────────────

  /**
   * Read testrail-case-map.json and build coverage map from case titles.
   * Each case title is matched against feature keywords.
   * Output shape is identical to _scanFromFilesystem() for Agent 4 compatibility.
   */
  _scanFromTestRail() {
    logger.info('📂 Agent 3 — Test Scanner: Loading test inventory from TestRail case map...');

    const absPath = path.resolve(this.cwd, this.caseMapPath);
    if (!fs.existsSync(absPath)) {
      logger.warn(`⚠️  TestRail case map not found at ${this.caseMapPath} — returning empty inventory`);
      return { totalTestFiles: 0, coverageMap: {}, coveredFeatures: [], gapFeatures: [...this.featureNames] };
    }

    const caseMap = JSON.parse(fs.readFileSync(absPath, 'utf8'));
    const allCases = Object.entries(caseMap.cases || {}).map(([title, id]) => ({
      caseId: `C${id}`,
      title,
    }));
    logger.info(`   Loaded ${allCases.length} TestRail cases from ${this.caseMapPath}`);

    // Build blank coverage map
    const coverageMap = {};
    for (const featureName of this.featureNames) {
      coverageMap[featureName] = { covered: false, tests: [] };
    }

    // Match each case title against feature keywords
    for (const tc of allCases) {
      const titleLower = tc.title.toLowerCase();
      for (const featureName of this.featureNames) {
        const keywords = this._toKeywords(featureName);
        if (keywords.some((kw) => titleLower.includes(kw))) {
          coverageMap[featureName].covered = true;
          coverageMap[featureName].tests.push({ caseId: tc.caseId, title: tc.title });
        }
      }
    }

    const coveredFeatures = this.featureNames.filter((f) => coverageMap[f].covered);
    const gapFeatures = this.featureNames.filter((f) => !coverageMap[f].covered);

    logger.info(
      `✅ Agent 3 done — ${allCases.length} TestRail cases loaded | ` +
      `${coveredFeatures.length} features covered | ${gapFeatures.length} coverage gaps`
    );

    return {
      totalTestFiles: allCases.length,
      coverageMap,
      coveredFeatures,
      gapFeatures,
    };
  }

  // ─── Provider: Filesystem spec scan ──────────────────────────────────────

  /**
   * Walk rootPaths, find *.spec.* files, and match by filename + describe blocks.
   */
  _scanFromFilesystem() {
    logger.info('📂 Agent 3 — Test Scanner: Scanning test inventory...');

    // 1. Collect all spec files
    const allTestFiles = [];
    for (const rootPath of this.rootPaths) {
      const absPath = path.resolve(this.cwd, rootPath);
      if (fs.existsSync(absPath)) {
        const found = this._findSpecFiles(absPath);
        allTestFiles.push(...found);
        logger.info(`   Found ${found.length} spec files in ${rootPath}`);
      } else {
        logger.info(`   Skipping ${rootPath} (directory does not exist yet)`);
      }
    }

    // 2. Build a blank coverage map for every known feature
    const coverageMap = {};
    for (const featureName of this.featureNames) {
      coverageMap[featureName] = { covered: false, tests: [] };
    }

    // 3. Match each test file to features by keyword
    for (const testFile of allTestFiles) {
      const relativePath = path.relative(this.cwd, testFile).replace(/\\/g, '/');
      const fileName = path.basename(testFile, path.extname(testFile)).toLowerCase();
      const content = this._readFile(testFile);
      const describes = this._extractDescribeBlocks(content);

      for (const featureName of this.featureNames) {
        const keywords = this._toKeywords(featureName);
        const matchedInFile = keywords.some((kw) => fileName.includes(kw));
        const matchedInDescribe = describes.some((d) =>
          keywords.some((kw) => d.toLowerCase().includes(kw))
        );

        if (matchedInFile || matchedInDescribe) {
          coverageMap[featureName].covered = true;
          coverageMap[featureName].tests.push({ file: relativePath, describes });
        }
      }
    }

    const coveredFeatures = this.featureNames.filter((f) => coverageMap[f].covered);
    const gapFeatures = this.featureNames.filter((f) => !coverageMap[f].covered);

    logger.info(
      `✅ Agent 3 done — ${allTestFiles.length} test files found | ` +
      `${coveredFeatures.length} features covered | ${gapFeatures.length} coverage gaps`
    );

    return {
      totalTestFiles: allTestFiles.length,
      coverageMap,
      coveredFeatures,
      gapFeatures,
    };
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  /** Recursively find all *.spec.{js,ts,mjs,mts} files under a directory */
  _findSpecFiles(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...this._findSpecFiles(full));
      } else if (/\.spec\.(js|ts|mjs|mts|jsx|tsx)$/.test(entry.name)) {
        results.push(full);
      }
    }
    return results;
  }

  _readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch {
      return '';
    }
  }

  /** Extract all describe('...') / describe("...") block names from test file content */
  _extractDescribeBlocks(content) {
    const matches = [];
    const re = /describe\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      matches.push(m[1]);
    }
    return matches;
  }

  /**
   * Convert a feature name like "Products Catalog" into keywords: ["products", "catalog"]
   * Short words (≤2 chars) are excluded to avoid false positives.
   */
  _toKeywords(featureName) {
    return featureName
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }
}

module.exports = TestInventoryScanner;
