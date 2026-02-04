
import { Metadata } from 'next';
import Link from 'next/link';
import { shopifyFetch, ShopifyCollection as ShopifyCollectionType } from '@/lib/shopify';
import { GET_COLLECTIONS } from '@/lib/queries';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Collections | Sukhira',
    description: 'Explore our wide range of collections including Home & Kitchen, Electronics, and more.',
};

// Types for our query response
interface CollectionEdge {
    node: ShopifyCollectionType & {
        image: {
            url: string;
            altText: string;
            width: number;
            height: number;
        } | null;
    };
}

// Manual collections to ensure they appear even if not in Shopify explicitly, 
// or to enforce order/images.
const FEATURED_COLLECTIONS = [
    {
        handle: 'home-kitchen',
        title: 'Home & Kitchen',
        color: 'from-[#2C3E50] to-[#4CA1AF]',
        description: 'Upgrade your living space with our premium selection.'
    },
    {
        handle: 'electronics',
        title: 'Electronics',
        color: 'from-[#0F2027] to-[#203A43]',
        description: 'Latest gadgets and smart devices for your home.'
    },
    {
        handle: 'new-arrivals',
        title: 'New Arrivals',
        color: 'from-[#141E30] to-[#243B55]',
        description: 'Check out the freshest additions to our store.'
    }
];

async function getCollections() {
    try {
        const data = await shopifyFetch<{
            collections: { edges: CollectionEdge[] };
        }>({
            query: GET_COLLECTIONS,
            variables: { first: 20 },
            tags: ['collections'],
        });
        return data.collections.edges.map(edge => edge.node);
    } catch (error) {
        console.error('Error fetching collections:', error);
        return [];
    }
}

export default async function CollectionsPage() {
    const collections = await getCollections();

    // Map fetched collections for easier access
    const collectionsMap = new Map(collections.map(c => [c.handle, c]));

    return (
        <div className="pt-32 pb-20 container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center tracking-tight">
                Our Collections
            </h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-lg">
                Discover our carefully curated categories designed to elevate your lifestyle.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURED_COLLECTIONS.map((featured) => {
                    const shopifyCollection = collectionsMap.get(featured.handle);
                    // Use image from Shopify if available, otherwise fall back to gradient card
                    const imageUrl = shopifyCollection?.image?.url;

                    return (
                        <Link
                            key={featured.handle}
                            href={`/collections/${featured.handle}`}
                            className="group relative h-[300px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            {imageUrl ? (
                                <div className="absolute inset-0">
                                    <img
                                        src={imageUrl}
                                        alt={featured.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                                </div>
                            ) : (
                                <div className={`absolute inset-0 bg-gradient-to-br ${featured.color}`} />
                            )}

                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{featured.title}</h2>
                                    <p className="text-white/80">{featured.description}</p>
                                </div>
                                <div className="flex items-center text-white font-medium group-hover:translate-x-2 transition-transform">
                                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {/* Link to All Products */}
                <Link
                    href="/collections/all"
                    className="group relative h-[300px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-black"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">All Products</h2>
                            <p className="text-white/80">Browse our complete catalog of products.</p>
                        </div>
                        <div className="flex items-center text-white font-medium group-hover:translate-x-2 transition-transform">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
