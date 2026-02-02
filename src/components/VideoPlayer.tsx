'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    className?: string;
}

export function VideoPlayer({
    src,
    poster,
    title,
    autoPlay = false,
    muted = true,
    loop = false,
    className,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(muted);
    const [showControls, setShowControls] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    return (
        <div
            className={cn('relative group rounded-lg overflow-hidden bg-black', className)}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            >
                Your browser does not support the video tag.
            </video>

            {/* Play button overlay */}
            {!isPlaying && (
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
                >
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-8 w-8 text-black ml-1" />
                    </div>
                </button>
            )}

            {/* Controls */}
            <div
                className={cn(
                    'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity',
                    showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                )}
            >
                {title && <p className="text-white text-sm mb-2">{title}</p>}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={togglePlay}
                    >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={toggleMute}
                    >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <div className="flex-1" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={toggleFullscreen}
                    >
                        <Maximize className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

// YouTube Embed Component
interface YouTubeEmbedProps {
    videoId: string;
    title?: string;
    autoPlay?: boolean;
    className?: string;
}

export function YouTubeEmbed({
    videoId,
    title = 'YouTube video',
    autoPlay = false,
    className,
}: YouTubeEmbedProps) {
    return (
        <div className={cn('relative aspect-video rounded-lg overflow-hidden', className)}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}${autoPlay ? '?autoplay=1&mute=1' : ''}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}

// Vimeo Embed Component
interface VimeoEmbedProps {
    videoId: string;
    title?: string;
    autoPlay?: boolean;
    className?: string;
}

export function VimeoEmbed({
    videoId,
    title = 'Vimeo video',
    autoPlay = false,
    className,
}: VimeoEmbedProps) {
    return (
        <div className={cn('relative aspect-video rounded-lg overflow-hidden', className)}>
            <iframe
                src={`https://player.vimeo.com/video/${videoId}${autoPlay ? '?autoplay=1&muted=1' : ''}`}
                title={title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}

// Shopify External Video Component (for product media)
interface ShopifyVideoProps {
    embedUrl: string;
    title?: string;
    className?: string;
}

export function ShopifyExternalVideo({ embedUrl, title, className }: ShopifyVideoProps) {
    return (
        <div className={cn('relative aspect-video rounded-lg overflow-hidden', className)}>
            <iframe
                src={embedUrl}
                title={title || 'Product video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}
