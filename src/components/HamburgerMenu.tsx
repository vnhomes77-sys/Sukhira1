'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

// Menu Data Structure
const menuSections = [
    {
        title: "Collections",
        items: [
            { label: "Home & Kitchen", url: "/collections/home-kitchen" },
            { label: "Electronics", url: "/collections/electronics" },
            { label: "New Arrivals", url: "/collections/new-arrivals" },
            { label: "View All Products", url: "/collections/all" }
        ]
    },
    {
        title: "Customer Service",
        items: [
            { label: "Track Order", url: "/pages/track-order" },
            { label: "Contact Us", url: "/pages/contact-us" },
            { label: "FAQ", url: "/pages/faq" }
        ]
    },
    {
        title: "Policies",
        items: [
            { label: "Shipping Policy", url: "/pages/shipping-policy" },
            { label: "Return Policy", url: "/pages/return-policy" },
            { label: "Privacy Policy", url: "/pages/privacy-policy" },
            { label: "Terms & Conditions", url: "/pages/terms-and-conditions" }
        ]
    }
];

const featuredCards = [
    {
        title: "Home & Kitchen",
        subtitle: "Essentials for everyday use",
        image: "/images/home-kitchen-card-bg.png", // Assuming these exist or will use placeholders
        link: "/collections/home-kitchen",
        gradient: "from-[#1a1a1a] to-[#2d2d2d]"
    },
    {
        title: "Electronics",
        subtitle: "Smart gadgets & accessories",
        image: "/images/electronics-card-bg.png",
        link: "/collections/electronics",
        gradient: "from-[#0f172a] to-[#1e293b]"
    }
];

export function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false); // Mobile drawer state
    const [isHovered, setIsHovered] = useState(false); // Desktop hover state
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
        setIsHovered(false);
    }, [pathname]);

    // Handle Scroll Lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Start listening for Escape key to close
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setIsOpen(false);
            };
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);



    // Handle Desktop Hover
    const handleMouseEnter = () => {
        if (window.innerWidth >= 768) { // md breakpoint
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setIsHovered(true), 120);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 768) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setIsHovered(false), 160);
        }
    };

    // Handle Mobile Click
    const handleClick = () => {
        if (window.innerWidth < 768) {
            setIsOpen(true);
        }
    };

    return (
        <div
            className="relative z-50 flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Hamburger Icon Trigger */}
            <button
                onClick={handleClick}
                className={cn(
                    "flex items-center justify-center h-10 w-10 md:h-10 md:w-10 rounded-full transition-all duration-300",
                    isHovered || isOpen ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10"
                )}
                aria-label="Menu"
            >
                <Menu className="h-[18px] w-[18px]" />
            </button>

            {/* Desktop Mega Menu Dropdown */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="hidden md:absolute md:block top-full left-0 mt-4 w-[600px] lg:w-[800px] p-1"
                        style={{ perspective: '1000px' }}
                    >
                        <div className="bg-[#141414]/90 backdrop-blur-xl border border-white/10 rounded-[18px] shadow-[0_18px_40px_rgba(0,0,0,0.35)] overflow-hidden p-6 flex gap-8">

                            {/* Navigation Lists */}
                            <div className="flex-1 grid grid-cols-2 gap-8">
                                {menuSections.map((section) => (
                                    <div key={section.title} className="space-y-4">
                                        <h3 className="text-sm font-semibold text-white/50 bg-white/5 px-3 py-1 rounded-full w-fit uppercase tracking-wider">
                                            {section.title}
                                        </h3>
                                        <ul className="space-y-1">
                                            {section.items.map((item) => (
                                                <li key={item.label}>
                                                    <Link
                                                        href={item.url}
                                                        className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* Featured Cards */}
                            <div className="w-[280px] flex flex-col gap-4">
                                {featuredCards.map((card) => (
                                    <Link
                                        key={card.title}
                                        href={card.link}
                                        className="group relative h-32 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all"
                                    >
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", card.gradient)} />
                                        {/* Image overlay if available */}
                                        {/* <Image src={card.image} fill className="object-cover opacity-50 group-hover:opacity-40 transition-opacity" /> */}

                                        <div className="relative h-full p-4 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-white mb-1 group-hover:text-[#56AF31] transition-colors">{card.title}</h4>
                                                <p className="text-xs text-white/60">{card.subtitle}</p>
                                            </div>
                                            <div className="flex justify-end">
                                                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#56AF31] group-hover:text-white transition-all">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Drawer Overlay via Portal */}
            <MobileDrawerPortal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}

function MobileDrawerPortal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    // We use document.body as the container for the portal
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 50 }}
                    className="fixed inset-0 z-[9999] md:hidden"
                >
                    {/* Dark Overlay - Explicitly separate div to handle clicks */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute inset-y-0 left-0 w-[82vw] max-w-[360px] bg-[#111111] shadow-2xl flex flex-col h-full overflow-y-auto border-r border-white/10 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-white/5">
                            <Link href="/" onClick={onClose} className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                                <img src="/images/sukhira-logo.png" alt="Sukhira Logo" className="h-full w-full object-cover" />
                            </Link>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8">
                            {menuSections.map((section) => (
                                <div key={section.title} className="space-y-3">
                                    <h3 className="text-xs font-bold text-[#56AF31] uppercase tracking-widest pl-2 opacity-80">
                                        {section.title}
                                    </h3>
                                    <div className="flex flex-col space-y-1">
                                        {section.items.map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.url}
                                                onClick={onClose}
                                                className="flex items-center justify-between px-3 py-3 text-white/90 hover:bg-white/5 rounded-lg active:bg-white/10 transition-colors"
                                            >
                                                <span className="font-medium text-[15px]">{item.label}</span>
                                                <ChevronRight className="h-4 w-4 opacity-30" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-white/10 bg-[#141414]">
                            <Link
                                href="/account/login"
                                onClick={onClose}
                                className="flex items-center justify-center w-full py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 rounded-xl text-white font-medium transition-colors border border-white/5"
                            >
                                Login / Register
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
