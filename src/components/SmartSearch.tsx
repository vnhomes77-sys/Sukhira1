'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Loader2 } from 'lucide-react';
import { shopifyFetch } from '@/lib/shopify';
import { PREDICTIVE_SEARCH } from '@/lib/queries';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Suggestion {
    id: string;
    handle: string;
    title: string;
    vendor: string;
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    featuredImage: {
        url: string;
        altText: string;
        width: number;
        height: number;
    } | null;
}

export function SmartSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // Custom simple debounce logic if hook doesn't exist yet
    // Ideally we create a hook, but for now inline effect is robust enough for this component
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 250);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await shopifyFetch<{
                    predictiveSearch: {
                        products: Suggestion[];
                    };
                }>({
                    query: PREDICTIVE_SEARCH,
                    variables: { query: debouncedQuery },
                });

                if (response && response.predictiveSearch) {
                    setResults(response.predictiveSearch.products);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        if (open) fetchSuggestions();
    }, [debouncedQuery, open]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setOpen(false);
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-xs md:max-w-sm lg:max-w-md pointer-events-auto">
            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    className="w-full bg-[#f7f5ee]/90 backdrop-blur-md border border-[#e6e2d9] text-[#111111] rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#56AF31] focus:border-transparent placeholder-[#111111]/50 transition-all shadow-sm focus:shadow-md"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#111111]/50 group-focus-within:text-[#56AF31] transition-colors" />

                {query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#111111]/50 hover:text-[#111111]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </form>

            {/* Dropdown Results */}
            <AnimatePresence>
                {open && query.length >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-[#e6e2d9] rounded-2xl shadow-xl overflow-hidden z-[100]"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center p-6 text-[#111111]/70">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                <span>Searching...</span>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="py-2">
                                {/* Suggestions Header */}
                                <div className="px-4 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                                    Products
                                </div>

                                {/* List */}
                                <ul className="max-h-[60vh] overflow-y-auto">
                                    {results.map((product) => (
                                        <li key={product.id}>
                                            <Link
                                                href={`/products/${product.handle}`}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-[#f7f5ee] transition-colors group/item"
                                                onClick={() => setOpen(false)}
                                            >
                                                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-[#e6e2d9]">
                                                    {product.featuredImage && (
                                                        <img
                                                            src={product.featuredImage.url}
                                                            alt={product.featuredImage.altText || product.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-[#111111] group-hover/item:text-[#56AF31] transition-colors truncate">
                                                        {product.title}
                                                    </h4>
                                                    <p className="text-xs text-[#666666]">
                                                        {product.priceRange.minVariantPrice.currencyCode} {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                                                    </p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                {/* View All */}
                                <div className="border-t border-[#e6e2d9] p-2">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-center text-sm text-[#111111]/70 hover:text-[#111111] hover:bg-[#f7f5ee] h-9"
                                        onClick={handleSubmit}
                                    >
                                        View all results for "{query}"
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 text-center text-[#111111]/50">
                                <p>No products found for "{query}"</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
