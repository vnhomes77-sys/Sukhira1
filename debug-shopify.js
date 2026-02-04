
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) {
        envVars[key.trim()] = val.trim();
    }
});

const SHOPIFY_STORE_DOMAIN = envVars.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = envVars.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Full Query from queries.ts
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    media(first: 10) {
      edges {
        node {
          mediaContentType
          ... on ExternalVideo {
            id
            embedUrl
            host
          }
          ... on Video {
            id
            sources {
              url
              mimeType
              format
              height
              width
            }
            previewImage {
              url
            }
          }
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    options {
      id
      name
      values
    }
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

async function debugShopify() {
    console.log('Domain:', SHOPIFY_STORE_DOMAIN);

    const query = GET_PRODUCT_BY_HANDLE;
    const variables = { handle: 'face-mask' }; // Try the reported handle

    try {
        const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query, variables }),
        });

        const json = await response.json();
        console.log('Full Query Response:', JSON.stringify(json, null, 2));

    } catch (err) {
        console.error('Network Error:', err);
    }
}

debugShopify();
