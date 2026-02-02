import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Clear all auth cookies
    cookieStore.delete('customer_access_token');
    cookieStore.delete('customer_refresh_token');

    return NextResponse.json({ success: true });
}

export async function GET() {
    const cookieStore = await cookies();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Clear all auth cookies
    const response = NextResponse.redirect(new URL('/', baseUrl));
    response.cookies.delete('customer_access_token');
    response.cookies.delete('customer_refresh_token');

    return response;
}
