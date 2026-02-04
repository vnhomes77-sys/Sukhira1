'use client';

import { Truck, RotateCcw, ShieldCheck, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBarProps {
    className?: string; // Optional className prop
}

export function TrustBar({ className }: TrustBarProps) {
    const points = [
        { icon: ShieldCheck, label: 'Secure Payments' },
        { icon: Truck, label: 'COD Available' },
        { icon: RotateCcw, label: '7-Day Returns' },
        { icon: MessageCircle, label: 'WhatsApp Support' },
    ];

    return (
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-b border-[#e6e2d9] my-8", className)}>
            {points.map((point) => (
                <div key={point.label} className="flex flex-col items-center justify-center text-center gap-2">
                    <div className="h-10 w-10 flex items-center justify-center bg-[#f7f5ee] rounded-full text-[#6e8b63]">
                        <point.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-[#444444]">{point.label}</span>
                </div>
            ))}
        </div>
    );
}
