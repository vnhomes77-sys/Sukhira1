'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WishlistButton } from '@/components/WishlistButton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/context/CartContext';
import { ShopifyProductVariant } from '@/lib/shopify';

interface AddToCartFormProps {
    product: {
        id: string;
        availableForSale: boolean;
    };
    variants: ShopifyProductVariant[];
    options: {
        id: string;
        name: string;
        values: string[];
    }[];
    title: string;
    handle: string;
    featuredImage: { url: string } | null;
}

export function AddToCartForm({ product, variants, options, title, handle, featuredImage }: AddToCartFormProps) {
    const { addToCart, isLoading } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        // Initialize with first option values
        const initial: Record<string, string> = {};
        options.forEach((option) => {
            initial[option.name] = option.values[0];
        });
        return initial;
    });

    // Find matching variant based on selected options
    const selectedVariant = variants.find((variant) =>
        variant.selectedOptions.every(
            (option) => selectedOptions[option.name] === option.value
        )
    );

    const isAvailable = selectedVariant?.availableForSale && product.availableForSale;

    const handleOptionChange = (optionName: string, value: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [optionName]: value,
        }));
    };

    const handleAddToCart = () => {
        if (selectedVariant && isAvailable) {
            addToCart(selectedVariant.id, quantity);
        }
    };

    // Prepare product object for WishlistButton
    const productInfo = {
        id: product.id,
        handle: handle,
        title: title,
        featuredImage: featuredImage,
        priceRange: { minVariantPrice: variants[0]?.price ? { amount: variants[0].price.amount } : { amount: '0' } },
        variants: { edges: variants.map(v => ({ node: { id: v.id } })) }
    };

    // WAIT: AddToCartForm props are incomplete for WishlistButton!
    // Props: product: { id, availableForSale }, variants: ShopifyProductVariant[], options: {...}[]
    // I am missing: title, handle, featuredImage (maybe in variants?), priceRange (in variants?)
    // This component relies on parent to pass just enough for logic.
    // I need to update AddToCartFormProps to include more data or pass it down.

    // I will skip this edit for now and fix props first.

    return (
        <div className="space-y-4">
            {/* Variant Options */}
            {options.map((option) => {
                // Hide "Title" or "Default Title" option if it's the only one
                if (option.name === 'Title' && options.length === 1) return null;

                return (
                    <div key={option.id}>
                        <label className="text-sm font-medium mb-2 block">{option.name}</label>
                        <Select
                            value={selectedOptions[option.name]}
                            onValueChange={(value) => handleOptionChange(option.name, value)}
                        >
                            <SelectTrigger className="w-full h-11 border-[#e6e2d9] focus:ring-[#6e8b63]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {option.values.map((value) => (
                                    <SelectItem key={value} value={value}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );
            })}

            {/* Quantity */}
            <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center border border-[#e6e2d9] rounded-xl w-fit overflow-hidden bg-white">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-none hover:bg-gray-50"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 rounded-none hover:bg-gray-50"
                        onClick={() => setQuantity((q) => q + 1)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-3 pt-2">
                <Button
                    className="flex-1 h-[52px] text-base font-semibold bg-[#63b32e] hover:bg-[#549925] text-white rounded-[12px] shadow-sm transition-all active:scale-[0.98]"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={!isAvailable || isLoading}
                >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isAvailable ? 'Add to Cart' : 'Sold Out'}
                </Button>

                <div className="flex-shrink-0">
                    <WishlistButton
                        product={{
                            id: product.id,
                            handle: handle,
                            title: title,
                            priceRange: { minVariantPrice: { amount: variants[0]?.price?.amount || '0', currencyCode: variants[0]?.price?.currencyCode || 'INR' } },
                            featuredImage: featuredImage
                        }}
                        variant="icon"
                        className="h-[52px] w-[52px] rounded-[12px] border border-[#e6e2d9] bg-white hover:bg-[#f7f5ee] text-[#111111] hover:text-[#6e8b63] transition-colors flex items-center justify-center shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
}
