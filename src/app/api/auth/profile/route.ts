import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { shopifyFetch } from '@/lib/shopify';

const GET_CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('customer_access_token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await shopifyFetch<{
            customer: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
                phone: string;
            } | null;
        }>({
            query: GET_CUSTOMER_QUERY,
            variables: { customerAccessToken: accessToken },
            cache: 'no-store',
        });

        const customer = data.customer;

        if (!customer) {
            // Token might be invalid if customer is null
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ customer });
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
