'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/ProductCard';
import { formatPrice } from '@/lib/money';

export function WishlistGrid() {
    const { items, isLoading } = useWishlist();

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-[#111111]/5 p-6 rounded-full mb-6">
                    <ShoppingCart className="h-12 w-12 text-[#111111]/20" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-[#111111]">Your wishlist is empty</h2>
                <p className="text-[#111111]/70 mb-8 max-w-md">
                    Save your favorite products here and shop anytime.
                </p>
                <Button
                    asChild
                    className="bg-[#56AF31] hover:bg-[#4a962a] text-white rounded-full px-8 py-6 text-lg"
                >
                    <Link href="/collections/all">Continue Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {items.map((item) => {
                // Map WishlistItem to ProductCard structure
                const mappedProduct = {
                    id: item.productId,
                    handle: item.handle,
                    title: item.title,
                    vendor: 'Sukhira', // Default or unknown
                    productType: 'Product',
                    tags: [],
                    availableForSale: true,
                    priceRange: {
                        minVariantPrice: {
                            amount: item.price,
                            currencyCode: 'INR'
                        }
                    },
                    compareAtPriceRange: undefined,
                    featuredImage: {
                        url: item.image,
                        altText: item.title
                    },
                    variants: {
                        edges: [{
                            node: {
                                id: item.variantId || `${item.productId}-variant`
                            }
                        }]
                    }
                };

                return (
                    // We don't need explicit 'addToCart' or 'remove' buttons here 
                    // because ProductCard handles both (Heart toggles wishlist, Add button adds to cart)
                    <div key={item.productId} className="relative">
                        <ProductCard product={mappedProduct} />
                    </div>
                );
            })}
        </div>
    );
}
