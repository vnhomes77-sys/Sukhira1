'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
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
import { Loader2, ArrowLeft } from 'lucide-react';
import { recoverPassword } from '../actions';
import { toast } from 'sonner';

const initialState = {
    success: false,
    message: '',
};

export default function RecoverPage() {
    const [state, formAction, isPending] = useActionState(recoverPassword, initialState);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh] bg-[#f7f5ee]">
            <Card className="w-full max-w-md border-[#e6e2d9] shadow-sm">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-tight text-[#111111]">Reset Password</CardTitle>
                    <CardDescription className="text-[#666666]">
                        Enter your email to receive password reset instructions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!state.success ? (
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

                            <Button
                                className="w-full h-12 text-base bg-[#63b32e] hover:bg-[#549925] text-white rounded-[12px]"
                                size="lg"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                                {state.message}
                            </div>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/account/login">Back to Login</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center border-t border-[#f0f0f0] pt-6">
                    <Link href="/account/login" className="flex items-center text-sm text-muted-foreground hover:text-[#111]">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
