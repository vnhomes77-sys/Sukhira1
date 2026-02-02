'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '@/lib/storage';
import { WishlistItem, getWishlistFromMetafield, saveWishlistToMetafield, mergeWishlists } from '@/lib/metafields';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistState {
    items: WishlistItem[];
    isLoading: boolean;
    isSyncing: boolean;
}

type WishlistAction =
    | { type: 'SET_ITEMS'; payload: WishlistItem[] }
    | { type: 'ADD_ITEM'; payload: WishlistItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_SYNCING'; payload: boolean };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
    switch (action.type) {
        case 'SET_ITEMS':
            return { ...state, items: action.payload, isLoading: false };
        case 'ADD_ITEM':
            return { ...state, items: [...state.items, action.payload] };
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter((item) => item.productId !== action.payload) };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_SYNCING':
            return { ...state, isSyncing: action.payload };
        default:
            return state;
    }
}

interface WishlistContextType {
    items: WishlistItem[];
    isLoading: boolean;
    isSyncing: boolean;
    itemCount: number;
    addToWishlist: (item: WishlistItem) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(wishlistReducer, {
        items: [],
        isLoading: true,
        isSyncing: false,
    });

    const { isLoggedIn, accessToken } = useAuth();

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const localWishlist = getStorageItem<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
        dispatch({ type: 'SET_ITEMS', payload: localWishlist });
    }, []);

    // Sync with Shopify when user logs in
    useEffect(() => {
        const syncWishlist = async () => {
            if (!isLoggedIn || !accessToken) return;

            dispatch({ type: 'SET_SYNCING', payload: true });

            try {
                // Get remote wishlist from customer metafield
                const remoteWishlist = await getWishlistFromMetafield(accessToken);
                const localWishlist = getStorageItem<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);

                // Merge local and remote wishlists
                const mergedWishlist = mergeWishlists(localWishlist, remoteWishlist);

                // Save merged wishlist back to Shopify
                const saved = await saveWishlistToMetafield(accessToken, mergedWishlist);

                if (saved) {
                    // Clear local wishlist after successful sync
                    removeStorageItem(STORAGE_KEYS.WISHLIST);
                    dispatch({ type: 'SET_ITEMS', payload: mergedWishlist });
                    toast.success('Wishlist synced successfully');
                } else {
                    toast.error('Failed to sync wishlist');
                }
            } catch (error) {
                console.error('Wishlist sync error:', error);
                toast.error('Failed to sync wishlist');
            } finally {
                dispatch({ type: 'SET_SYNCING', payload: false });
            }
        };

        syncWishlist();
    }, [isLoggedIn, accessToken]);

    // Persist to localStorage or Shopify based on auth state
    const persistWishlist = useCallback(
        async (items: WishlistItem[]) => {
            if (isLoggedIn && accessToken) {
                // Save to Shopify metafield
                const saved = await saveWishlistToMetafield(accessToken, items);
                if (!saved) {
                    toast.error('Failed to save wishlist');
                }
            } else {
                // Save to localStorage
                setStorageItem(STORAGE_KEYS.WISHLIST, items);
            }
        },
        [isLoggedIn, accessToken]
    );

    const addToWishlist = useCallback(
        async (item: WishlistItem) => {
            // Check if already in wishlist
            if (state.items.some((i) => i.productId === item.productId)) {
                return;
            }

            dispatch({ type: 'ADD_ITEM', payload: item });
            const newItems = [...state.items, item];
            await persistWishlist(newItems);
            toast.success('Added to wishlist');
        },
        [state.items, persistWishlist]
    );

    const removeFromWishlist = useCallback(
        async (productId: string) => {
            dispatch({ type: 'REMOVE_ITEM', payload: productId });
            const newItems = state.items.filter((item) => item.productId !== productId);
            await persistWishlist(newItems);
            toast.success('Removed from wishlist');
        },
        [state.items, persistWishlist]
    );

    const isInWishlist = useCallback(
        (productId: string) => {
            return state.items.some((item) => item.productId === productId);
        },
        [state.items]
    );

    const clearWishlist = useCallback(() => {
        dispatch({ type: 'SET_ITEMS', payload: [] });
        if (isLoggedIn && accessToken) {
            saveWishlistToMetafield(accessToken, []);
        } else {
            removeStorageItem(STORAGE_KEYS.WISHLIST);
        }
    }, [isLoggedIn, accessToken]);

    return (
        <WishlistContext.Provider
            value={{
                items: state.items,
                isLoading: state.isLoading,
                isSyncing: state.isSyncing,
                itemCount: state.items.length,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
