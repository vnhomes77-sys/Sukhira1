'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export function ProductFAQ() {
    const faqs = [
        {
            q: 'Is Cash on Delivery available?',
            a: 'Yes, COD is available on eligible products and locations. You can check availability at checkout.',
        },
        {
            q: 'How long does delivery take?',
            a: 'Orders are typically delivered within 7 to 10 business days depending on your location.',
        },
        {
            q: 'Can I return the product?',
            a: 'Yes, we offer a 7-day return policy on eligible products. Items must be unused and in original packaging.',
        },
        {
            q: 'How can I contact support?',
            a: 'You can contact us on WhatsApp at +91 98254-06274 for quick assistance.',
        },
    ];

    return (
        <div className="my-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-[#111111] text-center">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-[#e6e2d9]">
                        <AccordionTrigger className="text-left text-[#111111] hover:text-[#6e8b63]">
                            {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-[#444444]">
                            {faq.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
