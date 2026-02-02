'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/lib/money';

export function CartDrawer() {
    const {
        cart,
        cartLines,
        isOpen,
        isLoading,
        closeCart,
        updateQuantity,
        removeItem,
        checkout,
    } = useCart();

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:max-w-lg flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Shopping Cart
                    </SheetTitle>
                </SheetHeader>

                {isLoading ? (
                    <div className="flex-1 py-6 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-20 w-20 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : cartLines.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <p className="text-lg font-medium mb-2">Your cart is empty</p>
                        <p className="text-sm text-muted-foreground mb-6 text-center">
                            Looks like you haven&apos;t added anything yet.
                        </p>
                        <Button asChild onClick={closeCart}>
                            <Link href="/collections/all">Start Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="space-y-4 py-4">
                                {cartLines.map((line) => (
                                    <div key={line.id} className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            {line.merchandise.image?.url ? (
                                                <Image
                                                    src={line.merchandise.image.url}
                                                    alt={line.merchandise.product.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <ShoppingBag className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/products/${line.merchandise.product.handle}`}
                                                className="font-medium text-sm hover:underline line-clamp-2"
                                                onClick={closeCart}
                                            >
                                                {line.merchandise.product.title}
                                            </Link>
                                            {line.merchandise.title !== 'Default Title' && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {line.merchandise.title}
                                                </p>
                                            )}
                                            <p className="text-sm font-medium mt-1">
                                                {formatMoney(line.merchandise.price)}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex items-center border rounded-md">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() =>
                                                            updateQuantity(line.id, Math.max(1, line.quantity - 1))
                                                        }
                                                        disabled={line.quantity <= 1 || isLoading}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm">
                                                        {line.quantity}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none"
                                                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                                        disabled={isLoading}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() => removeItem(line.id)}
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="border-t pt-4 space-y-4">
                            <Separator />

                            {/* Subtotal */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">
                                    {cart?.cost.subtotalAmount && formatMoney(cart.cost.subtotalAmount)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Shipping and taxes calculated at checkout.
                            </p>

                            <SheetFooter className="flex-col gap-2 sm:flex-col">
                                <Button className="w-full" size="lg" onClick={checkout}>
                                    Checkout
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={closeCart}
                                    asChild
                                >
                                    <Link href="/cart">View Cart</Link>
                                </Button>
                            </SheetFooter>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
