'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const reviews = [
    {
        id: 1,
        name: 'Aarav Patel',
        rating: 5,
        comment: 'Absolutely love the quality! Fast shipping and excellent customer service.',
        date: '2 weeks ago',
    },
    {
        id: 2,
        name: 'Riya Sharma',
        rating: 5,
        comment: 'Best purchase I\'ve made this year. Exceeded my expectations in every way.',
        date: '1 month ago',
    },
    {
        id: 3,
        name: 'Kunal Mehta',
        rating: 4,
        comment: 'Great products at reasonable prices. Will definitely shop here again.',
        date: '1 month ago',
    },
    {
        id: 4,
        name: 'Neha Desai',
        rating: 5,
        comment: 'The attention to detail is impressive. Highly recommend!',
        date: '2 months ago',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

export function ReviewsSection() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                        What Our Customers Say
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Join thousands of satisfied customers
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                >
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl h-full relative overflow-hidden group">
                                {/* Decorative quote */}
                                <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Quote className="h-16 w-16 text-primary" />
                                </div>

                                <CardContent className="pt-8 pb-6 px-6 relative">
                                    <div className="flex items-center gap-4 mb-5">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold text-lg">
                                                {review.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{review.name}</p>
                                            <p className="text-xs text-muted-foreground">{review.date}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.5 + i * 0.1 }}
                                            >
                                                <Star
                                                    className={`h-4 w-4 ${i < review.rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-muted-foreground/30'
                                                        }`}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>

                                    <p className="text-muted-foreground leading-relaxed italic">
                                        &quot;{review.comment}&quot;
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
