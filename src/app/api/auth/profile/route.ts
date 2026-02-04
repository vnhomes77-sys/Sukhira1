import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { shopifyFetch } from '@/lib/shopify';
import { getCustomer as getCustomerOAuth } from '@/lib/customerAuth.server';

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
        const storefrontToken = cookieStore.get('customer_access_token')?.value;
        const accountToken = cookieStore.get('customer_account_token')?.value;

        if (!storefrontToken && !accountToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let customer = null;

        if (storefrontToken) {
            // Strategy 1: Native Storefront API
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
                variables: { customerAccessToken: storefrontToken },
                cache: 'no-store',
            });
            customer = data.customer;
        } else if (accountToken) {
            // Strategy 2: Customer Account API (OAuth)
            customer = await getCustomerOAuth(accountToken);
        }

        if (!customer) {
            return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ customer });
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
