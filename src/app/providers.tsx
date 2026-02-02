'use client';

import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CompareProvider } from '@/context/CompareContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <CompareProvider>
                        <RecentlyViewedProvider>
                            {children}
                        </RecentlyViewedProvider>
                    </CompareProvider>
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
}
