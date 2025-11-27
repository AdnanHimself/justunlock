'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { Loader2, Copy, ExternalLink, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { formatDistanceToNow } from 'date-fns';

export default function MyLinksPage() {
    const { address, isConnected } = useAccount();
    const { showToast } = useToast();
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isConnected && address) {
            fetchLinks();
        } else {
            setLoading(false);
        }
    }, [isConnected, address]);

    const fetchLinks = async () => {
        try {
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .eq('receiver_address', address)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLinks(data || []);
        } catch (err: any) {
            console.error('Error fetching links:', err);
            if (err.message === 'Failed to fetch') {
                showToast('Network error. Check your connection or ad-blocker.', 'error');
            } else {
                showToast('Failed to load your links', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast('Link copied to clipboard!', 'success');
    };

    const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isConnected) {
        return (
            <main className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center p-4 bg-background text-foreground">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Connect Wallet</h1>
                    <p className="text-muted-foreground">Please connect your wallet to view your links.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-7rem)] bg-background text-foreground p-4 md:p-8 transition-colors">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">My Links</h1>
                        <p className="text-muted-foreground mt-1">Manage and track your locked content.</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search links..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all w-full md:w-64 text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredLinks.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/50">
                        <p className="text-muted-foreground mb-4">You haven't created any links yet.</p>
                        <Link href="/" className="text-primary hover:text-primary/80 font-medium hover:underline">
                            Create your first lock
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredLinks.map((link) => (
                            <div key={link.id} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all group shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg text-foreground">{link.title}</h3>
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                                {link.price} USDC
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{formatDistanceToNow(new Date(link.created_at), { addSuffix: true })}</span>
                                            <span>•</span>
                                            <span className="font-mono text-xs">{link.id}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => copyToClipboard(`${window.location.origin}/${link.id}`)}
                                            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                            title="Copy Link"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <Link
                                            href={`/${link.id}`}
                                            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                            title="View Page"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
