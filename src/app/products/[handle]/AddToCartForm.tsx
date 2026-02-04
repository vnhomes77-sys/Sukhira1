'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}

export function AddToCartForm({ product, variants, options }: AddToCartFormProps) {
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

    return (
        <div className="space-y-4">
            {/* Variant Options */}
            {options.map((option) => (
                <div key={option.id}>
                    <label className="text-sm font-medium mb-2 block">{option.name}</label>
                    <Select
                        value={selectedOptions[option.name]}
                        onValueChange={(value) => handleOptionChange(option.name, value)}
                    >
                        <SelectTrigger className="w-full">
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
            ))}

            {/* Quantity */}
            <div>
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center border rounded-md w-fit">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-none"
                        onClick={() => setQuantity((q) => q + 1)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

            </div>

            {/* Add to Cart Button */}
            <Button
                className="w-full h-12 text-lg"
                size="lg"
                onClick={handleAddToCart}
                disabled={!isAvailable || isLoading}
            >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isAvailable ? 'Add to Cart' : 'Sold Out'}
            </Button>
        </div>
    );
}
