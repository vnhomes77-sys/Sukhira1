'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { formatPrice } from '@/lib/money';

interface RecentlyViewedSectionProps {
    currentProductId?: string;
}

export function RecentlyViewedSection({ currentProductId }: RecentlyViewedSectionProps) {
    const { items, isLoading } = useRecentlyViewed();

    // Filter out current product and limit to display
    const displayItems = items
        .filter((item) => item.productId !== currentProductId)
        .slice(0, 8);

    if (isLoading) {
        return null;
    }

    if (displayItems.length === 0) {
        return null;
    }

    return (
        <section className="py-8 md:py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Recently Viewed</h2>

                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-4 pb-4">
                        {displayItems.map((item) => (
                            <Link
                                key={item.productId}
                                href={`/products/${item.handle}`}
                                className="group flex-shrink-0"
                            >
                                <Card className="w-40 md:w-48 overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative aspect-square overflow-hidden bg-muted">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                sizes="192px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-3">
                                        <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors whitespace-normal">
                                            {item.title}
                                        </p>
                                        <p className="font-semibold text-sm mt-1">
                                            {formatPrice(item.price)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    );
}
