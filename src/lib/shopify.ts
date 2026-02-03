// Shopify Types
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  featuredImage: ShopifyImage | null;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  metafields: {
    key: string;
    namespace: string;
    value: string;
    type: string;
  }[];
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
    price: ShopifyMoney;
    image: ShopifyImage | null;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney | null;
  };
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
}

export interface ShopifyCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  defaultAddress: {
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
  } | null;
}

export interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: ShopifyMoney;
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        variant: {
          image: ShopifyImage | null;
          price: ShopifyMoney;
        } | null;
      };
    }[];
  };
}

// Shopify API Configuration
// Shopify API Configuration
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const getEndpoint = () => {
  if (!domain) {
    throw new Error('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined');
  }
  return `https://${domain}/api/2024-01/graphql.json`;
};

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}

interface ShopifyResponse<T> {
  data: T;
  errors?: {
    message: string;
    locations?: { line: number; column: number }[];
    path?: string[];
  }[];
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
  tags = [],
}: ShopifyFetchOptions): Promise<T> {
  const result = await fetch(getEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken || '',
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next: { tags },
  });

  const isJson = result.headers.get('content-type')?.includes('application/json');

  if (!result.ok || !isJson) {
    const text = await result.text();
    console.error(`Shopify API Fetch Error: [${result.status}] ${result.statusText}`);
    console.error('Response Body:', text);
    throw new Error(`Shopify API Error (${result.status}): ${text.substring(0, 200)}...`);
  }

  const json: ShopifyResponse<T> = await result.json();

  if (json.errors) {
    console.error('Shopify API Error:', json.errors);
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }

  return json.data;
}

// Helper to extract nodes from edges
export function extractNodes<T>(edges: { node: T }[]): T[] {
  return edges.map((edge) => edge.node);
}
