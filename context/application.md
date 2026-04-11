# Application Context - StarHub E-commerce

## Base Configuration

**Target URL**: https://www.starhub.com
**Application Type**: E-commerce telecommunications website
**Environment**: Production
**Domain**: StarHub Singapore telecommunications

## Application Routes & Navigation

### Primary Routes
- `/personal.html` - Main personal plans page (landing page)
- `/personal/store/mobile/devices` - All phones listing page
- `/personal/store/mobile/devices/samsung/galaxy-a57-5g` - Product detail page

### Key Navigation Paths
1. **Mobile Phones Flow**:
   - Home → Mobile (dropdown) → All Phones → Device Selection → Product Details → Purchase Flow

### Page Loading Characteristics
- **Initial load time**: 3-5 seconds for product pages
- **JavaScript heavy**: SPA-style navigation with dynamic content loading
- **Cookie consent**: Required dismissal on first visit
- **Network requests**: Heavy API usage for product data

## Key UI Elements & Selectors

### Navigation
- **Mobile dropdown button**: `button[text="Mobile"]`
- **All Phones link**: `link[text="All Phones"]`
- **Breadcrumb navigation**: Present on all product pages
- **Cookie consent button**: `button[text="Got it"]`

### Product Listing Page
- **Device cards**: Grid layout with product images, names, pricing
- **Filters sidebar**: Brand, features, price range controls
- **Sort dropdown**: Various sorting options (newest, price, popularity)
- **Total items display**: Shows count of available devices
- **Samsung Galaxy A57 5G**: First product in "New" section

### Product Detail Page
- **Color selector**: Defaults to "Awesome Navy"
- **Storage selector**: Multiple options with 256GB default
- **Payment options**: 24-month (default), 12-month, Pay today
- **Next button**: Primary CTA for purchase flow
- **Add-ons**: SmartSupport optional service
- **Price display**: Format `$XX.XX/mthx24 mths`

### Authentication Elements (Expected)
- **Login popup/modal**: Triggered after "Next" button click
- **Hub ID login button**: Primary authentication method
- **Sign up link**: Account creation option
- **Login message**: "Please log in or create an account to continue with your purchase"

## Application-Specific Rules

### Element Stability
- Product cards use dynamic ref IDs but stable text selectors
- Navigation uses consistent button/link text
- Price formatting: `from $XX.XX/mth or $XXX.XX` pattern
- Color/storage options use clickable text selectors

### Data Validation Points
- **Product pricing**: Format `from $29.08/mth or $698.00`
- **Color options**: Text-based selection (e.g., "Awesome Navy")
- **Storage options**: GB-based values (256GB default)
- **Payment terms**: Monthly installment calculations

### Error Handling
- **Slow loading**: Pages may take 3-5 seconds to fully render
- **Cookie consent**: Must be dismissed before interaction
- **Dynamic content**: Wait for product data to load before assertions

## Environment Configuration

### Timeouts
- **Page load**: 60 seconds (heavy JS/API loading)
- **Element wait**: 15 seconds (dynamic content)
- **Network wait**: 30 seconds (API-heavy application)

### Browser Configuration
- **Viewport**: 1920x1080 (desktop-optimized)
- **User agent**: Default Chromium
- **JavaScript**: Required (SPA application)
- **Cookies**: Required for session management

## Selector Priority Strategy
1. **Text-based selectors**: `getByRole('button', { name: 'Mobile' })`
2. **Link selectors**: `getByRole('link', { name: 'All Phones' })`
3. **Exact text matching**: For device names and pricing
4. **Ref-based selectors**: As fallback for dynamic elements
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
