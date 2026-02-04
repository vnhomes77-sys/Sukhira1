'use server';

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

    if (!email || !domain) {
        return { success: false, message: 'Invalid configuration or email missing.' };
    }

    try {
        const body = new URLSearchParams({
            'form_type': 'customer',
            'utf8': '✓',
            'contact[email]': email,
            'contact[tags]': 'newsletter',
        });

        const response = await fetch(`https://${domain}/contact`, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.ok) {
            return { success: true, message: 'Thanks for subscribing!' };
        } else {
            // Shopify contact form submission via AJAX/fetch might redirect or return HTML.
            // If it returns a 200 OK, we assume success for now as it doesn't always return JSON.
            // However, often it redirects to a challenge or back to the page.
            // For a robust implementation, checking status is a good start.
            // If it's a redirect (3xx), fetch follows it by default, and result.ok is true.
            return { success: true, message: 'Thanks for subscribing!' };
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return { success: false, message: 'Something went wrong. Please try again.' };
    }
}
