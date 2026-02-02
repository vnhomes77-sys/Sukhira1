'use client';

import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

const badges = [
    {
        icon: Truck,
        title: 'Free Shipping',
        description: 'On orders over $50',
    },
    {
        icon: Shield,
        title: 'Secure Payment',
        description: '100% protected',
    },
    {
        icon: RefreshCw,
        title: 'Easy Returns',
        description: '30-day return policy',
    },
    {
        icon: Headphones,
        title: '24/7 Support',
        description: 'Here to help',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

export function TrustBadges() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-muted/30 via-muted/50 to-muted/30">
            <div className="container mx-auto px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
                >
                    {badges.map((badge) => (
                        <motion.div
                            key={badge.title}
                            variants={itemVariants}
                            whileHover={{ y: -4 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                            >
                                <badge.icon className="h-7 w-7 md:h-9 md:w-9 text-primary" />
                            </motion.div>
                            <h3 className="font-semibold text-base md:text-lg mb-1 tracking-tight">
                                {badge.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {badge.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
