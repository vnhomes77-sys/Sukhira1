import { ShopifyProduct } from './shopify';
import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const siteName = 'ShopStore';

export function generateProductJsonLd(product: ShopifyProduct, url: string) {
    const variant = product.variants.edges[0]?.node;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.featuredImage?.url,
        url: url,
        brand: {
            '@type': 'Brand',
            name: product.vendor,
        },
        offers: {
            '@type': 'Offer',
            url: url,
            priceCurrency: product.priceRange.minVariantPrice.currencyCode,
            price: product.priceRange.minVariantPrice.amount,
            availability: product.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: siteName,
            },
        },
        sku: variant?.id,
    };
}

export function generateSiteMetadata(): Metadata {
    return {
        metadataBase: new URL(siteUrl),
        title: {
            default: `${siteName} - Premium Home & Kitchen Electronics`,
            template: `%s | ${siteName}`,
        },
        description: 'Discover premium home and kitchen products, electronics, and more. Shop the latest collections with free shipping.',
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: siteUrl,
            siteName: siteName,
            title: siteName,
            description: 'Your destination for premium home & kitchen products and electronics.',
        },
        twitter: {
            card: 'summary_large_image',
            title: siteName,
            description: 'Your destination for premium home & kitchen products and electronics.',
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export function generateProductMetadata(product: ShopifyProduct): Metadata {
    const url = `${siteUrl}/products/${product.handle}`;

    return {
        title: product.title,
        description: product.description.slice(0, 155),
        openGraph: {
            title: product.title,
            description: product.description.slice(0, 155),
            url: url,
            siteName: siteName,
            images: product.featuredImage
                ? [
                    {
                        url: product.featuredImage.url,
                        width: product.featuredImage.width,
                        height: product.featuredImage.height,
                        alt: product.featuredImage.altText || product.title,
                    },
                ]
                : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description.slice(0, 155),
            images: product.featuredImage ? [product.featuredImage.url] : [],
        },
    };
}

export function generateCollectionMetadata(title: string, description: string): Metadata {
    return {
        title: title,
        description: description.slice(0, 155) || `Shop ${title} collection`,
        openGraph: {
            title: title,
            description: description.slice(0, 155) || `Shop ${title} collection`,
            type: 'website',
        },
    };
}
