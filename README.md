# Qadriya Traders

A complete responsive bookstore and stationery storefront built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, PostgreSQL, and Drizzle ORM.

## Editable business information

Update `src/lib/business.ts` with verified phone, email, address, and opening hours. The WhatsApp phone should include the country code. When a number is not configured, WhatsApp links open a prefilled message in the contact chooser instead of inventing a phone number.

## Catalog

`src/lib/catalog.ts` contains 24 sample products, all 12 categories, prices in INR, stock quantities, descriptions, and photography URLs. Replace these entries with your real inventory. Product and category IDs are used in URLs, so keep them stable once published. Images are representative; replace them with your actual product photography when available.

## Shopping experience

- Persistent cart and wishlist in browser localStorage
- Live product search, category filters, price filtering, sorting, and saved favourites
- Quick-view dialogs and product detail galleries
- Quantity controls and delivery calculations
- Cash-on-delivery checkout with server-side validation and order references
- WhatsApp order sharing
- Contact form and newsletter subscriptions persisted in PostgreSQL

## Database

The database connection is configured in `src/db/index.ts` using `DATABASE_URL`. The tables are defined in `src/db/schema.ts`:

- `orders`: customer details, line items, totals, status, and order reference
- `inquiries`: contact form submissions
- `subscribers`: unique newsletter email addresses

After the environment is bootstrapped, apply tables with `npx drizzle-kit push`.

## Validation

Run `npx next typegen`, `npm exec tsc -- --noEmit --pretty false`, and `npm run build`. The `/api/health` endpoint verifies database connectivity.

## Content notes

No customer testimonials or unverified business contact details have been invented. The community section invites genuine customer stories. Opening hours are explicitly marked as sample hours. Product prices and inventory are illustrative and can be replaced in the catalog file.
