'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCustomer } from '@/lib/customerAuth';
import Cookies from 'js-cookie';

interface Customer {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
}

interface AuthContextType {
    customer: Customer | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    accessToken: string | null;
    login: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Check for authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Try to get access token from cookie (set by API route)
                const token = Cookies.get('customer_access_token');

                if (token) {
                    setAccessToken(token);
                    const customerData = await getCustomer(token);

                    if (customerData) {
                        setCustomer(customerData);
                    } else {
                        // Token is invalid, clear it
                        Cookies.remove('customer_access_token');
                        Cookies.remove('customer_refresh_token');
                        setAccessToken(null);
                    }
                }
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = useCallback(() => {
        // Redirect to login API route which will initiate OAuth flow
        window.location.href = '/api/auth/login';
    }, []);

    const logout = useCallback(async () => {
        try {
            // Call logout API route to clear cookies
            await fetch('/api/auth/logout', { method: 'POST' });
            setCustomer(null);
            setAccessToken(null);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                customer,
                isLoggedIn: !!customer,
                isLoading,
                accessToken,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
