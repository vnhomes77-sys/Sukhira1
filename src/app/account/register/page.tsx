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
    title: 'Create Account',
    description: 'Create a new account',
};

export default function RegisterPage() {
    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Create an Account</CardTitle>
                    <CardDescription>
                        Create an account to save your wishlist and track orders
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button asChild className="w-full h-12" size="lg">
                        <a href="/api/auth/login">
                            Create Account with Shopify
                        </a>
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        You will be redirected to Shopify to create your account securely.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-center text-sm">
                    <p className="text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/account/login" className="text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
