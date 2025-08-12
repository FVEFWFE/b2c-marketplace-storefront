## ArbVault Price Tracker - Testing Guide

Prereqs:
- Node 18+
- Postgres DATABASE_URL set in environment (same as your Medusa backend)
- Fresh Medusa 2.0 backend at `arbvault-backend-mercur/apps/backend`
- Next.js frontend at `arbvault-frontend-main`

Install:

```bash
node install-price-tracker.js
```

What it does:
- Patches `arbvault-backend-mercur/apps/backend/medusa-config.ts` to register `src/modules/price-tracker`
- Installs backend deps (puppeteer, scraping libs)
- Applies SQL migrations to create `competitor_match` and `price_history`
- Seeds 5 sample products if your `product` table is empty
- Runs an initial research pass and prints a summary

Verify:
- Run backend, open a seeded product page and render `PriceTracker` component
- Call Store API:
  - GET `/store/price-tracker/:product_id`
- Call Admin APIs:
  - POST `/admin/price-tracker/research` with `{ product_id, product_title }`
  - POST `/admin/price-tracker/manual-override` with `{ product_id, product_title, competitor_name, competitor_url }`
  - GET `/admin/price-tracker/status`
  - POST `/admin/price-tracker/queue/retry-failed`

Expected:
- For seeded products, at least 4/5 reach confidence ≥ 70
- Console shows lines like:
  - `✅ "Apple AirPods Pro 2nd Generation" -> Amazon (95%), eBay (88%), Walmart (77%)`

Test script:

```bash
node test-price-tracker.js
```

Frontend usage:

```tsx
// app/products/[handle]/page.tsx
import dynamic from 'next/dynamic'
const PriceTracker = dynamic(() => import('@/components/product/PriceTracker'), { ssr: false })

export default function ProductPage({ params }) {
  const productId = '... // fetch product id'
  const ourPriceCents = 19900 // your product price
  return <PriceTracker productId={productId} ourPriceCents={ourPriceCents} />
}
```

Env and compliance:
- `COMPLIANT_MODE=1` disables scraping and uses only APIs (eBay) and search URLs
- `PRICE_TRACKER_RATE_LIMIT=1/s`
- `EBAY_APP_ID=...`
- `PRICE_TRACKER_SCRAPE_INTERVAL_HOURS=24`
- `PRICE_TRACKER_RESEARCH_INTERVAL_DAYS=7`

SQL check:

```sql
SELECT * FROM price_history WHERE competitor_price IS NOT NULL;
```