'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Media item can be image or video
interface MediaItem {
    type: 'image' | 'video' | 'external_video';
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
    // For videos
    embedUrl?: string;
    previewImage?: {
        url: string;
    };
}

interface ProductGalleryProps {
    images: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
    }[];
    // Optional videos from Shopify product media
    videos?: {
        embedUrl: string;
        previewImage?: {
            url: string;
        };
    }[];
    title: string;
}

export function ProductGallery({ images, videos = [], title }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Combine images and videos into media array
    const media: MediaItem[] = [
        ...images.map((img) => ({
            type: 'image' as const,
            url: img.url,
            altText: img.altText,
            width: img.width,
            height: img.height,
        })),
        ...videos.map((vid) => ({
            type: 'external_video' as const,
            url: vid.embedUrl,
            embedUrl: vid.embedUrl,
            previewImage: vid.previewImage,
        })),
    ];

    if (media.length === 0) {
        return (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No media available</span>
            </div>
        );
    }

    const selectedMedia = media[selectedIndex];

    const goToPrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setSelectedIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Media */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                {selectedMedia.type === 'image' ? (
                    <Image
                        src={selectedMedia.url}
                        alt={selectedMedia.altText || title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                ) : (
                    <iframe
                        src={selectedMedia.embedUrl}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                )}

                {/* Navigation Arrows */}
                {media.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {media.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {media.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                'relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors',
                                selectedIndex === index
                                    ? 'border-primary'
                                    : 'border-transparent hover:border-muted-foreground/50'
                            )}
                        >
                            {item.type === 'image' ? (
                                <Image
                                    src={item.url}
                                    alt={item.altText || `${title} - Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            ) : (
                                <>
                                    {item.previewImage ? (
                                        <Image
                                            src={item.previewImage.url}
                                            alt={`${title} - Video ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <Play className="h-4 w-4" />
                                        </div>
                                    )}
                                    {/* Video indicator */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <Play className="h-4 w-4 text-white" />
                                    </div>
                                </>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
