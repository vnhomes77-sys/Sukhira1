'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Check, Minus, ShoppingCart } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCompare } from '@/context/CompareContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/money';

export function CompareTable() {
    const { items, removeFromCompare, clearCompare, isLoading } = useCompare();
    const { addToCart } = useCart();

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/4" />
                <div className="h-64 bg-muted rounded" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-lg font-medium mb-2">No products to compare</p>
                <p className="text-muted-foreground mb-6">
                    Add up to 4 products to compare their features.
                </p>
                <Button asChild>
                    <Link href="/collections/all">Browse Products</Link>
                </Button>
            </div>
        );
    }

    const features = [
        { key: 'price', label: 'Price' },
        { key: 'vendor', label: 'Brand' },
        { key: 'productType', label: 'Category' },
        { key: 'availability', label: 'Availability' },
        { key: 'variants', label: 'Variants' },
        { key: 'tags', label: 'Features' },
    ];

    const renderFeatureValue = (item: typeof items[0], key: string) => {
        switch (key) {
            case 'price':
                return (
                    <div className="space-y-1">
                        <span className="font-bold text-lg">{formatPrice(item.price)}</span>
                        {item.compareAtPrice && parseFloat(item.compareAtPrice) > parseFloat(item.price) && (
                            <span className="text-sm text-muted-foreground line-through block">
                                {formatPrice(item.compareAtPrice)}
                            </span>
                        )}
                    </div>
                );
            case 'vendor':
                return item.vendor || <Minus className="h-4 w-4 text-muted-foreground" />;
            case 'productType':
                return item.productType || <Minus className="h-4 w-4 text-muted-foreground" />;
            case 'availability':
                return item.availableForSale ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        In Stock
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <X className="h-3 w-3 mr-1" />
                        Out of Stock
                    </Badge>
                );
            case 'variants':
                return (
                    <span className="text-sm">
                        {item.variants.length} {item.variants.length === 1 ? 'option' : 'options'}
                    </span>
                );
            case 'tags':
                return item.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {item.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{item.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                );
            default:
                return <Minus className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button variant="outline" onClick={clearCompare}>
                    Clear All
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-40 sticky left-0 bg-background z-10">
                                Feature
                            </TableHead>
                            {items.map((item) => (
                                <TableHead key={item.productId} className="min-w-[200px] text-center">
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                onClick={() => removeFromCompare(item.productId)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                            <Link href={`/products/${item.handle}`}>
                                                <div className="relative w-32 h-32 mx-auto bg-muted rounded-lg overflow-hidden">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover"
                                                            sizes="128px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                        <Link
                                            href={`/products/${item.handle}`}
                                            className="font-medium text-sm hover:text-primary transition-colors line-clamp-2"
                                        >
                                            {item.title}
                                        </Link>
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {features.map((feature) => (
                            <TableRow key={feature.key}>
                                <TableCell className="font-medium sticky left-0 bg-background z-10">
                                    {feature.label}
                                </TableCell>
                                {items.map((item) => (
                                    <TableCell key={item.productId} className="text-center">
                                        {renderFeatureValue(item, feature.key)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell className="font-medium sticky left-0 bg-background z-10">
                                Actions
                            </TableCell>
                            {items.map((item) => (
                                <TableCell key={item.productId} className="text-center">
                                    <div className="flex flex-col gap-2">
                                        <Button asChild size="sm">
                                            <Link href={`/products/${item.handle}`}>View Details</Link>
                                        </Button>
                                        {item.availableForSale && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    // Need variant ID - link to product page for now
                                                    window.location.href = `/products/${item.handle}`;
                                                }}
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Add to Cart
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
