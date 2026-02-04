'use client';

import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { login } from '../actions';
import { toast } from 'sonner';

// Define initial state type explicitly
const initialState = {
    success: false,
    message: '',
};

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, initialState);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast.success("Welcome back! Redirecting...");
            // Force a hard refresh/navigation to ensure AuthContext picks up the new cookie
            window.location.href = '/account';
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh] bg-[#f7f5ee]">
            <Card className="w-full max-w-md border-[#e6e2d9] shadow-sm">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight text-[#111111]">Welcome Back</CardTitle>
                    <CardDescription className="text-[#666666]">
                        Sign in to access your orders, wishlist, and profile
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <GoogleSignInButton text="Sign in with Google" />
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[#e6e2d9]" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">Or</span>
                            </div>
                        </div>
                    </div>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="h-12 border-[#e6e2d9] focus:ring-[#6e8b63] bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    required
                                    className="h-12 border-[#e6e2d9] focus:ring-[#6e8b63] bg-white pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-base bg-[#63b32e] hover:bg-[#549925] text-white rounded-[12px]"
                            size="lg"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center text-sm border-t border-[#f0f0f0] pt-6">
                    <p className="text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/account/register" className="text-[#6e8b63] font-medium hover:underline">
                            Create one
                        </Link>
                    </p>
                    <Link href="/account/recover" className="text-xs text-muted-foreground hover:text-[#111] cursor-pointer">
                        Forgot your password?
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
