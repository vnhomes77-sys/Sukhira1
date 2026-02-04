export const storeContent = {
    store_name: "Sukhira",
    business_details: {
        whatsapp: "+91 98254-06274",
        return_window_days: 7,
        shipping_timeline_days: "7 to 10",
        cash_on_delivery: true
    },
    pages: [
        {
            title: "About Us",
            handle: "about-us",
            content: "Welcome to Sukhira, your trusted online store for useful Home, Kitchen, and Electronics products designed to make everyday life easier, smarter, and more convenient.\n\nAt Sukhira, we focus on bringing products that are practical, affordable, and carefully selected for quality and performance. Our goal is simple: help customers shop smart and live better with trending and essential products for home and lifestyle.\n\nWhy Choose Sukhira?\n- Wide range of products: Home, Kitchen & Electronics\n- Cash on Delivery available\n- Customer support via WhatsApp\n- Easy 7-day return policy (eligible products)\n\nSupport: WhatsApp +91 98254-06274"
        },
        {
            title: "Shipping Policy",
            handle: "shipping-policy",
            content: "At Sukhira, we aim to deliver your products safely and on time.\n\nShipping Timeline:\n- Orders are delivered within 7 to 10 business days\n- Delivery timeline may vary depending on location, courier availability, and unforeseen conditions\n\nOrder Processing:\n- Orders are usually processed within 24–48 hours\n- After dispatch, tracking details (if available) will be shared\n\nCash on Delivery (COD):\nWe offer Cash on Delivery on eligible products and locations.\n\nIf your order is delayed beyond the expected time, please contact us on WhatsApp: +91 98254-06274"
        },
        {
            title: "Return Policy",
            handle: "return-policy",
            content: "We want you to have a great shopping experience at Sukhira. If you are not satisfied with your order, we offer a return option under the following policy.\n\nReturn Window:\n- Returns are accepted within 7 days from the date of delivery\n\nEligibility:\n- Product must be unused and in original packaging\n- All tags/accessories/parts must be included\n\nDamaged/Wrong Product:\n- Contact us within 48 hours and share photos/videos\n\nReturn Process:\n1. Contact us on WhatsApp: +91 98254-06274\n2. Mention Order ID and issue\n3. After verification, return instructions will be shared\n\nRefund Timeline:\n- Refund will be processed within 5–7 business days after inspection"
        },
        {
            title: "Privacy Policy",
            handle: "privacy-policy",
            content: "At Sukhira, we respect your privacy and are committed to protecting your personal information.\n\nInformation We Collect:\n- Name, phone/WhatsApp number, email, shipping address, order details\n\nHow We Use Your Data:\n- To process orders, deliver products, provide support, and improve services\n\nData Protection:\n- We take reasonable measures to protect your data. We do not sell personal data.\n\nThird-Party Services:\n- Payment gateways, courier partners, and Shopify tools may process required information.\n\nContact:\nWhatsApp: +91 98254-06274"
        },
        {
            title: "Terms and Conditions",
            handle: "terms-and-conditions",
            content: "By using Sukhira’s website, you agree to these terms.\n\nGeneral:\n- Sukhira may update products, prices, policies, and content anytime\n- Product images are for reference; slight variations may occur\n\nOrders:\n- Orders may be canceled due to stock unavailability, incorrect pricing, or suspicious activity\n\nPayments:\n- Online payments accepted\n- Cash on Delivery available for eligible products/locations\n\nShipping:\n- Delivery timeline is typically 7 to 10 business days\n\nReturns:\n- Returns are accepted within 7 days as per Return Policy\n\nSupport:\nWhatsApp: +91 98254-06274"
        },
        {
            title: "FAQ",
            "handle": "faq",
            "content": "Frequently Asked Questions\n\n1. What products do you sell?\nWe sell Home & Kitchen and Electronics products.\n\n2. Do you offer COD?\nYes, Cash on Delivery is available on eligible products and locations.\n\n3. What is your delivery timeline?\n7 to 10 business days.\n\n4. Can I return a product?\nYes, eligible products can be returned within 7 days.\n\n5. How do I request a return?\nWhatsApp us with your Order ID: +91 98254-06274\n\n6. When will I get my refund?\nWithin 5–7 business days after product inspection."
        },
        {
            title: "Contact Us",
            "handle": "contact-us",
            "content": "We’re here to help you.\n\nCustomer Support (WhatsApp):\n+91 98254-06274\n\nSupport Timings:\nMon–Sat: 10:00 AM – 7:00 PM\n\nFor faster support, share:\n- Order ID\n- Product name\n- Issue details (with photo/video if needed)\n\nWe usually respond within 24 hours.\n\nThank you for shopping with Sukhira."
        }
    ]
};

export function getPageContent(handle: string) {
    return storeContent.pages.find((page) => page.handle === handle);
}
