import { Metadata } from 'next';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'My Orders',
    description: 'View your order history',
};

export default function OrdersPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            <OrdersList />
        </div>
    );
}

function OrdersList() {
    // This would normally fetch orders from the API
    // For now showing empty state
    return (
        <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium mb-2">No orders yet</p>
            <p className="text-muted-foreground mb-6">
                When you place an order, it will appear here.
            </p>
            <Button asChild>
                <Link href="/collections/all">Start Shopping</Link>
            </Button>
        </div>
    );
}
