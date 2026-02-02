import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Log in',
    description: 'Log in to your account',
};

export default function LoginPage() {
    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>
                        Log in to your account to access your orders and wishlist
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button asChild className="w-full h-12" size="lg">
                        <a href="/api/auth/login">
                            Continue with Shopify
                        </a>
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        You will be redirected to Shopify to log in securely.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-center text-sm">
                    <p className="text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/account/register" className="text-primary hover:underline">
                            Create one
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
