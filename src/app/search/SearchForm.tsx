'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFormProps {
    initialQuery: string;
}

export function SearchForm({ initialQuery }: SearchFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(initialQuery);
    const [isPending, startTransition] = useTransition();

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query !== initialQuery) {
                startTransition(() => {
                    if (query) {
                        router.push(`/search?q=${encodeURIComponent(query)}`);
                    } else {
                        router.push('/search');
                    }
                });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query, initialQuery, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-12 pr-12 h-12 text-lg"
                    autoFocus
                />
                {isPending && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
                )}
            </div>
        </form>
    );
}
