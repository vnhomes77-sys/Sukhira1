
// import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Load .env.local manually if dotenv doesn't pick it up automatically
// (dotenv usually loads .env, checking for .env.local support in scripts might be needed or just force load)
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

console.log('Testing Shopify Connection...');
console.log('Domain:', domain);
// specific masking for token
console.log('Token:', token ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}` : 'MISSING');

if (!domain || !token) {
    console.error('Missing environment variables!');
    process.exit(1);
}

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

const query = `
  query getCollections {
    collections(first: 50) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

async function testFetch() {
    try {
        console.log(`Fetching collections from ${endpoint}...`);
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (data.errors) {
            console.error('Shopify API Errors:', JSON.stringify(data.errors, null, 2));
        } else {
            console.log('Success! Collections found:');
            const collections = data.data?.collections?.edges || [];
            if (collections.length === 0) {
                console.log('No collections found. Please check if collections are Active and published to the Headless channel.');
            } else {
                collections.forEach(({ node }) => {
                    console.log(`- ${node.title} (handle: ${node.handle})`);
                });
            }
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testFetch();
