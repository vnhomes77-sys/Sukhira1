'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';

export interface RecentlyViewedItem {
    productId: string;
    handle: string;
    title: string;
    image: string;
    price: string;
    viewedAt: number;
}

const MAX_RECENTLY_VIEWED = 12;

interface RecentlyViewedState {
    items: RecentlyViewedItem[];
    isLoading: boolean;
}

type RecentlyViewedAction =
    | { type: 'SET_ITEMS'; payload: RecentlyViewedItem[] }
    | { type: 'ADD_ITEM'; payload: RecentlyViewedItem };

function recentlyViewedReducer(
    state: RecentlyViewedState,
    action: RecentlyViewedAction
): RecentlyViewedState {
    switch (action.type) {
        case 'SET_ITEMS':
            return { ...state, items: action.payload, isLoading: false };
        case 'ADD_ITEM': {
            // Remove existing item if present
            const filtered = state.items.filter((item) => item.productId !== action.payload.productId);
            // Add new item at the beginning
            const newItems = [action.payload, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
            return { ...state, items: newItems };
        }
        default:
            return state;
    }
}

interface RecentlyViewedContextType {
    items: RecentlyViewedItem[];
    isLoading: boolean;
    addRecentlyViewed: (item: Omit<RecentlyViewedItem, 'viewedAt'>) => void;
    clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(recentlyViewedReducer, {
        items: [],
        isLoading: true,
    });

    // Load from localStorage on mount
    useEffect(() => {
        const items = getStorageItem<RecentlyViewedItem[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
        dispatch({ type: 'SET_ITEMS', payload: items });
    }, []);

    const addRecentlyViewed = useCallback(
        (item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
            const newItem: RecentlyViewedItem = {
                ...item,
                viewedAt: Date.now(),
            };

            dispatch({ type: 'ADD_ITEM', payload: newItem });

            // Update localStorage
            const currentItems = getStorageItem<RecentlyViewedItem[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
            const filtered = currentItems.filter((i) => i.productId !== item.productId);
            const newItems = [newItem, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
            setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, newItems);
        },
        []
    );

    const clearRecentlyViewed = useCallback(() => {
        dispatch({ type: 'SET_ITEMS', payload: [] });
        setStorageItem(STORAGE_KEYS.RECENTLY_VIEWED, []);
    }, []);

    return (
        <RecentlyViewedContext.Provider
            value={{
                items: state.items,
                isLoading: state.isLoading,
                addRecentlyViewed,
                clearRecentlyViewed,
            }}
        >
            {children}
        </RecentlyViewedContext.Provider>
    );
}

export function useRecentlyViewed() {
    const context = useContext(RecentlyViewedContext);
    if (context === undefined) {
        throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
    }
    return context;
}
