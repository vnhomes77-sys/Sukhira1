'use client';

export function getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
        return defaultValue;
    }

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return defaultValue;
    }
}

export function setStorageItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
    }
}

export function removeStorageItem(key: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
    }
}

// Storage keys
export const STORAGE_KEYS = {
    CART_ID: 'shopify_cart_id',
    WISHLIST: 'wishlist_items',
    RECENTLY_VIEWED: 'recently_viewed',
    COMPARE: 'compare_items',
} as const;
