'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
    product: {
        id: string;
        handle: string;
        title: string;
        featuredImage: { url: string } | null;
        priceRange: {
            minVariantPrice: { amount: string };
        };
        variants: {
            edges: { node: { id: string } }[];
        };
    };
    variant?: 'icon' | 'full';
    className?: string;
}

export function WishlistButton({
    product,
    variant = 'icon',
    className,
}: WishlistButtonProps) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);

    const handleClick = () => {
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({
                productId: product.id,
                handle: product.handle,
                title: product.title,
                image: product.featuredImage?.url || '',
                price: product.priceRange.minVariantPrice.amount,
                variantId: product.variants.edges[0]?.node.id || null,
            });
        }
    };

    if (variant === 'full') {
        return (
            <Button
                variant={inWishlist ? 'secondary' : 'outline'}
                onClick={handleClick}
                className={cn(
                    inWishlist && 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100',
                    className
                )}
            >
                <Heart className={cn('h-4 w-4 mr-2', inWishlist && 'fill-current')} />
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            className={cn(
                inWishlist && 'text-red-500 border-red-200 bg-red-50 hover:bg-red-100',
                className
            )}
        >
            <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
            <span className="sr-only">
                {inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            </span>
        </Button>
    );
}
