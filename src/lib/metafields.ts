// Customer Metafield operations for wishlist sync

const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const getCustomerApiEndpoint = () => {
    const domain = shopDomain.replace('.myshopify.com', '');
    return `https://shopify.com/${domain}/account/customer/api/2024-01/graphql`;
};

export interface WishlistItem {
    productId: string;
    handle: string;
    title: string;
    image: string;
    price: string;
    variantId: string | null;
}

// Get wishlist from customer metafield
export async function getWishlistFromMetafield(
    accessToken: string
): Promise<WishlistItem[]> {
    const query = `
    query {
      customer {
        metafield(namespace: "custom", key: "wishlist") {
          value
        }
      }
    }
  `;

    try {
        const response = await fetch(getCustomerApiEndpoint(), {
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
        const value = data.data?.customer?.metafield?.value;

        if (!value) {
            return [];
        }

        return JSON.parse(value) as WishlistItem[];
    } catch (error) {
        console.error('Error fetching wishlist metafield:', error);
        return [];
    }
}

// Save wishlist to customer metafield
export async function saveWishlistToMetafield(
    accessToken: string,
    wishlist: WishlistItem[]
): Promise<boolean> {
    const mutation = `
    mutation customerMetafieldsSet($metafields: [CustomerMetafieldsSetInput!]!) {
      customerMetafieldsSet(metafields: $metafields) {
        metafields {
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    try {
        const response = await fetch(getCustomerApiEndpoint(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                query: mutation,
                variables: {
                    metafields: [
                        {
                            namespace: 'custom',
                            key: 'wishlist',
                            type: 'json',
                            value: JSON.stringify(wishlist),
                        },
                    ],
                },
            }),
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();

        if (data.data?.customerMetafieldsSet?.userErrors?.length > 0) {
            console.error('Metafield save errors:', data.data.customerMetafieldsSet.userErrors);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error saving wishlist metafield:', error);
        return false;
    }
}

// Merge local wishlist with remote wishlist
export function mergeWishlists(
    localWishlist: WishlistItem[],
    remoteWishlist: WishlistItem[]
): WishlistItem[] {
    const merged = [...remoteWishlist];
    const productIds = new Set(remoteWishlist.map((item) => item.productId));

    for (const item of localWishlist) {
        if (!productIds.has(item.productId)) {
            merged.push(item);
            productIds.add(item.productId);
        }
    }

    return merged;
}
