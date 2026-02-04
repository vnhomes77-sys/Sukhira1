'use client';

import { Truck, RotateCcw } from 'lucide-react';

export function ShippingReturnsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
            {/* Shipping Card */}
            <div className="bg-white p-6 rounded-[14px] border border-[#e6e2d9] hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-[#f7f5ee] rounded-full text-[#6e8b63]">
                        <Truck className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-2 text-[#111111]">Shipping & Delivery</h4>
                        <ul className="space-y-2 text-sm text-[#444444]">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6e8b63]" />
                                Delivery in 7 to 10 business days
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6e8b63]" />
                                Tracking shared when available
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6e8b63]" />
                                Safe & secure packaging
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Returns Card */}
            <div className="bg-white p-6 rounded-[14px] border border-[#e6e2d9] hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-[#f7f5ee] rounded-full text-[#6e8b63]">
                        <RotateCcw className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-2 text-[#111111]">Returns & Refunds</h4>
                        <ul className="space-y-2 text-sm text-[#444444]">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6e8b63]" />
                                7-day return policy (eligible items)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6e8b63]" />
                                Unused items in original packaging
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6e8b63]" />
                                Refund processed after inspection
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
