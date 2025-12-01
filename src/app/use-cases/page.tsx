import { Metadata } from 'next';
import UseCasesList from './UseCasesList';

export const metadata: Metadata = {
    title: 'Use Cases - JustUnlock',
    description: 'Explore hundreds of ways to monetize your content with JustUnlock. Sell files, links, and access on any platform with crypto.',
};

export default function UseCasesHub() {
    return <UseCasesList />;
}
