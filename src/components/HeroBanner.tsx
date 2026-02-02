import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: string;
}

export function HeroBanner({
    title = 'Discover Premium Products',
    subtitle = 'Shop the latest in home & kitchen and electronics. Quality guaranteed with free shipping on orders over $50.',
    ctaText = 'Shop Now',
    ctaLink = '/collections/all',
    backgroundImage,
}: HeroBannerProps) {
    return (
        <section className="relative overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-primary/80"
                style={
                    backgroundImage
                        ? {
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }
                        : undefined
                }
            >
                {backgroundImage && (
                    <div className="absolute inset-0 bg-black/40" />
                )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 py-20 md:py-32 lg:py-40">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                        {subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            asChild
                            size="lg"
                            variant="secondary"
                            className="text-primary font-semibold group"
                        >
                            <Link href={ctaLink}>
                                {ctaText}
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                        >
                            <Link href="/collections/new-arrivals">
                                New Arrivals
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
