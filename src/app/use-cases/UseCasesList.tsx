'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { platforms, generateSeoCombinations, Category } from '@/lib/seo-data';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Search, X, Filter } from 'lucide-react';
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
            <section className="relative pt-24 pb-16 md:pt-36 md:pb-20 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                            Explore <span className="text-primary">Use Cases</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 leading-relaxed">
                            Discover how creators, developers, and consultants use JustUnlock to monetize their work on any platform.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-lg mx-auto relative mt-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200 group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-30">
                                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search platforms (e.g. Notion, Telegram)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-12 py-3 text-base rounded-full border-2 border-border bg-background hover:border-primary/30 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm relative z-20"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground z-30 cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap justify-center gap-2 mt-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                            {quickFilters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedCategory(filter.id)}
                                    className={cn(
                                        "px-5 py-2 rounded-full text-sm font-medium transition-all border-2",
                                        selectedCategory === filter.id
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
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
            <section className="py-12 md:py-20 min-h-[500px] bg-secondary/10">
                <div className="container mx-auto px-4 space-y-24">
                    {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                            <div key={category.id} className="space-y-10 animate-in fade-in duration-500">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl md:text-3xl font-bold capitalize">{category.name}</h2>
                                    <div className="h-0.5 flex-1 bg-border/50 rounded-full" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {category.platforms.map((platform) => {
                                        const topLinks = getTopUseCases(platform.id);
                                        if (topLinks.length === 0) return null;

                                        return (
                                            <div key={platform.id} className="group flex flex-col bg-background border-2 border-border hover:border-primary rounded-3xl p-8 transition-all duration-300 h-full">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-2xl font-bold">{platform.name}</h3>
                                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <ul className="space-y-3">
                                                        {topLinks.map((link) => (
                                                            <li key={link.slug}>
                                                                <Link
                                                                    href={`/use-cases/${link.slug}`}
                                                                    className="text-sm text-muted-foreground hover:text-primary transition-colors block truncate py-1"
                                                                >
                                                                    {link.title.replace(` on ${platform.name} with Crypto`, '').replace(`Monetize ${platform.name} `, '')}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-border/50">
                                                    <Link
                                                        href={`/use-cases/sell-content-on-${platform.id}`}
                                                        className="text-sm font-semibold text-primary flex items-center gap-2 hover:gap-3 transition-all"
                                                    >
                                                        View all guides <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-32 space-y-6">
                            <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                                <Search className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">No platforms found</h3>
                                <p className="text-muted-foreground text-lg">Try searching for something else or clear your filters.</p>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                                className="mt-4 rounded-full px-8"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-background border-t border-border">
                <div className="container mx-auto px-4 text-center space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Don&apos;t see your platform?</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            JustUnlock works with ANY link or file. You don&apos;t need a specific integration to start selling.
                        </p>
                    </div>
                    <Link href="/">
                        <Button className="h-14 px-8 text-lg rounded-full gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-bold">
                            Create Link Now <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
