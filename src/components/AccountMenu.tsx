'use client';

import Link from 'next/link';
import { User, Package, Settings, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

export function AccountMenu() {
    const { customer, isLoggedIn, logout, login } = useAuth();

    if (!isLoggedIn) {
        return (
            <div className="flex gap-2">
                <Button variant="outline" onClick={login}>
                    Log in
                </Button>
                <Button asChild>
                    <Link href="/account/register">Sign up</Link>
                </Button>
            </div>
        );
    }

    const initials = customer?.firstName && customer?.lastName
        ? `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`
        : customer?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                        {customer?.firstName && (
                            <p className="text-sm font-medium">
                                {customer.firstName} {customer.lastName}
                            </p>
                        )}
                        {customer?.email && (
                            <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                                {customer.email}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/account/profile" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => logout()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
