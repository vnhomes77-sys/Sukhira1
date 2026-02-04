import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGrid, ProductGridSkeleton } from '@/components/ProductGrid';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { shopifyFetch, extractNodes, ShopifyProduct, ShopifyCollection } from '@/lib/shopify';
import { GET_COLLECTION_PRODUCTS, GET_PRODUCTS } from '@/lib/queries';
import { generateCollectionMetadata } from '@/lib/seo';
import { Suspense } from 'react';
import { VideoSection } from '@/components/VideoSection';

interface CollectionPageProps {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{ sort?: string }>;
}

const KNOWN_COLLECTIONS: Record<string, string> = {
    'home-kitchen': 'Home & Kitchen',
    'electronics': 'Electronics',
    'packages': 'Packages',
    'services': 'Services',
    'cookware': 'Cookware',
    'appliances': 'Appliances',
    'decor': 'Home Decor',
    'sale': 'Sale',
    'lawn-care': 'Lawn Care',
    'pests': 'Pest Control',
    'seasonal': 'Seasonal Advice',
    'all': 'All Products',
    'new-arrivals': 'New Arrivals',
    'household-appliance-accessories': 'Household Appliance Accessories',
    'best-sellers': 'Best Sellers'
};

const VIDEO_MAP: Record<string, string> = {
    'home-kitchen': '/videos/home & kitchen.mp4',
    'electronics': '/videos/electronics.mp4',
    'cookware': '/videos/cookware.mp4',
    'appliances': '/videos/appliances.mp4',
    'decor': '/videos/home decor.mp4',
};

async function getCollectionProducts(
    handle: string,
    sortKey: string = 'COLLECTION_DEFAULT',
    reverse: boolean = false
) {
    try {
        const data = await shopifyFetch<{
            collection: ShopifyCollection & {
                products: { edges: { node: ShopifyProduct }[] };
            };
        }>({
            query: GET_COLLECTION_PRODUCTS,
            variables: { handle, first: 50, sortKey, reverse },
            tags: ['collection', handle],
            cache: 'no-store'
        });
        return data.collection;
    } catch (error) {
        console.error('Error fetching collection:', error);
        return null;
    }
}

async function getAllProductsFallback(
    sortKey: string = 'BEST_SELLING',
    reverse: boolean = false
) {
    try {
        // Map collection sort keys to product sort keys roughly
        const productSortKey = sortKey === 'COLLECTION_DEFAULT' ? 'BEST_SELLING' : sortKey;

        const data = await shopifyFetch<{
            products: { edges: { node: ShopifyProduct }[] };
        }>({
            query: GET_PRODUCTS,
            variables: { first: 50, sortKey: productSortKey, reverse },
            tags: ['products'],
        });
        return data.products;
    } catch (error) {
        console.error('Error fetching fallback products:', error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: CollectionPageProps): Promise<Metadata> {
    const { handle } = await params;
    const collection = await getCollectionProducts(handle);

    if (collection) {
        return generateCollectionMetadata(collection.title, collection.description);
    }

    // Fallback metadata
    if (KNOWN_COLLECTIONS[handle]) {
        return {
            title: `${KNOWN_COLLECTIONS[handle]} | Sukhira`,
            description: `Shop the best ${KNOWN_COLLECTIONS[handle]} at Sukhira.`,
        };
    }

    return {
        title: 'Collection Not Found',
    };
}

function getSortParams(sort: string): { sortKey: string; reverse: boolean } {
    switch (sort) {
        case 'price-asc':
            return { sortKey: 'PRICE', reverse: false };
        case 'price-desc':
            return { sortKey: 'PRICE', reverse: true };
        case 'newest':
            return { sortKey: 'CREATED', reverse: true };
        case 'best-selling':
            return { sortKey: 'BEST_SELLING', reverse: false };
        default:
            return { sortKey: 'COLLECTION_DEFAULT', reverse: false };
    }
}

export default async function CollectionPage({
    params,
    searchParams,
}: CollectionPageProps) {
    const { handle } = await params;
    const { sort = 'default' } = await searchParams;
    const { sortKey, reverse } = getSortParams(sort);

    const collection = await getCollectionProducts(handle, sortKey, reverse);
    let products: ShopifyProduct[] = [];
    let title = '';
    let description = '';

    if (collection) {
        products = extractNodes(collection.products.edges);
        title = collection.title;
        description = collection.description;
    } else {
        // Strict Mode: If collection doesn't exist in Shopify, show 404 or empty state.
        // Do NOT fallback to "All Products" to avoid cross-contamination.
        if (KNOWN_COLLECTIONS[handle]) {
            // Optional: You could show a "Coming Soon" state here instead of 404
            // but user requested strict filtering.
            title = KNOWN_COLLECTIONS[handle];
            description = `Explore our ${KNOWN_COLLECTIONS[handle]} collection.`;
            // Leave products empty
        } else {
            notFound();
        }
    } else {
        notFound();
    }

    const videoSrc = VIDEO_MAP[handle];

    return (
        <div className="pb-8">
            {/* Video Hero (Dynamic) - Rendered if a video exists for this collection */}
            {videoSrc && (
                <VideoSection
                    title={title}
                    subtitle={description || `Discover our premium ${title.toLowerCase()} collection.`}
                    videoType="self-hosted"
                    videoSrc={videoSrc}
                    layout="overlay"
                />
            )}

            <div className={`container mx-auto px-4 ${videoSrc ? 'mt-16' : 'mt-20 py-8'}`} id="products">
                {/* Header (Only show if no video, to avoid duplication) */}
                {!videoSrc && (
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h1>
                        <p className="text-muted-foreground max-w-2xl text-lg">{description}</p>
                    </div>
                )}

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <p className="text-sm text-muted-foreground font-medium">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                        <SortSelect currentSort={sort} handle={handle} />
                    </div>
                </div>

                {/* Products Grid */}
                <Suspense fallback={<ProductGridSkeleton />}>
                    {products.length > 0 ? (
                        <ProductGrid products={products} columns={4} />
                    ) : (
                        <div className="text-center py-24 bg-muted/30 rounded-3xl">
                            <p className="text-xl text-muted-foreground">
                                No products found in this collection.
                            </p>
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    );
}

function SortSelect({ currentSort, handle }: { currentSort: string; handle: string }) {
    return (
        <form>
            <Select defaultValue={currentSort} name="sort">
                <SelectTrigger className="w-[180px] bg-white border-border/50 shadow-sm">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Featured</SelectItem>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </form>
    );
}
