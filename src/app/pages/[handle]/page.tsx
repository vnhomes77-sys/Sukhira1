import { getPageContent, storeContent } from '@/lib/storeContent';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Generate static params properly ensuring params is treated as a Promise type if necessary 
// as per Next.js 15+ patterns, though here it returns an array of objects.
export async function generateStaticParams() {
    return storeContent.pages.map((page) => ({
        handle: page.handle,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
    const { handle } = await params;
    const page = getPageContent(handle);

    if (!page) {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: `${page.title} | ${storeContent.store_name}`,
        description: page.content.substring(0, 160).replace(/\n/g, ' '),
    };
}

export default async function StaticPage({ params }: { params: Promise<{ handle: string }> }) {
    const { handle } = await params;
    const page = getPageContent(handle);

    if (!page) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
                {page.content}
            </div>
        </div>
    );
}
