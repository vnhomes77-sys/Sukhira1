
import fs from 'fs';
import path from 'path';

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
    const envConfig = fs.readFileSync(envLocalPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0 && !process.env[key.trim()]) {
            const value = valueParts.join('=').trim();
            process.env[key.trim()] = value;
        }
    });
}

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

async function fetchShopify(query, variables = {}) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({ query, variables }),
    });
    return response.json();
}

const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFragment on Product {
    id
    title
    handle
    availableForSale
  }
`;

const GET_PRODUCTS = `
  query getProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...ProductCardFragment
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

async function testHomepageQueries() {
    console.log('Testing "Best Sellers" Query...');
    const bestSellersInfo = await fetchShopify(GET_PRODUCTS, { first: 8, sortKey: 'BEST_SELLING' });
    if (bestSellersInfo.errors) console.error(bestSellersInfo.errors);
    const bestSellers = bestSellersInfo.data?.products?.edges || [];
    console.log(`Found ${bestSellers.length} Best Sellers.`);
    bestSellers.forEach(e => console.log(` - ${e.node.title} (${e.node.availableForSale ? 'Available' : 'Unavailable'})`));

    console.log('\nTesting "New Arrivals" Query...');
    const newArrivalsInfo = await fetchShopify(GET_PRODUCTS, { first: 4, sortKey: 'CREATED_AT', reverse: true });
    if (newArrivalsInfo.errors) console.error(newArrivalsInfo.errors);
    const newArrivals = newArrivalsInfo.data?.products?.edges || [];
    console.log(`Found ${newArrivals.length} New Arrivals.`);
    newArrivals.forEach(e => console.log(` - ${e.node.title} (${e.node.availableForSale ? 'Available' : 'Unavailable'})`));
}

testHomepageQueries();
