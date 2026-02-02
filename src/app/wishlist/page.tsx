import { Metadata } from 'next';
import { WishlistGrid } from '@/components/WishlistGrid';

export const metadata: Metadata = {
    title: 'Wishlist',
    description: 'View your saved products',
};

export default function WishlistPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
            <WishlistGrid />
        </div>
    );
}
