'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/money';

export function WishlistGrid() {
    const { items, removeFromWishlist, isLoading } = useWishlist();
    const { addToCart } = useCart();

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="aspect-square bg-muted rounded-lg mb-3" />
                        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
                <p className="text-muted-foreground mb-6">
                    Start adding products you love!
                </p>
                <Button asChild>
                    <Link href="/collections/all">Browse Products</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
                <Card key={item.productId} className="group overflow-hidden">
                    <Link href={`/products/${item.handle}`} className="block">
                        <div className="relative aspect-square overflow-hidden bg-muted">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                    </Link>
                    <CardContent className="p-4 space-y-3">
                        <Link
                            href={`/products/${item.handle}`}
                            className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors"
                        >
                            {item.title}
                        </Link>
                        <p className="font-semibold">{formatPrice(item.price)}</p>
                        <div className="flex gap-2">
                            {item.variantId && (
                                <Button
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => addToCart(item.variantId!)}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeFromWishlist(item.productId)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
