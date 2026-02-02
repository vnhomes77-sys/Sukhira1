'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';

interface TrackRecentlyViewedProps {
    product: {
        id: string;
        handle: string;
        title: string;
        featuredImage: {
            url: string;
        } | null;
        priceRange: {
            minVariantPrice: {
                amount: string;
            };
        };
    };
}

export function TrackRecentlyViewed({ product }: TrackRecentlyViewedProps) {
    const { addRecentlyViewed } = useRecentlyViewed();

    useEffect(() => {
        addRecentlyViewed({
            productId: product.id,
            handle: product.handle,
            title: product.title,
            image: product.featuredImage?.url || '',
            price: product.priceRange.minVariantPrice.amount,
        });
    }, [product, addRecentlyViewed]);

    return null;
}
