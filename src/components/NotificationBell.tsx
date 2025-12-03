'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { Bell, DollarSign, ExternalLink, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Purchase {
    id: string;
    link_id: string;
    buyer_address: string;
    amount: number;
    transaction_hash: string;
    created_at: string;
}

interface LinkInfo {
    id: string;
    title: string;
}

export function NotificationBell() {
    const { address, isConnected } = useAccount();
    const [newSalesCount, setNewSalesCount] = useState(0);
    const [recentPurchases, setRecentPurchases] = useState<(Purchase & { linkTitle?: string })[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const STORAGE_KEY = `notif_last_check_${address}`;
    const CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes

    const fetchNotifications = async () => {
        if (!address) return;

        setLoading(true);
        try {
            // 1. Get all my links
            const { data: myLinks, error: linksError } = await supabase
                .from('links')
                .select('id, title')
                .eq('receiver_address', address);

            if (linksError) throw linksError;
            if (!myLinks || myLinks.length === 0) {
                setNewSalesCount(0);
                setRecentPurchases([]);
                return;
            }

            const linkMap = new Map<string, string>();
            myLinks.forEach((link: LinkInfo) => linkMap.set(link.id, link.title));

            // 2. Get all purchases for my links
            const { data: purchases, error: purchasesError } = await supabase
                .from('purchases')
                .select('*')
                .in('link_id', myLinks.map(l => l.id))
                .order('created_at', { ascending: false })
                .limit(20);

            if (purchasesError) throw purchasesError;

            // 3. Check which are new
            const lastCheck = localStorage.getItem(STORAGE_KEY);
            const lastCheckDate = lastCheck ? new Date(lastCheck) : new Date(0);

            const purchasesWithTitles = (purchases || []).map((p: Purchase) => ({
                ...p,
                linkTitle: linkMap.get(p.link_id) || 'Unknown Link'
            }));

            const newPurchases = purchasesWithTitles.filter(p =>
                new Date(p.created_at) > lastCheckDate
            );

            setNewSalesCount(newPurchases.length);
            setRecentPurchases(purchasesWithTitles.slice(0, 10)); // Show last 10

        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = () => {
        if (!address) return;
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
        setNewSalesCount(0);
    };

    const handleBellClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            markAsRead();
        }
    };

    // Fetch on mount and when connected
    useEffect(() => {
        if (isConnected && address) {
            fetchNotifications();
        }
    }, [isConnected, address]);

    // Set up 10-minute interval
    useEffect(() => {
        if (!isConnected || !address) return;

        const interval = setInterval(() => {
            fetchNotifications();
        }, CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, [isConnected, address]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!isConnected) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleBellClick}
                className="relative p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Notifications"
            >
                <Bell className={cn(
                    "w-5 h-5",
                    newSalesCount > 0 ? "text-yellow-500" : "text-muted-foreground"
                )} />
                {newSalesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {newSalesCount > 9 ? '9+' : newSalesCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-80 md:w-96 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-yellow-500" />
                            <h3 className="font-semibold text-foreground">Recent Sales</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-background rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">
                                Loading...
                            </div>
                        ) : recentPurchases.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No sales yet. Share your links to start earning!
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {recentPurchases.map((purchase) => (
                                    <div key={purchase.id} className="p-4 hover:bg-secondary/20 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                <DollarSign className="w-5 h-5 text-green-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {purchase.linkTitle}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Buyer: {purchase.buyer_address.slice(0, 6)}...{purchase.buyer_address.slice(-4)}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm font-bold text-green-500">
                                                        +{purchase.amount} USDC
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(new Date(purchase.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <a
                                                    href={`https://basescan.org/tx/${purchase.transaction_hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                                                >
                                                    View Transaction <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {recentPurchases.length > 0 && (
                        <div className="p-3 border-t border-border bg-secondary/10">
                            <a
                                href="/my-links"
                                className="text-xs text-primary hover:underline font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                View all sales →
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
