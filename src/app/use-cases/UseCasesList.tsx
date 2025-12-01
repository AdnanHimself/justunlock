'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { platforms, generateSeoCombinations, Category } from '@/lib/seo-data';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UseCasesList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

    const combinations = useMemo(() => generateSeoCombinations(), []);

    // Group platforms by category
    const allCategories: { id: Category; name: string; platforms: typeof platforms }[] = [
        { id: 'messaging', name: 'Messaging Apps', platforms: platforms.filter(p => p.categories.includes('messaging')) },
        { id: 'productivity', name: 'Productivity Tools', platforms: platforms.filter(p => p.categories.includes('productivity')) },
        { id: 'cloud', name: 'Cloud Storage', platforms: platforms.filter(p => p.categories.includes('cloud')) },
        { id: 'video', name: 'Video Platforms', platforms: platforms.filter(p => p.categories.includes('video')) },
        { id: 'code', name: 'Code Repositories', platforms: platforms.filter(p => p.categories.includes('code')) },
        { id: 'design', name: 'Design Tools', platforms: platforms.filter(p => p.categories.includes('design')) },
        { id: 'meeting', name: 'Meeting Apps', platforms: platforms.filter(p => p.categories.includes('meeting')) },
        { id: 'music', name: 'Music Platforms', platforms: platforms.filter(p => p.categories.includes('music')) },
        { id: 'education', name: 'Course Platforms', platforms: platforms.filter(p => p.categories.includes('education')) },
    ];

    // Helper to get top 3 use cases for a platform
    const getTopUseCases = (platformId: string) => {
        return combinations
            .filter(c => c.platform.id === platformId)
            .slice(0, 3);
    };

    // Filter Logic
    const filteredCategories = useMemo(() => {
        return allCategories.map(cat => {
            // 1. Filter by Category Selection
            if (selectedCategory !== 'all' && cat.id !== selectedCategory) {
                return null;
            }

            // 2. Filter by Search Term
            const term = searchTerm.toLowerCase();
            const filteredPlatforms = cat.platforms.filter(p =>
                p.name.toLowerCase().includes(term) ||
                cat.name.toLowerCase().includes(term)
            );

            if (filteredPlatforms.length === 0) return null;

            return {
                ...cat,
                platforms: filteredPlatforms
            };
        }).filter(Boolean) as typeof allCategories;
    }, [searchTerm, selectedCategory, allCategories]);

    const quickFilters: { id: Category | 'all'; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'messaging', label: 'Messaging' },
        { id: 'design', label: 'Design' },
        { id: 'code', label: 'Code' },
        { id: 'video', label: 'Video' },
        { id: 'productivity', label: 'Productivity' },
    ];

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative pt-20 pb-12 md:pt-32 md:pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                            Explore <span className="text-primary">Use Cases</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Discover how creators, developers, and consultants use JustUnlock to monetize their work on any platform.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto relative mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-30">
                                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Find your platform (e.g. Notion, Telegram)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-4 text-lg rounded-full border border-border bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-lg hover:shadow-xl relative z-20"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground z-30 cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap justify-center gap-2 mt-6 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                            {quickFilters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedCategory(filter.id)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                                        selectedCategory === filter.id
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground"
                                    )}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-12 md:py-20 min-h-[500px]">
                <div className="container mx-auto px-4 space-y-20">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                            <div key={category.id} className="space-y-8 animate-in fade-in duration-500">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl md:text-3xl font-bold capitalize">{category.name}</h2>
                                    <div className="h-px flex-1 bg-border/50" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.platforms.map((platform) => {
                                        const topLinks = getTopUseCases(platform.id);
                                        if (topLinks.length === 0) return null;

                                        return (
                                            <div key={platform.id} className="group bg-secondary/20 hover:bg-secondary/40 border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-xl font-bold">{platform.name}</h3>
                                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                                                </div>
                                                <ul className="space-y-2">
                                                    {topLinks.map((link) => (
                                                        <li key={link.slug}>
                                                            <Link
                                                                href={`/use-cases/${link.slug}`}
                                                                className="text-sm text-muted-foreground hover:text-primary transition-colors block truncate"
                                                            >
                                                                {link.title.replace(` on ${platform.name} with Crypto`, '').replace(`Monetize ${platform.name} `, '')}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="mt-4 pt-4 border-t border-border/30">
                                                    <Link
                                                        href={`/use-cases/sell-content-on-${platform.id}`}
                                                        className="text-xs font-medium text-primary flex items-center gap-1 hover:underline"
                                                    >
                                                        View all {platform.name} guides
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 space-y-4">
                            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold">No platforms found</h3>
                            <p className="text-muted-foreground">Try searching for something else or clear your filters.</p>
                            <Button
                                variant="secondary"
                                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                                className="mt-4"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-secondary/20">
                <div className="container mx-auto px-4 text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold">Don&apos;t see your platform?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        JustUnlock works with ANY link or file. You don&apos;t need a specific integration.
                    </p>
                    <Link href="/">
                        <Button className="h-16 px-10 text-xl rounded-full gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                            Create Link Now <ArrowRight className="w-6 h-6" />
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
