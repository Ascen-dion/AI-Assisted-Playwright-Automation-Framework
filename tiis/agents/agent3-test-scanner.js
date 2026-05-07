/**
 * TIIS — Agent 3: Test Inventory Scanner
 *
 * Responsibility: Scan the local test folder and build a coverage map
 * linking each known application feature to the test files that cover it.
 *
 * Input:  config (feature map + test root paths)
 * Output: {
 *   totalTestFiles,
 *   coverageMap: { featureName: { covered, tests: [{ file, describes[] }] } },
 *   coveredFeatures[],
 *   gapFeatures[]
 * }
 *
 * NO AI — pure Node.js filesystem scan. Fast and deterministic.
 * Works for any test framework: Playwright, Cypress, JUnit, pytest, etc.
 * Matching is done by filename keywords + describe() block names.
 */

const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

class TestInventoryScanner {
  constructor(config) {
    this.rootPaths = config.testInventory.rootPaths;
    this.featureMap = config.appKnowledge.featureMap;
    this.featureNames = Object.keys(this.featureMap);
    this.cwd = process.cwd();
  }

  /**
   * Scan test directories and return a coverage map.
   * @returns {Object}
   */
  scan() {
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
