import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
    const [lightboxOpen, setLightboxOpen] = useState(false);

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

    const goToPrevious = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    };

    const goToNext = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    };

    const handleMainImageClick = () => {
        if (selectedMedia.type === 'image') {
            setLightboxOpen(true);
        }
    };

    const slides = media
        .filter(m => m.type === 'image')
        .map(m => ({ src: m.url, alt: m.altText || title }));

    // Find the index in the slides array that matches the currently selected media
    // (since videos are filtered out of slides)
    const currentSlideIndex = slides.findIndex(s => s.src === selectedMedia.url);
    const initialSlide = currentSlideIndex >= 0 ? currentSlideIndex : 0;

    return (
        <div className="flex flex-col gap-4 group/gallery">
            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={slides}
                index={initialSlide}
            />

            {/* Main Media */}
            <div
                className={cn(
                    "relative aspect-square rounded-[14px] overflow-hidden bg-[#f4f4f5] border border-[#e6e2d9]",
                    selectedMedia.type === 'image' && "cursor-zoom-in"
                )}
                onClick={handleMainImageClick}
            >
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

                {/* Zoom Badge Hint */}
                {selectedMedia.type === 'image' && (
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover/gallery:opacity-100 transition-opacity pointer-events-none">
                        <ZoomIn className="h-4 w-4 text-[#111]" />
                    </div>
                )}

                {/* Navigation Arrows */}
                {media.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-opacity bg-white/90 hover:bg-white text-[#111]"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg opacity-0 group-hover/gallery:opacity-100 transition-opacity bg-white/90 hover:bg-white text-[#111]"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {media.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {media.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                'relative w-[72px] h-[72px] rounded-[10px] overflow-hidden flex-shrink-0 border transition-all duration-200',
                                selectedIndex === index
                                    ? 'border-[#6e8b63] ring-1 ring-[#6e8b63]'
                                    : 'border-transparent hover:border-[#e6e2d9]'
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
