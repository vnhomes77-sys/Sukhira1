'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/storage';
import { toast } from 'sonner';

export interface CompareItem {
    productId: string;
    handle: string;
    title: string;
    image: string;
    price: string;
    compareAtPrice?: string;
    vendor: string;
    productType: string;
    tags: string[];
    availableForSale: boolean;
    variants: {
        title: string;
        price: string;
    }[];
}

const MAX_COMPARE_ITEMS = 4;

interface CompareState {
    items: CompareItem[];
    isLoading: boolean;
}

type CompareAction =
    | { type: 'SET_ITEMS'; payload: CompareItem[] }
    | { type: 'ADD_ITEM'; payload: CompareItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'CLEAR' };

function compareReducer(state: CompareState, action: CompareAction): CompareState {
    switch (action.type) {
        case 'SET_ITEMS':
            return { ...state, items: action.payload, isLoading: false };
        case 'ADD_ITEM':
            if (state.items.length >= MAX_COMPARE_ITEMS) {
                return state;
            }
            return { ...state, items: [...state.items, action.payload] };
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter((item) => item.productId !== action.payload) };
        case 'CLEAR':
            return { ...state, items: [] };
        default:
            return state;
    }
}

interface CompareContextType {
    items: CompareItem[];
    isLoading: boolean;
    itemCount: number;
    canAdd: boolean;
    addToCompare: (item: CompareItem) => void;
    removeFromCompare: (productId: string) => void;
    isInCompare: (productId: string) => boolean;
    clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(compareReducer, {
        items: [],
        isLoading: true,
    });

    // Load from localStorage on mount
    useEffect(() => {
        const items = getStorageItem<CompareItem[]>(STORAGE_KEYS.COMPARE, []);
        dispatch({ type: 'SET_ITEMS', payload: items });
    }, []);

    // Persist to localStorage
    const persistCompare = useCallback((items: CompareItem[]) => {
        setStorageItem(STORAGE_KEYS.COMPARE, items);
    }, []);

    const addToCompare = useCallback(
        (item: CompareItem) => {
            if (state.items.some((i) => i.productId === item.productId)) {
                toast.info('Product already in compare list');
                return;
            }

            if (state.items.length >= MAX_COMPARE_ITEMS) {
                toast.error(`You can only compare up to ${MAX_COMPARE_ITEMS} products`);
                return;
            }

            dispatch({ type: 'ADD_ITEM', payload: item });
            persistCompare([...state.items, item]);
            toast.success('Added to compare');
        },
        [state.items, persistCompare]
    );

    const removeFromCompare = useCallback(
        (productId: string) => {
            dispatch({ type: 'REMOVE_ITEM', payload: productId });
            const newItems = state.items.filter((item) => item.productId !== productId);
            persistCompare(newItems);
            toast.success('Removed from compare');
        },
        [state.items, persistCompare]
    );

    const isInCompare = useCallback(
        (productId: string) => {
            return state.items.some((item) => item.productId === productId);
        },
        [state.items]
    );

    const clearCompare = useCallback(() => {
        dispatch({ type: 'CLEAR' });
        persistCompare([]);
        toast.success('Compare list cleared');
    }, [persistCompare]);

    return (
        <CompareContext.Provider
            value={{
                items: state.items,
                isLoading: state.isLoading,
                itemCount: state.items.length,
                canAdd: state.items.length < MAX_COMPARE_ITEMS,
                addToCompare,
                removeFromCompare,
                isInCompare,
                clearCompare,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
}
