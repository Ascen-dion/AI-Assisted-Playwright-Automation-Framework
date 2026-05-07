/**
 * TIIS — Test Impact Intelligence System
 * Configuration for: aava-ecom-demo
 *
 * App:    https://github.com/Ascen-dion/aava-ecom-demo
 * Live:   https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net
 * Stack:  React 18 (frontend) + Spring Boot 3 (backend) + H2 DB
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
    owner: 'Ascen-dion',
    repo: 'aava-ecom-demo',
    defaultBranch: 'main',
  },

  testInventory: {
    provider: 'filesystem',
    rootPaths: ['./src/web/tests', './src/mobile/tests'],
    filePattern: '**/*.spec.*',
  },

  /**
   * Feature Map — maps application features to their source files.
   * Agent 2 uses this to determine what feature a changed file belongs to.
   * Agent 3 uses feature names as keywords to match against test file names.
   *
   * HOW TO UPDATE: Add/edit entries as the app grows.
   * Keys = feature names (used in the impact report labels).
   */
  appKnowledge: {
    featureMap: {
      'Home Page': {
        files: [
          'frontend/src/components/Home.js',
          'frontend/src/components/Home.css',
        ],
        description: 'Landing page with hero section and featured products',
      },

      'Products Catalog': {
        files: [
          'frontend/src/components/Products.js',
          'frontend/src/components/Products.css',
          'frontend/src/components/ProductCard.js',
          'frontend/src/components/ProductCard.css',
        ],
        description: 'Product listing page showing all products as cards',
      },

      'Shopping Cart': {
        files: [
          'frontend/src/components/Cart.js',
          'frontend/src/components/Cart.css',
        ],
        description: 'Shopping cart — add items, remove items, view total, checkout',
      },

      'Navigation': {
        files: [
          'frontend/src/components/Navbar.js',
          'frontend/src/components/Navbar.css',
          'frontend/src/App.js',
          'frontend/src/App.css',
        ],
        description: 'Top navigation bar and app-level routing — present on all pages',
      },

      'Product Search': {
        files: [
          'frontend/src/services/api.js',
          'backend/src/main/java/com/ecommerce/app/controller/ProductController.java',
        ],
        endpoints: ['GET /api/products/search?name=X'],
        description: 'Search products by name via the search bar',
      },

      'Category Filter': {
        files: [
          'frontend/src/components/Products.js',
          'backend/src/main/java/com/ecommerce/app/controller/ProductController.java',
        ],
        endpoints: ['GET /api/products/category/{cat}'],
        description: 'Filter the product catalog by category',
      },

      'Product API - Read': {
        files: [
          'backend/src/main/java/com/ecommerce/app/controller/ProductController.java',
          'backend/src/main/java/com/ecommerce/app/service/ProductService.java',
        ],
        endpoints: [
          'GET /api/products',
          'GET /api/products/{id}',
        ],
        description: 'Fetch all products or a single product from the backend',
      },

      'Product API - Write': {
        files: [
          'backend/src/main/java/com/ecommerce/app/controller/ProductController.java',
          'backend/src/main/java/com/ecommerce/app/service/ProductService.java',
          'backend/src/main/java/com/ecommerce/app/repository/ProductRepository.java',
        ],
        endpoints: [
          'POST /api/products',
          'PUT /api/products/{id}',
          'DELETE /api/products/{id}',
        ],
        description: 'Create, update, and delete products via REST API',
      },

      'Data Layer': {
        files: [
          'backend/src/main/java/com/ecommerce/app/model/Product.java',
          'backend/src/main/java/com/ecommerce/app/repository/ProductRepository.java',
          'backend/src/main/java/com/ecommerce/app/config/DataLoader.java',
        ],
        description: 'Product data model, JPA repository, and seed data loader',
      },

      'App Configuration': {
        files: [
          'backend/src/main/resources/application.properties',
          'backend/src/main/java/com/ecommerce/app/config/CorsConfig.java',
          'frontend/src/services/api.js',
          'backend/pom.xml',
          'frontend/package.json',
        ],
        description: 'Backend config, CORS settings, frontend API base URL, and dependencies',
      },
    },
  },

  output: {
    formats: ['json', 'html'],
    reportsDir: './tiis/reports',
  },
};
