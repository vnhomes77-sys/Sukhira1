import { Metadata } from 'next';
import Link from 'next/link';
import { Package, Heart, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export const metadata: Metadata = {
    title: 'My Account',
    description: 'Manage your account and orders',
};

const quickLinks = [
    {
        href: '/account/orders',
        icon: Package,
        title: 'Orders',
        description: 'View your order history',
    },
    {
        href: '/wishlist',
        icon: Heart,
        title: 'Wishlist',
        description: 'View your saved products',
    },
    {
        href: '/account/profile',
        icon: Settings,
        title: 'Profile',
        description: 'Update your information',
    },
];

export default function AccountPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                    <link.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">{link.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{link.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
