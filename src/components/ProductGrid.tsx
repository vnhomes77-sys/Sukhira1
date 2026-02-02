import { ProductCard, ProductCardProps } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
    products: ProductCardProps['product'][];
    columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    };

    return (
        <div className={`grid ${gridCols[columns]} gap-6 md:gap-8`}>
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 4} index={index} />
            ))}
        </div>
    );
}

export function ProductGridSkeleton({ count = 8, columns = 4 }: { count?: number; columns?: 2 | 3 | 4 }) {
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    };

    return (
        <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square rounded-lg" />
                    <div className="space-y-2 p-2">
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-5 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}
