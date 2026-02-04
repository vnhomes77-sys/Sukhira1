'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ShoppingCart,
    User,
    Menu,
    X,
    ChevronDown,
    Plus,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { SmartSearch } from '@/components/SmartSearch';

const navLinks = [
    { href: '/collections/home-kitchen', label: 'Home & Kitchen' },
    { href: '/collections/electronics', label: 'Electronics' },
];

const collectionsLinks = [
    { href: '/collections/cookware', label: 'Cookware' },
    { href: '/collections/appliances', label: 'Appliances' },
    { href: '/collections/decor', label: 'Home Decor' },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { openCart, totalQuantity } = useCart();
    const { customer, isLoggedIn } = useAuth();
    const { itemCount: wishlistCount } = useWishlist();

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const updatedNavLinks = [
        ...navLinks,
        { href: '/collections/new-arrivals', label: 'New Arrivals' }
    ];

    return (
        <>
            <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
                {/* Main Glass Pill Container */}
                <nav className="pointer-events-auto flex items-center bg-[#141414]/55 backdrop-blur-md border border-white/10 rounded-full p-2 shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all">

                    {/* Logo (Inside Pill) */}
                    <Link href="/" className="flex items-center justify-center h-10 w-10 md:h-11 md:w-11 bg-white rounded-full mr-2 hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
                        <img src="/images/sukhira-logo.png" alt="Sukhira Logo" className="h-full w-full object-cover" />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1 mx-2">
                        {updatedNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-[15px] font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Icons Section */}
                    <div className="flex items-center gap-1 md:gap-2 pl-2">

                        {/* Search Trigger */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="h-10 w-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <Search className="h-[18px] w-[18px]" />
                        </button>

                        {/* Cart */}
                        <button
                            onClick={openCart}
                            className="relative h-10 w-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <ShoppingCart className="h-[18px] w-[18px]" />
                            <AnimatePresence>
                                {totalQuantity > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-0 right-0"
                                    >
                                        <div className="h-4 w-4 bg-[#56AF31] rounded-full flex items-center justify-center text-[10px] text-white font-bold border border-[#141414]">
                                            {totalQuantity}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>

                        {/* Account */}
                        <Link href={isLoggedIn ? "/account" : "/account/login"}>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-all">
                                <User className="h-[18px] w-[18px]" />
                            </div>
                        </Link>

                        {/* Mobile Menu Trigger */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden h-10 w-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-all ml-1"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Search Overlay (Reusing SmartSearch) */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-start pt-32 px-4"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: -20 }}
                            className="w-full max-w-lg relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <SmartSearch />
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="absolute -right-12 top-2 text-white/70 hover:text-white"
                            >
                                <X className="h-8 w-8" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 right-0 z-[100] w-full sm:w-80 bg-[#1D1D1B] shadow-2xl p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
                                <img src="/images/sukhira-logo.png" alt="Sukhira Logo" className="h-full w-full object-cover" />
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-4">
                            {[...updatedNavLinks, ...collectionsLinks].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-medium text-white/90 hover:text-[#56AF31] py-2 border-b border-white/5"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href={isLoggedIn ? "/account" : "/account/login"}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-medium text-white/90 hover:text-[#56AF31] py-2 border-b border-white/5 mt-2"
                            >
                                {isLoggedIn ? "My Account" : "Login / Register"}
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
