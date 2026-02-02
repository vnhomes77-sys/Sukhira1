import { Metadata } from 'next';
import { CompareTable } from '@/components/CompareTable';

export const metadata: Metadata = {
    title: 'Compare Products',
    description: 'Compare product features side by side',
};

export default function ComparePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Compare Products</h1>
            <CompareTable />
        </div>
    );
}
