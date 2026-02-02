import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/ProductGallery';
import { WishlistButton } from '@/components/WishlistButton';
import { CompareButton } from '@/components/CompareButton';
import { RecentlyViewedSection } from '@/components/RecentlyViewedSection';
import { AddToCartForm } from './AddToCartForm';
import { TrackRecentlyViewed } from './TrackRecentlyViewed';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <TrackRecentlyViewed product={product} />

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Gallery */}
                    <div className="group">
                        <ProductGallery images={images} title={product.title} />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title and Vendor */}
                        <div>
                            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                                {product.vendor}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {hasDiscount && (
                                    <Badge variant="destructive">Save {discountPercent}%</Badge>
                                )}
                                {!product.availableForSale && (
                                    <Badge variant="secondary">Sold Out</Badge>
                                )}
                                {product.productType && (
                                    <Badge variant="outline">{product.productType}</Badge>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold">
                                    {formatMoney(product.priceRange.minVariantPrice)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        {formatMoney(product.compareAtPriceRange.minVariantPrice)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Add to Cart Form */}
                        <AddToCartForm
                            product={product}
                            variants={variants}
                            options={product.options}
                        />

                        {/* Wishlist & Compare */}
                        <div className="flex gap-3">
                            <WishlistButton product={product} variant="full" />
                            <CompareButton product={product} variant="full" />
                        </div>

                        <Separator />

                        {/* Product Details Tabs */}
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="w-full">
                                <TabsTrigger value="description" className="flex-1">
                                    Description
                                </TabsTrigger>
                                <TabsTrigger value="details" className="flex-1">
                                    Details
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="description" className="pt-4">
                                <div
                                    className="prose prose-sm max-w-none text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                                />
                            </TabsContent>
                            <TabsContent value="details" className="pt-4">
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Vendor</dt>
                                        <dd className="font-medium">{product.vendor}</dd>
                                    </div>
                                    {product.productType && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">Type</dt>
                                            <dd className="font-medium">{product.productType}</dd>
                                        </div>
                                    )}
                                    {product.tags.length > 0 && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">Tags</dt>
                                            <dd className="font-medium">{product.tags.join(', ')}</dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Availability</dt>
                                        <dd className="font-medium">
                                            {product.availableForSale ? 'In Stock' : 'Out of Stock'}
                                        </dd>
                                    </div>
                                </dl>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Recently Viewed */}
            <RecentlyViewedSection currentProductId={product.id} />
        </>
    );
}
