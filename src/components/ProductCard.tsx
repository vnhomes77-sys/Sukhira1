'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, GitCompare, ShoppingCart, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare, CompareItem } from '@/context/CompareContext';
import { formatPrice } from '@/lib/money';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
    product: {
        id: string;
        handle: string;
        title: string;
        vendor: string;
        productType: string;
        tags: string[];
        availableForSale: boolean;
        priceRange: {
            minVariantPrice: {
                amount: string;
                currencyCode: string;
            };
        };
        compareAtPriceRange?: {
            minVariantPrice: {
                amount: string;
                currencyCode: string;
            };
        };
        featuredImage: {
            url: string;
            altText: string | null;
        } | null;
        variants: {
            edges: {
                node: {
                    id: string;
                };
            }[];
        };
    };
    priority?: boolean;
    index?: number;
}

export function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
    const { addToCart, isLoading: isCartLoading } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addToCompare, removeFromCompare, isInCompare, canAdd } = useCompare();

    const inWishlist = isInWishlist(product.id);
    const inCompare = isInCompare(product.id);
    const firstVariantId = product.variants.edges[0]?.node.id;

    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const compareAtPrice = product.compareAtPriceRange?.minVariantPrice.amount
        ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
        : null;
    const hasDiscount = compareAtPrice && compareAtPrice > price;
    const discountPercent = hasDiscount
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0;

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({
                productId: product.id,
                handle: product.handle,
                title: product.title,
                image: product.featuredImage?.url || '',
                price: product.priceRange.minVariantPrice.amount,
                variantId: firstVariantId || null,
            });
        }
    };

    const handleCompareToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

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
                    title: 'Default',
                    price: product.priceRange.minVariantPrice.amount,
                })),
            };
            addToCompare(compareItem);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (firstVariantId && product.availableForSale) {
            addToCart(firstVariantId);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.5,
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl bg-card">
                    <Link href={`/products/${product.handle}`} className="block">
                        {/* Image Container */}
                        <div className="relative aspect-square overflow-hidden bg-muted">
                            {product.featuredImage?.url ? (
                                <Image
                                    src={product.featuredImage.url}
                                    alt={product.featuredImage.altText || product.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    priority={priority}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted to-muted/50">
                                    <ShoppingCart className="h-12 w-12" />
                                </div>
                            )}

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {hasDiscount && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    >
                                        <Badge variant="destructive" className="text-xs font-semibold px-2 py-1 rounded-full">
                                            -{discountPercent}%
                                        </Badge>
                                    </motion.div>
                                )}
                                {!product.availableForSale && (
                                    <Badge variant="secondary" className="text-xs rounded-full">
                                        Sold Out
                                    </Badge>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className={cn(
                                            'h-9 w-9 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white',
                                            inWishlist && 'text-red-500 bg-red-50 hover:bg-red-100'
                                        )}
                                        onClick={handleWishlistToggle}
                                    >
                                        <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
                                    </Button>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className={cn(
                                            'h-9 w-9 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white',
                                            inCompare && 'text-primary bg-primary/10 hover:bg-primary/20'
                                        )}
                                        onClick={handleCompareToggle}
                                        disabled={!canAdd && !inCompare}
                                    >
                                        <GitCompare className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            </div>

                            {/* Quick Add Button */}
                            {product.availableForSale && (
                                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            className="w-full shadow-xl rounded-full font-semibold"
                                            onClick={handleAddToCart}
                                            disabled={isCartLoading}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add to Cart
                                        </Button>
                                    </motion.div>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <CardContent className="p-5">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-medium">
                                {product.vendor}
                            </p>
                            <h3 className="font-semibold text-base line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-300">
                                {product.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">
                                    {formatPrice(
                                        product.priceRange.minVariantPrice.amount,
                                        product.priceRange.minVariantPrice.currencyCode
                                    )}
                                </span>
                                {hasDiscount && (
                                    <span className="text-sm text-muted-foreground line-through">
                                        {formatPrice(compareAtPrice.toString(), product.priceRange.minVariantPrice.currencyCode)}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Link>
                </Card>
            </motion.div>
        </motion.div>
    );
}
