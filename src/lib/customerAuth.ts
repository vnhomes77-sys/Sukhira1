// Shopify Customer Accounts OAuth Implementation
// Note: This uses the new Customer Account API (2024+)

const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID || '';
const authDomain = process.env.SHOPIFY_CUSTOMER_ACCOUNT_AUTH_DOMAIN || '';
const redirectUri = process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI || '';
const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';

// Generate a random state for OAuth
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Generate a code verifier for PKCE
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

// Generate code challenge from verifier
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(digest));
}

function base64URLEncode(buffer: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Build authorization URL for Customer Account OAuth
export async function getAuthorizationUrl(): Promise<{
  url: string;
  state: string;
  codeVerifier: string;
}> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email customer-account-api:full',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  // Customer Account API authorization endpoint
  const authUrl = `https://shopify.com/${shopDomain.replace('.myshopify.com', '')}/auth/oauth/authorize?${params.toString()}`;

  return {
    url: authUrl,
    state,
    codeVerifier,
  };
}

// Exchange authorization code for tokens
export async function exchangeToken(
  code: string,
  codeVerifier: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  idToken: string;
}> {
<<<<<<< HEAD
  const tokenEndpoint = `https://shopify.com/${shopDomain.replace('.myshopify.com', '')}/auth/oauth/token`;
=======
    const tokenEndpoint = `https://sukhira.myshopify.com`;
>>>>>>> 19f4fd3ee664475bcab668ee5851c6a2cc5dbd37

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code: code,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    idToken: data.id_token,
  };
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  const tokenEndpoint = `https://shopify.com/${shopDomain.replace('.myshopify.com', '')}/auth/oauth/token`;

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  };
}

// Customer Account API endpoint
const customerApiEndpoint = `https://shopify.com/${shopDomain.replace('.myshopify.com', '')}/account/customer/api/2024-01/graphql`;

// Fetch customer data using Customer Account API
export async function getCustomer(accessToken: string): Promise<{
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
} | null> {
  const query = `
    query {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
      }
    }
  `;

  const response = await fetch(customerApiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (data.errors) {
    console.error('Customer API Error:', data.errors);
    return null;
  }

  const customer = data.data?.customer;
  if (!customer) return null;

  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.emailAddress?.emailAddress ?? null,
    phone: customer.phoneNumber?.phoneNumber ?? null,
  };
}

// Get customer orders
export async function getCustomerOrders(accessToken: string) {
  const query = `
    query {
      customer {
        orders(first: 20) {
          edges {
            node {
              id
              number
              processedAt
              financialStatus
              fulfillments {
                status
              }
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 10) {
                edges {
                  node {
                    title
                    quantity
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(customerApiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data?.customer?.orders?.edges?.map((e: { node: unknown }) => e.node) || [];
}
