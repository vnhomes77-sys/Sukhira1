'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
    shop: [
        { href: '/collections/home-kitchen', label: 'Home & Kitchen' },
        { href: '/collections/electronics', label: 'Electronics' },
        { href: '/collections/new-arrivals', label: 'New Arrivals' },
    ],
    support: [
        { href: '/pages/contact-us', label: 'Contact Us' },
        { href: '/pages/faq', label: 'FAQ' },
        { href: '/pages/shipping-policy', label: 'Shipping Policy' },
        { href: '/pages/return-policy', label: 'Return Policy' },
    ],
    policies: [
        { href: '/pages/privacy-policy', label: 'Privacy Policy' },
        { href: '/pages/terms-and-conditions', label: 'Terms and Conditions' },
    ],
};

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Sukhira
                            </span>
                        </Link>
                        <p className="text-muted-foreground mb-4 max-w-sm">
                            Your destination for premium home & kitchen products and electronics.
                            Quality guaranteed.
                        </p>

                        {/* Newsletter */}
                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Subscribe to our newsletter</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                Get the latest updates on new products and upcoming sales.
                            </p>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.currentTarget;
                                    const formData = new FormData(form);

                                    // Basic client-side feedback
                                    const button = form.querySelector('button');
                                    if (button) button.disabled = true;

                                    try {
                                        const { subscribeToNewsletter } = await import('@/app/actions');
                                        const { toast } = await import('sonner');

                                        const result = await subscribeToNewsletter(null, formData);

                                        if (result.success) {
                                            toast.success(result.message, {
                                                description: "You've been added to our mailing list."
                                            });
                                            form.reset();
                                        } else {
                                            toast.error(result.message);
                                        }
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        if (button) button.disabled = false;
                                    }
                                }}
                                className="flex gap-2 max-w-sm"
                            >
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="flex-1"
                                    required
                                />
                                <Button type="submit" size="icon">
                                    <Mail className="h-4 w-4" />
                                    <span className="sr-only">Subscribe</span>
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2">
                            {footerLinks.shop.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policy Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Policies</h4>
                        <ul className="space-y-2">
                            {footerLinks.policies.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Sukhira. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span>Powered by Shopify</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
