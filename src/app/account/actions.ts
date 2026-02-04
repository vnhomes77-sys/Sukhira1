'use server';

import { shopifyFetch } from '@/lib/shopify';
import { CUSTOMER_ACCESS_TOKEN_CREATE, CUSTOMER_CREATE, CUSTOMER_RECOVER } from '@/lib/queries';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Please enter both email and password.' };
    }

    try {
        const data = await shopifyFetch<{
            customerAccessTokenCreate: {
                customerAccessToken: {
                    accessToken: string;
                    expiresAt: string;
                } | null;
                userErrors: { field: string; message: string }[];
            };
        }>({
            query: CUSTOMER_ACCESS_TOKEN_CREATE,
            variables: {
                input: { email, password },
            },
            cache: 'no-store',
        });

        const { customerAccessToken, userErrors } = data.customerAccessTokenCreate;

        if (userErrors.length > 0) {
            return { success: false, message: userErrors[0].message };
        }

        if (customerAccessToken) {
            // Set cookie securely
            const cookieStore = await cookies();
            cookieStore.set('customer_access_token', customerAccessToken.accessToken, {
                httpOnly: false, // Allow client-side read for AuthContext
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                expires: new Date(customerAccessToken.expiresAt),
                path: '/',
            });

            // Also set a refresh token if available (implementation dependent, usually not in this basic flow)

            return { success: true };
        }

        return { success: false, message: 'Invalid credentials.' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function register(prevState: any, formData: FormData) {
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const acceptsMarketing = formData.get('acceptsMarketing') === 'on';

    if (!email || !password || !firstName || !lastName) {
        return { success: false, message: 'Please fill in all fields.' };
    }

    try {
        const data = await shopifyFetch<{
            customerCreate: {
                customer: { id: string } | null;
                userErrors: { field: string; message: string }[];
            };
        }>({
            query: CUSTOMER_CREATE,
            variables: {
                input: {
                    firstName,
                    lastName,
                    email,
                    password,
                    acceptsMarketing
                },
            },
            cache: 'no-store',
        });

        const { userErrors } = data.customerCreate;

        if (userErrors.length > 0) {
            return { success: false, message: userErrors[0].message };
        }

        return { success: true, message: 'Account created! Please log in.' };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}

export async function recoverPassword(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) {
        return { success: false, message: 'Please enter your email.' };
    }

    try {
        const data = await shopifyFetch<{
            customerRecover: {
                userErrors: { field: string; message: string }[];
            };
        }>({
            query: CUSTOMER_RECOVER,
            variables: { email },
            cache: 'no-store',
        });

        const { userErrors } = data.customerRecover;

        if (userErrors.length > 0) {
            return { success: false, message: userErrors[0].message };
        }

        return { success: true, message: 'If that email is associated with an account, we sent instructions to reset your password.' };
    } catch (error) {
        console.error('Recover error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
    }
}
