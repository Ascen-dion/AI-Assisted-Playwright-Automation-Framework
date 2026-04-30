/**
 * DIAGNOSTIC: Dumps the view tree after search to find real node.type values.
 * Run: npx mobilewright test mobile/tests/debug-viewtree.spec.js
 */
const { test, expect } = require('@mobilewright/test');
const YoutubeHomePage  = require('../pages/youtube-home.page');
const YoutubeSearchPage = require('../pages/youtube-search.page');

test.use({ platform: 'android', bundleId: 'com.google.android.youtube' });

test('[DEBUG] Print view tree after search', { timeout: 120000 }, async ({ device, screen }) => {
  const homePage   = new YoutubeHomePage(device, screen);
  const searchPage = new YoutubeSearchPage(device, screen);

  await homePage.goto();
  await homePage.tapSearch();
  await searchPage.waitForSearchInput();

  // Fill query but use ENTER via screen.pressButton
  const TD = require('../data/youtube-test-data');
  const loc = require('../pages/locators/youtube-search.locators');
  await loc.searchInput(screen).fill(TD.search.query);
  await screen.pressButton('ENTER');

  // Wait a bit for results to load
  await new Promise(r => setTimeout(r, 5000));

  // Dump the view tree
  const tree = await screen.viewTree();

  function flattenTree(nodes, depth = 0) {
    const results = [];
    for (const node of nodes) {
      results.push({
        depth,
        type: node.type,
        label: node.label,
        text: node.text,
        isVisible: node.isVisible,
        bounds: node.bounds,
        raw_class: node.raw?.class,
      });
      if (node.children) {
        results.push(...flattenTree(node.children, depth + 1));
      }
    }
    return results;
  }

  const flat = flattenTree(tree);
  const unique = [...new Set(flat.map(n => n.type))].sort();
  console.log('\n=== UNIQUE NODE TYPES ===');
  for (const t of unique) {
    console.log(`  type: "${t}"`);
  }

  console.log('\n=== VISIBLE NODES (top 30) ===');
  const visible = flat.filter(n => n.isVisible).slice(0, 30);
  for (const n of visible) {
    console.log(`  type="${n.type}" label="${n.label || ''}" text="${n.text || ''}" bounds=${JSON.stringify(n.bounds)} raw_class="${n.raw_class || ''}"`);
  }
});
