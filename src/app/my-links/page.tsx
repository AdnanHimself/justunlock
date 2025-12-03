'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';
import { Loader2, ExternalLink, Copy, Check, ChevronDown, ChevronUp, DollarSign, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface LinkData {
    id: string;
    title: string;
    price: number;
    currency: string;
    target_url: string; // We might want to hide this or show a masked version
    created_at: string;
    sales_count: number;
    last_purchased_at: string | null;
}

interface PurchaseData {
    id: string;
    buyer_address: string;
    amount: number;
    transaction_hash: string;
    created_at: string;
}

export default function MyLinksPage() {
    const { address, isConnected } = useAccount();
    const [links, setLinks] = useState<LinkData[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
    const [purchases, setPurchases] = useState<PurchaseData[]>([]);
    const [loadingPurchases, setLoadingPurchases] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchLinks = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('links')
                .select('*')
                .eq('receiver_address', address)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLinks(data || []);
        } catch (error) {
            console.error('Error fetching links:', error);
        } finally {
            setLoading(false);
        }
    }, [address]);

    useEffect(() => {
        if (isConnected && address) {
            fetchLinks();
        } else {
            setLoading(false);
        }
    }, [isConnected, address, fetchLinks]);

    useEffect(() => {
        if (expandedLinkId) {
            fetchPurchases(expandedLinkId);
        }
    }, [expandedLinkId]);

    const fetchPurchases = async (linkId: string) => {
        setLoadingPurchases(true);
        try {
            const { data, error } = await supabase
                .from('purchases')
                .select('*')
                .eq('link_id', linkId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPurchases(data || []);
        } catch (error) {
            console.error('Error fetching purchases:', error);
        } finally {
            setLoadingPurchases(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleExpand = (linkId: string) => {
        if (expandedLinkId === linkId) {
            setExpandedLinkId(null);
        } else {
            setExpandedLinkId(linkId);
        }
    };

    const handleDelete = async (linkId: string) => {
        if (!window.confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('links')
                .delete()
                .eq('id', linkId);

            if (error) throw error;

            setLinks(links.filter(link => link.id !== linkId));
            if (expandedLinkId === linkId) {
                setExpandedLinkId(null);
            }
        } catch (error) {
            console.error('Error deleting link:', error);
            alert('Failed to delete link. Please try again.');
        }
    };

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Connect Wallet</h1>
                    <p className="text-muted-foreground">Please connect your wallet to view your links.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Links</h1>
                    <Link
                        href="/create"
                        className="px-3 py-1.5 md:px-4 md:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base"
                    >
                        Create New Link
                    </Link>
                </div>

                {links.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-border">
                        <p className="text-muted-foreground">You haven&apos;t created any links yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {links.map((link) => (
                            <div key={link.id} className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-200 hover:border-primary/50">
                                <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg md:text-xl font-semibold text-foreground">{link.title}</h3>
                                        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                            <span>{link.price} {link.currency}</span>
                                            <span>•</span>
                                            <span>{link.sales_count || 0} sales</span>
                                            <span>•</span>
                                            <span>{formatDistanceToNow(new Date(link.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 md:gap-3">
                                        <button
                                            onClick={() => copyToClipboard(`${window.location.origin}/${link.id}`, link.id)}
                                            className="p-1.5 md:p-2 hover:bg-secondary rounded-lg transition-colors"
                                            title="Copy Link"
                                        >
                                            {copiedId === link.id ? (
                                                <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                                            ) : (
                                                <Copy className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                                            )}
                                        </button>
                                        <Link
                                            href={`/${link.id}`}
                                            className="p-1.5 md:p-2 hover:bg-secondary rounded-lg transition-colors"
                                            title="View Page"
                                        >
                                            <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                                        </Link>
                                        <button
                                            onClick={() => toggleExpand(link.id)}
                                            className="p-1.5 md:p-2 hover:bg-secondary rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            {expandedLinkId === link.id ? (
                                                <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(link.id)}
                                            className="p-1.5 md:p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                                            title="Delete Link"
                                        >
                                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>
                                </div>

                                {expandedLinkId === link.id && (
                                    <div className="bg-secondary/10 border-t border-border p-4 md:p-6 animate-in slide-in-from-top-2">
                                        <h4 className="text-xs md:text-sm font-semibold text-muted-foreground mb-3 md:mb-4 uppercase tracking-wider">Recent Sales</h4>

                                        {loadingPurchases ? (
                                            <div className="flex justify-center py-4">
                                                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : purchases.length === 0 ? (
                                            <p className="text-xs md:text-sm text-muted-foreground italic">No sales yet.</p>
                                        ) : (
                                            <div className="space-y-2 md:space-y-3">
                                                {purchases.map((purchase) => (
                                                    <div key={purchase.id} className="flex items-center justify-between text-xs md:text-sm bg-background/50 p-2 md:p-3 rounded-lg border border-border/50">
                                                        <div className="flex items-center gap-2 md:gap-3">
                                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                                                <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-foreground">
                                                                    {purchase.buyer_address.slice(0, 6)}...{purchase.buyer_address.slice(-4)}
                                                                </p>
                                                                <p className="text-[10px] md:text-xs text-muted-foreground">
                                                                    {formatDistanceToNow(new Date(purchase.created_at), { addSuffix: true })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium text-foreground">+{purchase.amount} USDC</p>
                                                            <a
                                                                href={`https://basescan.org/tx/${purchase.transaction_hash}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] md:text-xs text-primary hover:underline flex items-center justify-end gap-1"
                                                            >
                                                                View Tx <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="pt-3 md:pt-4 mt-3 md:mt-4 border-t border-border flex justify-between items-center">
                                                    <span className="font-semibold text-foreground text-sm md:text-base">Total Revenue</span>
                                                    <span className="font-bold text-lg md:text-xl text-green-500">
                                                        ${purchases.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
