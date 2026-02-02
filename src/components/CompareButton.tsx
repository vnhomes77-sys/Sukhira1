'use client';

import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare, CompareItem } from '@/context/CompareContext';
import { cn } from '@/lib/utils';

interface CompareButtonProps {
    product: {
        id: string;
        handle: string;
        title: string;
        vendor: string;
        productType: string;
        tags: string[];
        availableForSale: boolean;
        featuredImage: { url: string } | null;
        priceRange: {
            minVariantPrice: { amount: string };
        };
        compareAtPriceRange?: {
            minVariantPrice: { amount: string };
        };
        variants: {
            edges: { node: { id: string; title: string } }[];
        };
    };
    variant?: 'icon' | 'full';
    className?: string;
}

export function CompareButton({
    product,
    variant = 'icon',
    className,
}: CompareButtonProps) {
    const { addToCompare, removeFromCompare, isInCompare, canAdd } = useCompare();
    const inCompare = isInCompare(product.id);

    const handleClick = () => {
        if (inCompare) {
            removeFromCompare(product.id);
        } else {
            const compareItem: CompareItem = {
                productId: product.id,
                handle: product.handle,
                title: product.title,
                image: product.featuredImage?.url || '',
                price: product.priceRange.minVariantPrice.amount,
                compareAtPrice: product.compareAtPriceRange?.minVariantPrice.amount,
                vendor: product.vendor,
                productType: product.productType,
                tags: product.tags,
                availableForSale: product.availableForSale,
                variants: product.variants.edges.map((e) => ({
                    title: e.node.title,
                    price: product.priceRange.minVariantPrice.amount,
                })),
            };
            addToCompare(compareItem);
        }
    };

    if (variant === 'full') {
        return (
            <Button
                variant={inCompare ? 'secondary' : 'outline'}
                onClick={handleClick}
                disabled={!canAdd && !inCompare}
                className={cn(
                    inCompare && 'text-primary border-primary/20 bg-primary/10 hover:bg-primary/20',
                    className
                )}
            >
                <GitCompare className="h-4 w-4 mr-2" />
                {inCompare ? 'In Compare' : 'Add to Compare'}
            </Button>
        );
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            disabled={!canAdd && !inCompare}
            className={cn(
                inCompare && 'text-primary border-primary/20 bg-primary/10 hover:bg-primary/20',
                className
            )}
        >
            <GitCompare className="h-4 w-4" />
            <span className="sr-only">
                {inCompare ? 'Remove from compare' : 'Add to compare'}
            </span>
        </Button>
    );
}
