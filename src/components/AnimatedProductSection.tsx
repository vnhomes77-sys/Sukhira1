'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductCardProps } from '@/components/ProductCard';

interface AnimatedProductSectionProps {
    title: string;
    viewAllLink: string;
    products: ProductCardProps['product'][];
    columns?: 2 | 3 | 4;
}

export function AnimatedProductSection({
    title,
    viewAllLink,
    products,
    columns = 4,
}: AnimatedProductSectionProps) {
    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex items-center justify-between mb-12"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                        {title}
                    </h2>
                    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                        <Button variant="ghost" asChild className="group text-lg">
                            <Link href={viewAllLink}>
                                View All
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>

                {products.length > 0 ? (
                    <ProductGrid products={products} columns={columns} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center py-16 text-muted-foreground bg-muted/30 rounded-2xl"
                    >
                        <p className="text-lg">No products available. Connect your Shopify store to see products.</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
