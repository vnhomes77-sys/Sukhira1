import { Metadata } from 'next';
import { Search as SearchIcon } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid';
import { SearchForm } from './SearchForm';
import { shopifyFetch, extractNodes, ShopifyProduct } from '@/lib/shopify';
import { SEARCH_PRODUCTS } from '@/lib/queries';

export const metadata: Metadata = {
    title: 'Search',
    description: 'Search our collection of premium products',
};

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

async function searchProducts(query: string) {
    if (!query) return [];

    try {
        const data = await shopifyFetch<{
            search: { edges: { node: ShopifyProduct }[] };
        }>({
            query: SEARCH_PRODUCTS,
            variables: { query, first: 50 },
            cache: 'no-store',
        });
        return extractNodes(data.search.edges);
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q: query = '' } = await searchParams;
    const products = await searchProducts(query);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-center mb-6">Search Products</h1>
                <SearchForm initialQuery={query} />
            </div>

            {query ? (
                <>
                    <p className="text-sm text-muted-foreground mb-6">
                        {products.length} {products.length === 1 ? 'result' : 'results'} for &quot;{query}&quot;
                    </p>

                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <div className="text-center py-16">
                            <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-medium mb-2">No products found</p>
                            <p className="text-muted-foreground">
                                Try adjusting your search or browse our collections.
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16">
                    <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                        Enter a search term to find products.
                    </p>
                </div>
            )}
        </div>
    );
}
