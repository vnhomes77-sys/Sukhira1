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
    Plus
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
    const [collectionsOpen, setCollectionsOpen] = useState(false);
    const [plusMenuOpen, setPlusMenuOpen] = useState(false);
    const { openCart, totalQuantity } = useCart();
    const { customer, isLoggedIn } = useAuth();

    // Handle scroll for minor aesthetic changes if needed,
    // though floating nav usually stays consistent
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/*
        Floating Header Container
        positioned fixed at top, allowing clicks to pass through empty areas
      */}
            <header className="fixed top-6 left-0 right-0 z-50 flex items-start justify-between px-4 md:px-8 pointer-events-none">

                {/* Logo - Floating independently on the left */}
                <div className="pointer-events-auto">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-10 w-10 md:h-12 md:w-12 bg-[#56AF31] rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                            <span className="font-bold text-xl">S</span>
                        </div>
                        {/* Hide text on mobile to save space, or keep it if it fits */}
                        <span className={cn(
                            "text-xl font-bold tracking-tight text-white drop-shadow-md hidden md:block opacity-0 lg:opacity-100 transition-opacity",
                            scrolled && "lg:opacity-0" // Optional: Hide label on scroll for cleaner look
                        )}>
                            Sukhira
                        </span>
                    </Link>
                </div>

                {/* Center/Right Container for Pill + Icons */}
                <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">

                    {/* Search Bar - Hidden on very small screens, visible on md+ */}
                    <div className="hidden lg:block w-72">
                        <SmartSearch />
                    </div>

                    {/* Main Navigation Pill */}
                    <nav className="hidden md:flex items-center gap-1 bg-[#1D1D1B]/85 backdrop-blur-md border border-white/10 text-white rounded-full px-6 py-2 shadow-xl transition-all hover:bg-[#1D1D1B]/95">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 hover:bg-white/10 rounded-full text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}


                        {/* Dropdown for 'Collections' */}
                        <div
                            onMouseEnter={() => setCollectionsOpen(true)}
                            onMouseLeave={() => setCollectionsOpen(false)}
                        >
                            <DropdownMenu open={collectionsOpen} onOpenChange={setCollectionsOpen} modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-1 px-4 py-2 hover:bg-white/10 rounded-full text-sm font-medium transition-colors outline-none h-full">
                                        Collections <ChevronDown className="h-3 w-3 opacity-70" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="bg-[#1D1D1B]/95 border-white/10 text-white rounded-xl backdrop-blur-xl p-2 mt-2 w-48">
                                    {collectionsLinks.map((link) => (
                                        <DropdownMenuItem key={link.href} asChild className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
                                            <Link href={link.href}>{link.label}</Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Link
                            href="/collections/sale"
                            className="px-4 py-2 hover:bg-white/10 rounded-full text-sm font-medium transition-colors text-yellow-400"
                        >
                            Sale
                        </Link>

                        {/* Plus Icon Action / More Menu */}
                        <div
                            onMouseEnter={() => setPlusMenuOpen(true)}
                            onMouseLeave={() => setPlusMenuOpen(false)}
                        >
                            <DropdownMenu open={plusMenuOpen} onOpenChange={setPlusMenuOpen} modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <button className="h-8 w-8 ml-1 flex items-center justify-center rounded-full hover:bg-[#56AF31] text-white/70 hover:text-white transition-all outline-none">
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#1D1D1B]/95 border-white/10 text-white rounded-xl backdrop-blur-xl p-2 mt-2 w-40">
                                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
                                        <Link href="/pages/about-us">About Us</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
                                        <Link href="/pages/contact-us">Contact Us</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </nav>

                    {/* Mobile Menu Button (Visible only on mobile) */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden h-12 w-12 flex items-center justify-center bg-[#1D1D1B]/85 backdrop-blur-md border border-white/10 text-white rounded-full shadow-xl hover:bg-[#1D1D1B]/95"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Cart Circle */}
                    <button
                        onClick={openCart}
                        className="group relative h-12 w-12 flex items-center justify-center bg-[#1D1D1B]/85 backdrop-blur-md border border-white/10 text-white rounded-full shadow-xl hover:bg-[#56AF31] transition-all duration-300"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <AnimatePresence>
                            {totalQuantity > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <Badge className="h-5 w-5 flex items-center justify-center p-0 text-[10px] border-0 bg-[#56AF31] text-white shadow-sm group-hover:bg-white group-hover:text-[#56AF31]">
                                        {totalQuantity}
                                    </Badge>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Account Circle */}
                    <Link href={isLoggedIn ? "/account" : "/account/login"}>
                        <div className="h-12 w-12 flex items-center justify-center bg-[#1D1D1B]/85 backdrop-blur-md border border-white/10 text-white rounded-full shadow-xl hover:bg-[#56AF31] transition-all duration-300">
                            <User className="h-5 w-5" />
                        </div>
                    </Link>

                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[100] bg-[#1D1D1B] pt-24 px-6 md:hidden"
                    >
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        <nav className="flex flex-col gap-6 text-center">
                            {[...navLinks, ...collectionsLinks, { href: '/collections/sale', label: 'Sale' }].map((link, i) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-2xl font-medium text-white hover:text-[#56AF31]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-white/10 my-4" />
                            <Link
                                href="/account"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xl text-white/80"
                            >
                                My Account
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
