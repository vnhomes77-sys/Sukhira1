'use client';

import { Check } from 'lucide-react';

export function KeyBenefits() {
    const benefits = [
        "Premium Quality Materials",
        "Modern & Functional Design",
        "Easy to Use & Maintain",
        "Verified for Durability"
    ];

    return (
        <div className="bg-[#f7f5ee] rounded-[14px] p-6 border border-[#e6e2d9] my-6">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#6e8b63] mb-4">
                Key Benefits
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#111111]">
                        <div className="h-6 w-6 rounded-full bg-[#6e8b63]/10 flex items-center justify-center flex-shrink-0 text-[#6e8b63]">
                            <Check className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm font-medium">{benefit}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
