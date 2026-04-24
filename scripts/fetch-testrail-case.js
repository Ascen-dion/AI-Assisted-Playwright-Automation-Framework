/**
 * Fetch TestRail Case(s) by ID
 *
 * Retrieves full test case details from TestRail for one or more case IDs.
 * Used by the testrail-to-automation agent (Phase 1) to get structured test
 * case data before generating Playwright automation code.
 *
 * Usage:
 *   node scripts/fetch-testrail-case.js <caseId1> [caseId2] [caseId3] ...
 *
 * Examples:
 *   node scripts/fetch-testrail-case.js 644
 *   node scripts/fetch-testrail-case.js 644 645 650
 *   node scripts/fetch-testrail-case.js C644 C645         (C prefix is stripped automatically)
 *
 * Required env vars (.env):
 *   TESTRAIL_HOST=https://yourcompany.testrail.io
 *   TESTRAIL_USER=you@company.com
 *   TESTRAIL_API_KEY=your-api-key
 *
 * Output:
 *   Prints a JSON array of test case objects to stdout.
 *   Each object contains: id, title, preconditions, steps, expected, refs,
 *   type_id, priority_id, section_id, suite_id.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const axios = require('axios');

// ── Configuration ──────────────────────────────────────────────────────────
const HOST    = process.env.TESTRAIL_HOST;
const USER    = process.env.TESTRAIL_USER;
const API_KEY = process.env.TESTRAIL_API_KEY;

if (!HOST || !USER || !API_KEY) {
  console.error('❌ Missing TestRail credentials. Set these in .env:');
  console.error('   TESTRAIL_HOST=https://yourcompany.testrail.io');
  console.error('   TESTRAIL_USER=you@company.com');
  console.error('   TESTRAIL_API_KEY=your-api-key');
  process.exit(1);
}

const client = axios.create({
  baseURL: `${HOST}/index.php?/api/v2`,
  auth: { username: USER, password: API_KEY },
  headers: { 'Content-Type': 'application/json' },
});

// ── Parse CLI arguments ────────────────────────────────────────────────────
const rawArgs = process.argv.slice(2);

if (rawArgs.length === 0) {
  console.error('❌ No case IDs provided.');
  console.error('   Usage: node scripts/fetch-testrail-case.js <caseId1> [caseId2] ...');
  console.error('   Example: node scripts/fetch-testrail-case.js 644 645 650');
  process.exit(1);
}

// Strip optional C prefix and deduplicate
const caseIds = [...new Set(
  rawArgs.map(arg => {
    const cleaned = arg.replace(/^[Cc]/, '').trim();
    const num = parseInt(cleaned, 10);
    if (isNaN(num) || num <= 0) {
      console.error(`❌ Invalid case ID: "${arg}" — must be a positive integer (with optional C prefix).`);
      process.exit(1);
    }
    return num;
  })
)];

// ── Fetch a single test case ───────────────────────────────────────────────
async function fetchCase(caseId) {
  try {
    const response = await client.get(`/get_case/${caseId}`);
    const c = response.data;

    // Normalise custom fields — TestRail uses custom_steps_separated or custom_steps
    let steps = '';
    if (c.custom_steps_separated && Array.isArray(c.custom_steps_separated)) {
      steps = c.custom_steps_separated
        .map((s, i) => `${i + 1}. ${s.content}`)
        .join('\n');
    } else {
      steps = c.custom_steps || '';
    }

    let expected = '';
    if (c.custom_steps_separated && Array.isArray(c.custom_steps_separated)) {
      expected = c.custom_steps_separated
        .filter(s => s.expected)
        .map(s => s.expected)
        .join('\n');
    } else {
      expected = c.custom_expected || '';
    }

    return {
      id: c.id,
      title: c.title || '',
      preconditions: c.custom_preconds || '',
      steps,
      expected,
      refs: c.refs || '',
      type_id: c.type_id || null,
      priority_id: c.priority_id || null,
      section_id: c.section_id || null,
      suite_id: c.suite_id || null,
    };
  } catch (error) {
    const status = error.response?.status;
    const msg = error.response?.data?.error || error.message;

    if (status === 400) {
      console.error(`❌ Case C${caseId}: Not found or invalid ID. (${msg})`);
    } else if (status === 401 || status === 403) {
      console.error(`❌ Case C${caseId}: Authentication failed. Check TESTRAIL_USER and TESTRAIL_API_KEY.`);
    } else {
      console.error(`❌ Case C${caseId}: Failed to fetch — ${msg}`);
    }
    return null;
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.error(`\n🔍 Fetching ${caseIds.length} TestRail case(s): ${caseIds.map(id => `C${id}`).join(', ')}\n`);

  const results = [];

  for (const caseId of caseIds) {
    const data = await fetchCase(caseId);
    if (data) {
      results.push(data);
      console.error(`   ✅ C${data.id}: ${data.title}`);
    }
  }

  if (results.length === 0) {
    console.error('\n❌ No cases fetched successfully. Check your case IDs and credentials.');
    process.exit(1);
  }

  console.error(`\n✅ Successfully fetched ${results.length}/${caseIds.length} case(s).\n`);

  // Output the structured JSON to stdout (agent consumes this)
  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => {
  console.error('❌ Unhandled error:', err.message);
  process.exit(1);
});
