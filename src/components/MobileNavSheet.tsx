'use client';

import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';

interface MobileNavSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    navLinks: { href: string; label: string }[];
}

export function MobileNavSheet({ open, onOpenChange, navLinks }: MobileNavSheetProps) {
    const { isLoggedIn, customer, logout } = useAuth();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                    <SheetTitle className="text-left">
                        <div className="h-10 w-10 bg-[#56AF31] rounded-full flex items-center justify-center text-white shadow-md">
                            <span className="font-bold text-xl">S</span>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col mt-6 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => onOpenChange(false)}
                            className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <Separator className="my-4" />

                <div className="flex flex-col space-y-1">
                    <Link
                        href="/wishlist"
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                    >
                        Wishlist
                    </Link>
                    <Link
                        href="/compare"
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                    >
                        Compare Products
                    </Link>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col space-y-2 px-4">
                    {isLoggedIn ? (
                        <>
                            <p className="text-sm text-muted-foreground">
                                {customer?.firstName
                                    ? `Welcome, ${customer.firstName}`
                                    : 'My Account'}
                            </p>
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/account" onClick={() => onOpenChange(false)}>
                                    Account Dashboard
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => {
                                    logout();
                                    onOpenChange(false);
                                }}
                            >
                                Log out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild className="w-full">
                                <Link href="/account/login" onClick={() => onOpenChange(false)}>
                                    Log in
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/account/register" onClick={() => onOpenChange(false)}>
                                    Create Account
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
