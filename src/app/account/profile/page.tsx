import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
    title: 'My Profile',
    description: 'Manage your profile information',
};

export default function ProfilePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ProfileInfo />
                </CardContent>
            </Card>
        </div>
    );
}

function ProfileInfo() {
    // This would normally fetch customer data
    // For now, showing placeholder
    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">Contact Shopify to manage your account details</p>
            </div>
            <p className="text-sm text-muted-foreground">
                Profile management is handled through your Shopify account for security.
            </p>
        </div>
    );
}
