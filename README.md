# ShopStore - Headless Shopify Storefront

A production-grade headless Shopify storefront built with Next.js 14, Tailwind CSS, and shadcn/ui. Features include premium cart drawer, wishlist with customer sync, recently viewed products, and product comparison.

## Features

- 🛒 **Cart Drawer** - Slide-out cart with quantity controls, auto-open on add
- ❤️ **Wishlist** - Guest localStorage + Shopify metafield sync for logged-in users
- 👁️ **Recently Viewed** - Track last 12 products viewed
- ⚖️ **Compare Products** - Side-by-side comparison of up to 4 products
- 🔐 **Customer Authentication** - Shopify Customer Accounts OAuth with PKCE
- 🔍 **Search** - Debounced product search
- 📱 **Responsive** - Mobile-first design with mobile navigation
- 🎨 **Modern UI** - shadcn/ui components with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State**: React Context + useReducer
- **Backend**: Shopify Storefront API (GraphQL)
- **Authentication**: Shopify Customer Accounts API (OAuth 2.0)
- **Deployment**: Cloudflare Pages

## Prerequisites

1. **Shopify Store** with:
   - Storefront API access enabled
   - Customer Account API enabled
   - Storefront API access token generated

2. **Customer Metafield** (for wishlist sync):
   - Namespace: `custom`
   - Key: `wishlist`
   - Type: `json`

## Getting Started

### 1. Clone and Install

```bash
cd d:\shopify
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Shopify credentials:

```bash
cp .env.example .env.local
```

```env
# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token

# Shopify Customer Accounts OAuth
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=your-customer-account-client-id
SHOPIFY_CUSTOMER_ACCOUNT_AUTH_DOMAIN=https://shopify.com
SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI=http://localhost:3000/api/auth/callback

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Shopify Setup

#### Storefront API Token

1. Go to Shopify Admin → Settings → Apps and sales channels
2. Click "Develop apps"
3. Create a new app or select an existing one
4. Configure Storefront API scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_customers`
5. Install the app and copy the Storefront API access token

#### Customer Account API

1. Go to Shopify Admin → Settings → Customer accounts
2. Enable "New customer accounts"
3. Note your shop ID for the OAuth URL

#### Create Wishlist Metafield

1. Go to Shopify Admin → Settings → Custom data
2. Click "Customers" and add a metafield:
   - Namespace: `custom`
   - Key: `wishlist`
   - Content type: JSON

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Homepage
│   ├── providers.tsx           # Client-side context providers
│   ├── collections/[handle]/   # Collection pages
│   ├── products/[handle]/      # Product detail pages
│   ├── search/                 # Search page
│   ├── wishlist/               # Wishlist page
│   ├── compare/                # Compare products page
│   ├── account/                # Account pages (login, orders, etc.)
│   └── api/auth/               # Auth API routes
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── Navbar.tsx              # Site header with navigation
│   ├── Footer.tsx              # Site footer
│   ├── CartDrawer.tsx          # Slide-out cart
│   ├── ProductCard.tsx         # Product card with actions
│   ├── ProductGrid.tsx         # Product grid layout
│   ├── ProductGallery.tsx      # Product image gallery
│   ├── HeroBanner.tsx          # Homepage hero section
│   ├── CategoryCards.tsx       # Collection category cards
│   ├── TrustBadges.tsx         # Trust indicators
│   ├── ReviewsSection.tsx      # Customer reviews
│   ├── WishlistButton.tsx      # Wishlist toggle
│   ├── WishlistGrid.tsx        # Wishlist products grid
│   ├── CompareButton.tsx       # Compare toggle
│   ├── CompareTable.tsx        # Comparison table
│   ├── RecentlyViewedSection.tsx # Recently viewed carousel
│   └── AccountMenu.tsx         # Account dropdown
│
├── context/
│   ├── CartContext.tsx         # Cart state and Shopify integration
│   ├── WishlistContext.tsx     # Wishlist with sync
│   ├── CompareContext.tsx      # Compare products
│   ├── RecentlyViewedContext.tsx # Recently viewed tracking
│   └── AuthContext.tsx         # Customer authentication
│
└── lib/
    ├── shopify.ts              # Shopify API client
    ├── queries.ts              # GraphQL queries/mutations
    ├── customerAuth.ts         # OAuth implementation
    ├── metafields.ts           # Customer metafield operations
    ├── storage.ts              # localStorage utilities
    ├── money.ts                # Currency formatting
    ├── seo.ts                  # SEO utilities
    └── utils.ts                # shadcn/ui utilities
```

## Deployment
### Cloudflare Pages
1. Push to your repository
2. Connect to Cloudflare Pages
3. Set the following Environment Variables in Cloudflare Pages settings:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`: `sukhira.myshopify.com` (Note: NO https://)
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Your access token
   - `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID`: Your client ID
   - `SHOPIFY_CUSTOMER_ACCOUNT_AUTH_DOMAIN`: `https://shopify.com/<shop-id>/account`
   - `SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI`: `https://<your-deployment>.pages.dev` or your custom domain
4. Deploy!

### 1. Install Cloudflare Adapter

```bash
npm install @cloudflare/next-on-pages
```

### 2. Update `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
};

export default nextConfig;
```

### 3. Deploy to Cloudflare

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your repository
4. Configure:
   - Build command: `npm run build`
   - Build output: `.next`
   - Node version: 20

5. Add environment variables in Cloudflare dashboard:
   - `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`
   - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`
   - `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID`
   - `SHOPIFY_CUSTOMER_ACCOUNT_AUTH_DOMAIN`
   - `SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI` (update to production URL)
   - `NEXT_PUBLIC_APP_URL` (your Cloudflare Pages URL)

### 4. Update OAuth Redirect URI

After deployment, update your Shopify Customer Account app's redirect URI to your production URL:

```
https://your-site.pages.dev/api/auth/callback
```

## Key Features Explained

### Cart System

The cart uses Shopify's Cart API and persists the cart ID in localStorage. Features:
- Auto-opens drawer when adding items
- Quantity controls
- Remove items
- Checkout redirects to Shopify's hosted checkout

### Wishlist Sync

- **Guest users**: Wishlist stored in localStorage
- **Logged-in users**: 
  - On login, local wishlist merges with Shopify customer metafield
  - Changes sync to Shopify in real-time
  - Local storage cleared after successful sync

### Compare Products

- Compare up to 4 products side-by-side
- Shows: price, brand, category, availability, variants, tags
- Stored in localStorage

### Recently Viewed

- Tracks last 12 unique products
- Shows on product pages and homepage
- Stored in localStorage

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## License

MIT
#   S u k h i r a 
 
 #   S u k h i r a 1 
 
 #   S u k h i r a  
 