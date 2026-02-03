
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

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    availableForSale
  }
`;

const GET_PRODUCT_BY_HANDLE = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;

async function testProductHandle() {
    const handle = 'face-mask'; // using the handle found in previous step
    console.log(`Testing lookup for handle: "${handle}"...`);

    const result = await fetchShopify(GET_PRODUCT_BY_HANDLE, { handle });

    if (result.errors) {
        console.error('Shopify Errors:', result.errors);
    } else {
        const product = result.data?.product;
        if (product) {
            console.log('Success! Product found:', product.title);
        } else {
            console.log('Product NOT found (null returned).');
            console.log('Potential causes:');
            console.log('1. Product is Active but NOT available to the Headless Channel.');
            console.log('2. Handle mismatch.');
        }
    }
}

testProductHandle();
