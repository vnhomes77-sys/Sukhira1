import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeToken } from '@/lib/customerAuth.server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const cookieStore = await cookies();

    // Handle OAuth errors
    if (error) {
        console.error('OAuth error:', error);
        return NextResponse.redirect(new URL('/account/login?error=oauth_error', baseUrl));
    }

    // Validate code and state
    if (!code || !state) {
        return NextResponse.redirect(new URL('/account/login?error=invalid_request', baseUrl));
    }

    // Verify state
    const storedState = cookieStore.get('oauth_state')?.value;
    if (state !== storedState) {
        return NextResponse.redirect(new URL('/account/login?error=state_mismatch', baseUrl));
    }

    // Get code verifier
    const codeVerifier = cookieStore.get('oauth_code_verifier')?.value;
    if (!codeVerifier) {
        return NextResponse.redirect(new URL('/account/login?error=missing_verifier', baseUrl));
    }

    try {
        // Exchange code for tokens
        const { accessToken, refreshToken, expiresIn } = await exchangeToken(
            code,
            codeVerifier
        );

        // Create response with redirect
        const response = NextResponse.redirect(new URL('/account', baseUrl));

        // Set access token cookie
        response.cookies.set('customer_access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: expiresIn,
            path: '/',
        });

        // Set refresh token cookie
        response.cookies.set('customer_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        // Clear OAuth cookies
        response.cookies.delete('oauth_state');
        response.cookies.delete('oauth_code_verifier');

        return response;
    } catch (error) {
        console.error('Token exchange error:', error);
        return NextResponse.redirect(new URL('/account/login?error=token_exchange_failed', baseUrl));
    }
}
