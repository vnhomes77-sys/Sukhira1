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

// Static version with animations and premium images
export function CategoryCardsStatic() {
    const staticCategories = [
        {
            handle: 'home-kitchen',
            title: 'Home & Kitchen',
            subtitle: 'Everyday essentials for your home',
            image: '/images/home-kitchen.png'
        },
        {
            handle: 'electronics',
            title: 'Electronics',
            subtitle: 'Smart gadgets & accessories',
            image: '/images/electronics.png'
        },
        {
            handle: 'new-arrivals',
            title: 'New Arrivals',
            subtitle: 'Latest products just added',
            image: '/images/new-arrivals.png'
        },
    ];

    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 tracking-tight text-[#111111]"
                >
                    Shop by Category
                </motion.h2>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
                >
                    {staticCategories.map((category) => (
                        <motion.div
                            key={category.handle}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link href={`/collections/${category.handle}`} className="group block relative">
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-[16px] h-[320px] relative group cursor-pointer">
                                    <div className="absolute inset-0">
                                        <Image
                                            src={category.image}
                                            alt={category.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Soft Gradient Overlay */}
                                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-500" />
                                    </div>

                                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white z-10">
                                        <h3 className="font-bold text-2xl md:text-3xl mb-2 drop-shadow-md">
                                            {category.title}
                                        </h3>
                                        <p className="text-white/90 text-sm md:text-base font-medium mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
                                            {category.subtitle}
                                        </p>
                                        <div className="inline-flex items-center text-sm font-semibold border border-white/30 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 w-fit group-hover:bg-white group-hover:text-black transition-all duration-300">
                                            Shop Now
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
