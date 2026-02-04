'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ShopifyCart, ShopifyCartLine, shopifyFetch, extractNodes } from '@/lib/shopify';
import {
    CREATE_CART,
    GET_CART,
    ADD_TO_CART,
    UPDATE_CART_LINES,
    REMOVE_FROM_CART,
} from '@/lib/queries';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '@/lib/storage';

interface CartState {
    cart: ShopifyCart | null;
    isLoading: boolean;
    isOpen: boolean;
    error: string | null;
}

type CartAction =
    | { type: 'SET_CART'; payload: ShopifyCart | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_OPEN'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'SET_CART':
            return { ...state, cart: action.payload, isLoading: false };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_OPEN':
            return { ...state, isOpen: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

interface CartContextType {
    cart: ShopifyCart | null;
    cartLines: ShopifyCartLine[];
    totalQuantity: number;
    isLoading: boolean;
    isOpen: boolean;
    error: string | null;
    openCart: () => void;
    closeCart: () => void;
    addToCart: (variantId: string, quantity?: number) => Promise<void>;
    updateQuantity: (lineId: string, quantity: number) => Promise<void>;
    removeItem: (lineId: string) => Promise<void>;
    checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, {
        cart: null,
        isLoading: true,
        isOpen: false,
        error: null,
    });

    // Initialize cart from localStorage
    useEffect(() => {
        const initCart = async () => {
            const cartId = getStorageItem<string | null>(STORAGE_KEYS.CART_ID, null);

            if (cartId) {
                try {
                    const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
                        query: GET_CART,
                        variables: { cartId },
                        cache: 'no-store',
                    });

                    if (data.cart) {
                        dispatch({ type: 'SET_CART', payload: data.cart });
                    } else {
                        // Cart no longer exists, clear the stored ID
                        removeStorageItem(STORAGE_KEYS.CART_ID);
                        dispatch({ type: 'SET_CART', payload: null });
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                    removeStorageItem(STORAGE_KEYS.CART_ID);
                    dispatch({ type: 'SET_CART', payload: null });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        initCart();
    }, []);

    const openCart = useCallback(() => {
        dispatch({ type: 'SET_OPEN', payload: true });
    }, []);

    const closeCart = useCallback(() => {
        dispatch({ type: 'SET_OPEN', payload: false });
    }, []);

    const createCart = async (variantId: string, quantity: number): Promise<ShopifyCart> => {
        const data = await shopifyFetch<{
            cartCreate: { cart: ShopifyCart; userErrors: { message: string }[] };
        }>({
            query: CREATE_CART,
            variables: {
                input: {
                    lines: [{ merchandiseId: variantId, quantity }],
                },
            },
            cache: 'no-store',
        });

        if (data.cartCreate.userErrors.length > 0) {
            throw new Error(data.cartCreate.userErrors[0].message);
        }

        setStorageItem(STORAGE_KEYS.CART_ID, data.cartCreate.cart.id);
        return data.cartCreate.cart;
    };

    const addToCart = useCallback(
        async (variantId: string, quantity: number = 1) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_ERROR', payload: null });

            try {
                let newCart: ShopifyCart;

                if (!state.cart) {
                    newCart = await createCart(variantId, quantity);
                } else {
                    const data = await shopifyFetch<{
                        cartLinesAdd: { cart: ShopifyCart; userErrors: { message: string }[] };
                    }>({
                        query: ADD_TO_CART,
                        variables: {
                            cartId: state.cart.id,
                            lines: [{ merchandiseId: variantId, quantity }],
                        },
                        cache: 'no-store',
                    });

                    if (data.cartLinesAdd.userErrors.length > 0) {
                        throw new Error(data.cartLinesAdd.userErrors[0].message);
                    }

                    newCart = data.cartLinesAdd.cart;
                }

                dispatch({ type: 'SET_CART', payload: newCart });
                dispatch({ type: 'SET_OPEN', payload: true }); // Auto-open cart on add
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to add to cart';
                dispatch({ type: 'SET_ERROR', payload: message });
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.cart]
    );

    const updateQuantity = useCallback(
        async (lineId: string, quantity: number) => {
            if (!state.cart) return;

            dispatch({ type: 'SET_LOADING', payload: true });

            try {
                const data = await shopifyFetch<{
                    cartLinesUpdate: { cart: ShopifyCart; userErrors: { message: string }[] };
                }>({
                    query: UPDATE_CART_LINES,
                    variables: {
                        cartId: state.cart.id,
                        lines: [{ id: lineId, quantity }],
                    },
                    cache: 'no-store',
                });

                if (data.cartLinesUpdate.userErrors.length > 0) {
                    throw new Error(data.cartLinesUpdate.userErrors[0].message);
                }

                dispatch({ type: 'SET_CART', payload: data.cartLinesUpdate.cart });
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to update quantity';
                dispatch({ type: 'SET_ERROR', payload: message });
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.cart]
    );

    const removeItem = useCallback(
        async (lineId: string) => {
            if (!state.cart) return;

            dispatch({ type: 'SET_LOADING', payload: true });

            try {
                const data = await shopifyFetch<{
                    cartLinesRemove: { cart: ShopifyCart; userErrors: { message: string }[] };
                }>({
                    query: REMOVE_FROM_CART,
                    variables: {
                        cartId: state.cart.id,
                        lineIds: [lineId],
                    },
                    cache: 'no-store',
                });

                if (data.cartLinesRemove.userErrors.length > 0) {
                    throw new Error(data.cartLinesRemove.userErrors[0].message);
                }

                dispatch({ type: 'SET_CART', payload: data.cartLinesRemove.cart });
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to remove item';
                dispatch({ type: 'SET_ERROR', payload: message });
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [state.cart]
    );

    const checkout = useCallback(() => {
        console.log('Attempting checkout. Cart:', state.cart);
        if (state.cart?.checkoutUrl) {
            console.log('Redirecting to:', state.cart.checkoutUrl);
            window.location.href = state.cart.checkoutUrl;
        } else {
            console.error('Checkout URL is missing from cart object');
            toast.error("Unable to proceed to checkout. Please try refreshing the page.");
        }
    }, [state.cart]);

    const cartLines = state.cart ? extractNodes(state.cart.lines.edges) : [];

    return (
        <CartContext.Provider
            value={{
                cart: state.cart,
                cartLines,
                totalQuantity: state.cart?.totalQuantity ?? 0,
                isLoading: state.isLoading,
                isOpen: state.isOpen,
                error: state.error,
                openCart,
                closeCart,
                addToCart,
                updateQuantity,
                removeItem,
                checkout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
