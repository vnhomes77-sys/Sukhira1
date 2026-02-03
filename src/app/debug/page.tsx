
import { shopifyFetch } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

interface ShopifyProductEdge {
    node: {
        title: string;
        handle: string;
    };
}

interface DebugProductsResponse {
    products: {
        edges: ShopifyProductEdge[];
    };
}

export default async function DebugPage() {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const redirectUri = process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    let products: ShopifyProductEdge[] = [];
    let error: string | null = null;

    try {
        const data = await shopifyFetch<DebugProductsResponse>({
            query: `
        query {
          products(first: 5) {
            edges {
              node {
                title
                handle
              }
            }
          }
        }
      `
        });
        products = data.products.edges;
    } catch (e: unknown) {
        if (e instanceof Error) {
            error = e.message;
        } else {
            error = String(e);
        }
    }

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-xl font-bold mb-4">Debug Info</h1>

            <div className="space-y-2 mb-8">
                <div><strong>Domain Configured:</strong> {domain ? 'YES' : 'NO'} ({domain})</div>
                <div><strong>Token Configured:</strong> {token ? 'YES' : 'NO'}</div>
                <div className="pt-4 border-t border-gray-200 mt-4">
                    <strong>Environment Check:</strong>
                    <div className="text-xs break-all mt-1">
                        <span className="text-gray-500">Redirect URI:</span> {redirectUri || 'UNDEFINED'}
                    </div>
                    <div className="text-xs break-all">
                        <span className="text-gray-500">App URL:</span> {appUrl || 'UNDEFINED'}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <strong>API Connection Test:</strong>
                {error ? (
                    <div className="text-red-500 mt-2">
                        Error: {error}
                    </div>
                ) : (
                    <div className="text-green-500 mt-2">
                        Success! Found {products.length} products.
                    </div>
                )}
            </div>

            {products.length > 0 && (
                <ul className="list-disc pl-5">
                    {products.map(({ node }) => (
                        <li key={node.handle}>
                            {node.title} (<a href={`/products/${node.handle}`} className="underline text-blue-500">{node.handle}</a>)
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
