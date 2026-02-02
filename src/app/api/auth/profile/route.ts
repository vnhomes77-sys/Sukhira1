import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCustomer } from '@/lib/customerAuth';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('customer_access_token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const customer = await getCustomer(accessToken);

        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ customer });
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
