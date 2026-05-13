/**
 * TIIS — Test Impact Intelligence System
 * Configuration for: AI-Assisted-Test-Automation-Framework
 *
 * Repo:   https://github.com/Ascen-dion/AI-Assisted-Test-Automation-Framework
 * Stack:  Node.js, Playwright, React (UI), MCP integrations, TestRail/Jira
 *
 * To adapt for a different project:
 *   1. Update vcs.owner / vcs.repo
 *   2. Update appKnowledge.featureMap with the new app's file layout
 *   3. Update testInventory.rootPaths to point at test folders
 */

module.exports = {
  project: {
    name: 'aava-ecom-demo', 
    appUrl: 'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net',
  },

  vcs: {
    provider: 'github',
    owner: 'karansethiascendion',
    repo: 'aava-ecom-demo',
    defaultBranch: 'main',
  },

  testInventory: {
    provider: 'testrail',
    caseMapPath: './src/shared/traceability/testrail-case-map.json',
    // fallback filesystem paths (used when provider is switched back to 'filesystem')
    rootPaths: ['./src/web/tests', './src/mobile/tests'],
    filePattern: '**/*.spec.*',
  },

  /**
   * Feature Map — maps E-Shop application features to their source files.
   *
   * PURPOSE (TIIS only):
   *   - Agent 2 uses this to map changed PR files → feature names
   *   - Agent 3 uses feature names as keywords to match against TestRail case titles
   *   - Agent 4 uses feature names as labels in the impact report
   *
   * HOW TO UPDATE: Add a new entry when a new testable area is introduced.
   * Keys = feature names used verbatim in the impact report.
   */
  appKnowledge: {
    featureMap: {
      'Homepage': {
        files: [
          'src/components/Home.jsx',
          'src/pages/Home.jsx',
          'src/pages/HomePage.jsx',
          'src/App.js',
        ],
        description: 'E-Shop homepage with hero heading, Shop Now button, tagline, and feature cards (Free Shipping, Secure Payment, Easy Returns, Quality Products)',
      },

      'Navigation': {
        files: [
          'src/components/Navbar.jsx',
          'src/components/Nav.jsx',
          'src/components/Header.jsx',
          'src/components/NavBar.jsx',
        ],
        description: 'Navigation bar with E-Shop logo, Home link, Products link, and Cart link; active styling on current page',
      },

      'Products': {
        files: [
          'src/components/Products.jsx',
          'src/pages/Products.jsx',
          'src/pages/ProductsPage.jsx',
          'src/components/ProductCard.jsx',
          'src/components/ProductList.jsx',
        ],
        description: 'Products page with Our Products heading, search input, category filter, product cards showing name/price/image/stock status and Add to Cart button',
      },

      'Cart': {
        files: [
          'src/components/Cart.jsx',
          'src/pages/Cart.jsx',
          'src/pages/CartPage.jsx',
          'src/context/CartContext.jsx',
          'src/context/CartProvider.jsx',
        ],
        description: 'Shopping Cart page with item list, quantity controls, Remove button, Order Summary (Subtotal/Shipping), Proceed to Checkout button, and empty cart state',
      },

      'API': {
        files: [
          'src/services/api.js',
          'src/api/',
          'backend/',
          'server/',
          'src/services/',
        ],
        endpoints: ['/products', '/api/products'],
        description: 'REST API endpoints — GET /products returns product array with required fields (name, price, stock, description, image URL, category); Content-Type validation',
      },

      'Error Handling': {
        files: [
          'src/components/ErrorBoundary.jsx',
          'src/pages/NotFound.jsx',
          'src/pages/404.jsx',
          'src/components/ErrorState.jsx',
        ],
        description: '404 page for non-existent routes; error state when backend is unavailable; loading indicator while products are being fetched',
      },
    },
  },

  output: {
    formats: ['json', 'html'],
    reportsDir: './tiis/reports',
  },
};
