'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ShopifyCollection } from '@/lib/shopify';

interface CategoryCardsProps {
    collections: ShopifyCollection[];
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const },
    },
};

const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const },
    },
};

export function CategoryCards({ collections }: CategoryCardsProps) {
    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <motion.h2
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 tracking-tight"
                >
                    Shop by Category
                </motion.h2>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                >
                    {collections.map((collection) => (
                        <motion.div key={collection.id} variants={itemVariants}>
                            <Link href={`/collections/${collection.handle}`} className="group block">
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                        {collection.image?.url ? (
                                            <Image
                                                src={collection.image.url}
                                                alt={collection.image.altText || collection.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/50 flex items-center justify-center">
                                                <span className="text-5xl font-bold text-primary/40">
                                                    {collection.title.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
                                        <CardContent className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="font-semibold text-white text-xl group-hover:translate-y-[-4px] transition-transform duration-300">
                                                {collection.title}
                                            </h3>
                                            <p className="text-white/70 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                Explore Collection →
                                            </p>
                                        </CardContent>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Static version with animations
export function CategoryCardsStatic() {
    const staticCategories = [
        { handle: 'home-kitchen', title: 'Home & Kitchen', color: 'from-[#56AF31] to-[#2D5335]' },
        { handle: 'electronics', title: 'Electronics', color: 'from-[#92D5F2] to-[#56AF31]' },
        { handle: 'new-arrivals', title: 'New Arrivals', color: 'from-[#2D5335] to-[#1D1D1B]' },
        { handle: 'sale', title: 'Sale', color: 'from-[#FFE900] to-[#56AF31]' },
    ];

    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 tracking-tight"
                >
                    Shop by Category
                </motion.h2>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                >
                    {staticCategories.map((category, index) => (
                        <motion.div
                            key={category.handle}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link href={`/collections/${category.handle}`} className="group block">
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}
                                        />
                                        {/* Decorative elements */}
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 blur-xl" />
                                            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/10 blur-lg" />
                                        </div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                            <motion.h3
                                                className="font-bold text-white text-xl md:text-2xl"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {category.title}
                                            </motion.h3>
                                            <p className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                Explore →
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
