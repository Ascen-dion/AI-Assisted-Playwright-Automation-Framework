# Application Knowledge — E-Shop Brownfield

## Target URL
https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/

## Technology Stack
- Frontend: React SPA (Single Page Application)
- Routing: Client-side routing, no full page reloads between pages
- Root element: `#root`
- Hosted on: Azure App Service

## Pages and Routes

### Homepage — /
- Hero heading: `h1.hero-title` — text: "Welcome to E-Shop"
- Hero subtitle: `p.hero-subtitle` — text: "Discover amazing products at great prices"
- Primary CTA: `a[href="/products"]` — text: "Shop Now"
- Feature cards (all visible above fold):
  - "Free Shipping" — On orders over $50
  - "Secure Payment" — 100% secure transactions
  - "Easy Returns" — 30-day return policy
  - "Quality Products" — Carefully curated selection
- Feature headings rendered as `h3` elements in order (nth 0-3)

### Products Page — /products
- Route: `/products`
- Dynamic content: Products load asynchronously ("Loading products..." shown while fetching)
- Product cards: `[data-testid*="product"], .product, .product-card, article`
- Add to Cart buttons: `button:has-text("Add to Cart")` or `[data-testid*="add-to-cart"]`
- Search: `input[type="search"], input[placeholder*="search"]`
- Wait for products to load before asserting — avoid asserting on "Loading products..."

### Cart Page — /cart
- Route: `/cart`
- Empty state heading: "Your cart is empty"
- Empty state sub-text: "Add some products to get started!"
- Cart count shown in nav: `Cart (0)` when empty, `Cart (N)` when items present
- Cart link selector: `a[href*="cart"]` or `[data-testid*="cart"]`

## Navigation
- Logo: `a[href="/"]` with text "🛒 E-Shop"
- Nav items rendered as `li.nav-item`:
  - Home: `li.nav-item:has(a[href="/"])`
  - Products: `li.nav-item:has(a[href="/products"])`
  - Cart: `li.nav-item:has(a[href="/cart"])` — shows item count in brackets

## Selector Strategy (Priority Order)
1. `data-testid` attributes where present
2. ARIA roles: `getByRole('button', { name: ... })`, `getByRole('link', { name: ... })`
3. Semantic text: `getByText(...)`, `getByLabel(...)`
4. Stable CSS: class names like `.hero-title`, `.hero-subtitle`, `.product-card`
5. Avoid: XPath, index-based selectors, brittle positional selectors

## Environment Notes
- This is a lower/unstable Azure-hosted environment
- Cold start delays possible — always use `waitFor` with 15000ms timeout
- Use `waitUntil: 'domcontentloaded'` for navigation (not `load`)
- Products page uses async data fetch — wait for product cards to appear before asserting
- Run `goto()` with `timeout: 60000` to handle cold starts

## Known User Journeys
1. **Welcome / Homepage verification** — Load homepage, verify hero title, subtitle, feature cards visible above fold
2. **Product discovery** — Navigate to /products, wait for products to load, verify product cards appear
3. **Add to cart** — On products page, click "Add to Cart" on a product, verify cart count increments
4. **Cart review** — Navigate to /cart, verify cart contents or empty state
5. **Navigation smoke** — Verify all nav links (Home, Products, Cart) are visible and functional
