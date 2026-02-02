'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoPlayer, YouTubeEmbed } from '@/components/VideoPlayer';

interface VideoSectionProps {
    title?: string;
    subtitle?: string;
    videoType: 'self-hosted' | 'youtube' | 'vimeo';
    videoSrc: string;
    poster?: string;
    ctaText?: string;
    ctaLink?: string;
    layout?: 'full-width' | 'side-by-side' | 'overlay';
}

// Animation variants
const heroTextVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: 'easeOut' as const },
    },
};

const heroSubtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' as const },
    },
};

const heroButtonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: 0.6, ease: 'easeOut' as const },
    },
};

const videoZoomVariants = {
    initial: { scale: 1.1 },
    animate: {
        scale: 1,
        transition: { duration: 8, ease: 'linear' as const },
    },
};

const scrollIndicatorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: 1.2 },
    },
    bounce: {
        y: [0, 8, 0],
        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
};

export function VideoSection({
    title,
    subtitle,
    videoType,
    videoSrc,
    poster,
    ctaText,
    ctaLink,
    layout = 'full-width',
}: VideoSectionProps) {
    const renderVideo = () => {
        switch (videoType) {
            case 'youtube':
                return <YouTubeEmbed videoId={videoSrc} title={title} />;
            case 'vimeo':
                return (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                        <iframe
                            src={`https://player.vimeo.com/video/${videoSrc}`}
                            title={title || 'Vimeo video'}
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        />
                    </div>
                );
            case 'self-hosted':
            default:
                return (
                    <VideoPlayer
                        src={videoSrc}
                        poster={poster}
                        title={title}
                        className="aspect-video"
                    />
                );
        }
    };

    // Overlay layout - full-width hero with animations
    if (layout === 'overlay') {
        return (
            <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
                {/* Video Background with zoom animation */}
                <motion.div
                    variants={videoZoomVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 w-full h-full"
                >
                    {videoType === 'self-hosted' ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster={poster}
                            className="absolute inset-0 w-full h-full object-cover"
                        >
                            <source src={videoSrc} type="video/mp4" />
                        </video>
                    ) : (
                        <div className="absolute inset-0">
                            {videoType === 'youtube' ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoSrc}?autoplay=1&mute=1&loop=1&playlist=${videoSrc}&controls=0&showinfo=0`}
                                    title={title || 'YouTube video'}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    className="absolute inset-0 w-full h-full scale-150"
                                />
                            ) : (
                                <iframe
                                    src={`https://player.vimeo.com/video/${videoSrc}?autoplay=1&muted=1&loop=1&background=1`}
                                    title={title || 'Vimeo video'}
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    className="absolute inset-0 w-full h-full scale-150"
                                />
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="max-w-5xl">
                        {title && (
                            <motion.h1
                                variants={heroTextVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
                                style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
                            >
                                {title}
                            </motion.h1>
                        )}
                        {subtitle && (
                            <motion.p
                                variants={heroSubtitleVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-white/90 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-10 font-light"
                                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                            >
                                {subtitle}
                            </motion.p>
                        )}
                        {ctaText && ctaLink && (
                            <motion.div
                                variants={heroButtonVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        asChild
                                        size="lg"
                                        className="text-lg px-10 py-6 rounded-full font-semibold bg-white text-black hover:bg-white/90 shadow-xl"
                                    >
                                        <Link href={ctaLink}>
                                            <Play className="h-5 w-5 mr-2" />
                                            {ctaText}
                                        </Link>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    variants={scrollIndicatorVariants}
                    initial="hidden"
                    animate={['visible', 'bounce']}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
                >
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm font-light tracking-widest uppercase">Scroll</span>
                        <ArrowDown className="h-5 w-5" />
                    </div>
                </motion.div>
            </section>
        );
    }

    // Side-by-side layout with animations
    if (layout === 'side-by-side') {
        return (
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="order-2 lg:order-1"
                        >
                            {title && (
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                            {ctaText && ctaLink && (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button asChild size="lg" className="rounded-full px-8">
                                        <Link href={ctaLink}>
                                            <Play className="h-4 w-4 mr-2" />
                                            {ctaText}
                                        </Link>
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="order-1 lg:order-2"
                        >
                            {renderVideo()}
                        </motion.div>
                    </div>
                </div>
            </section>
        );
    }

    // Full-width layout (default) with animations
    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {(title || subtitle) && (
                        <div className="text-center mb-12">
                            {title && (
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="max-w-5xl mx-auto">{renderVideo()}</div>
                    {ctaText && ctaLink && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-center mt-10"
                        >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button asChild size="lg" className="rounded-full px-8">
                                    <Link href={ctaLink}>{ctaText}</Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}

// Hero Video Banner with overlay text
interface VideoHeroProps {
    videoSrc: string;
    poster?: string;
    title: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
}

export function VideoHero({
    videoSrc,
    poster,
    title,
    subtitle,
    ctaText,
    ctaLink,
}: VideoHeroProps) {
    return (
        <section className="relative h-screen min-h-[600px] overflow-hidden">
            {/* Background Video with zoom */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'linear' }}
                className="absolute inset-0"
            >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={poster}
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>
            </motion.div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 flex items-center">
                <div className="max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white tracking-tight"
                    >
                        {title}
                    </motion.h1>
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="text-xl md:text-2xl mb-10 text-white/90 font-light"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                    {ctaText && ctaLink && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    asChild
                                    size="lg"
                                    className="text-lg px-10 py-6 rounded-full bg-white text-black hover:bg-white/90"
                                >
                                    <Link href={ctaLink}>{ctaText}</Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
