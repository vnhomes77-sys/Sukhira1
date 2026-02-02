import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAuthorizationUrl } from '@/lib/customerAuth.server';

export async function GET() {
    try {
        const { url, state, codeVerifier } = await getAuthorizationUrl();

        // Store state and code verifier in cookies for verification
        const cookieStore = await cookies();

        cookieStore.set('oauth_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 10, // 10 minutes
            path: '/',
        });

        cookieStore.set('oauth_code_verifier', codeVerifier, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 10, // 10 minutes
            path: '/',
        });

        return NextResponse.redirect(url);
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.redirect(new URL('/account/login?error=auth_failed', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    }
}
