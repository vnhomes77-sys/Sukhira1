import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

/* Components */
import { ProductGallery } from '@/components/ProductGallery';
import { WishlistButton } from '@/components/WishlistButton';
import { CompareButton } from '@/components/CompareButton';
import { RecentlyViewedSection } from '@/components/RecentlyViewedSection';
import { AddToCartForm } from './AddToCartForm';
import { TrackRecentlyViewed } from './TrackRecentlyViewed';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/* PDP Specific Components */
import { TrustBar } from '@/components/pdp/TrustBar';
import { ProductFAQ } from '@/components/pdp/ProductFAQ';
import { ShippingReturnsCards } from '@/components/pdp/ShippingReturnsCards';
import { KeyBenefits } from '@/components/pdp/KeyBenefits';

/* Libs */
import { shopifyFetch, ShopifyProduct, extractNodes } from '@/lib/shopify';
import { GET_PRODUCT_BY_HANDLE } from '@/lib/queries';
import { generateProductMetadata, generateProductJsonLd } from '@/lib/seo';
import { formatMoney } from '@/lib/money';

interface ProductPageProps {
    params: Promise<{ handle: string }>;
}

async function getProduct(handle: string) {
    try {
        const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
            query: GET_PRODUCT_BY_HANDLE,
            variables: { handle },
            tags: ['product', handle],
            cache: 'no-store'
        });
        return data.product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: ProductPageProps): Promise<Metadata> {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return generateProductMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { handle } = await params;
    const product = await getProduct(handle);

    if (!product) {
        notFound();
    }

    const images = extractNodes(product.images.edges);
    const variants = extractNodes(product.variants.edges);
    const hasDiscount =
        product.compareAtPriceRange?.minVariantPrice &&
        parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
        parseFloat(product.priceRange.minVariantPrice.amount);

    const discountPercent = hasDiscount
        ? Math.round(
            ((parseFloat(product.compareAtPriceRange.minVariantPrice.amount) -
                parseFloat(product.priceRange.minVariantPrice.amount)) /
                parseFloat(product.compareAtPriceRange.minVariantPrice.amount)) *
            100
        )
        : 0;

    const jsonLd = generateProductJsonLd(
        product,
        `${process.env.NEXT_PUBLIC_APP_URL}/products/${handle}`
    );

    return (
        <div className="bg-[#f7f5ee] min-h-screen text-[#111111]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <TrackRecentlyViewed product={product} />

            <div className="container mx-auto px-4 py-6 md:py-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-[#666666] mb-8 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-[#111111] transition-colors flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                    <Link href="/collections/all" className="hover:text-[#111111] transition-colors">
                        Products
                    </Link>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                    <span className="font-medium text-[#111111]">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Left Column: Gallery */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[14px] p-2 border border-[#e6e2d9] shadow-sm sticky top-24">
                            <ProductGallery images={images} title={product.title} />
                        </div>

                        {/* Trust Bar below gallery on desktop */}
                        <div className="hidden lg:block">
                            <TrustBar />
                        </div>
                    </div>

                    {/* Right Column: Info */}
                    <div className="space-y-8">
                        <div>
                            {product.vendor && (
                                <p className="text-sm font-medium text-[#6e8b63] uppercase tracking-wider mb-3">
                                    {product.vendor}
                                </p>
                            )}
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight text-[#111111]">
                                {product.title}
                            </h1>

                            {/* Price Block */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="text-3xl font-bold text-[#111111]">
                                    {formatMoney(product.priceRange.minVariantPrice)}
                                </div>
                                {hasDiscount && (
                                    <>
                                        <div className="text-xl text-[#888888] line-through decoration-slate-400">
                                            {formatMoney(product.compareAtPriceRange.minVariantPrice)}
                                        </div>
                                        <Badge className="bg-[#e53e3e] hover:bg-[#c53030] text-white border-none rounded-md px-3 py-1 text-sm">
                                            Save {discountPercent}%
                                        </Badge>
                                    </>
                                )}
                            </div>

                            {!product.availableForSale && (
                                <Badge variant="secondary" className="mb-4 text-base px-4 py-1">Sold Out</Badge>
                            )}

                            {/* Short Description (if short) or just Key Benefits */}
                            <KeyBenefits />

                            <Separator className="my-8 bg-[#e6e2d9]" />

                            {/* Add to Cart Actions */}
                            <div className="bg-white p-6 rounded-[14px] border border-[#e6e2d9] shadow-sm">
                                <AddToCartForm
                                    product={product}
                                    variants={variants}
                                    options={product.options}
                                />

                                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-[#444444]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#6e8b63] animate-pulse" />
                                        In Stock & Ready to Ship
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <WishlistButton product={product} variant="icon" />
                                        <span className="text-xs">Add to Wishlist</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs: Description & Specs */}
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="w-full bg-white border border-[#e6e2d9] rounded-[14px] p-1 h-auto">
                                <TabsTrigger
                                    value="description"
                                    className="flex-1 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white rounded-[10px]"
                                >
                                    Description
                                </TabsTrigger>
                                <TabsTrigger
                                    value="specs"
                                    className="flex-1 py-3 data-[state=active]:bg-[#111111] data-[state=active]:text-white rounded-[10px]"
                                >
                                    Specifications
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="description" className="pt-6 px-2">
                                <div
                                    className="prose prose-stone max-w-none text-[#444444] prose-headings:text-[#111111] prose-a:text-[#6e8b63]"
                                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                                />
                            </TabsContent>
                            <TabsContent value="specs" className="pt-6 px-2">
                                <div className="border border-[#e6e2d9] rounded-xl overflow-hidden bg-white">
                                    <dl className="divide-y divide-[#e6e2d9]">
                                        <div className="flex justify-between p-4 bg-[#f9f9f9]">
                                            <dt className="text-sm font-medium text-[#666]">Vendor</dt>
                                            <dd className="text-sm font-semibold text-[#111]">{product.vendor}</dd>
                                        </div>
                                        {product.productType && (
                                            <div className="flex justify-between p-4 bg-white">
                                                <dt className="text-sm font-medium text-[#666]">Type</dt>
                                                <dd className="text-sm font-semibold text-[#111]">{product.productType}</dd>
                                            </div>
                                        )}
                                        {/* Mock Specs based on requirements */}
                                        <div className="flex justify-between p-4 bg-[#f9f9f9]">
                                            <dt className="text-sm font-medium text-[#666]">Return Policy</dt>
                                            <dd className="text-sm font-semibold text-[#111]">7 Days</dd>
                                        </div>
                                    </dl>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Shipping Cards */}
                        <ShippingReturnsCards />

                        {/* Trust Bar (Mobile only) */}
                        <div className="lg:hidden">
                            <TrustBar />
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <ProductFAQ />

                <Separator className="my-12 bg-[#e6e2d9]" />

                {/* Recently Viewed */}
                <RecentlyViewedSection currentProductId={product.id} />

                {/* Bottom Sticky Bar for Mobile (Optional implementation here or in Layout/Global) */}
            </div>
        </div>
    );
}

