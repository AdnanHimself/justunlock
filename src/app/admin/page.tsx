'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Wallet, Users, MessageSquare, Settings, ShieldAlert, Loader2, DollarSign, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// Placeholder for V2 Contract Address - User needs to update this after deployment
const CONTRACT_ADDRESS_V2 = '0x5CB532D8799b36a6E5dfa1663b6cFDDdDB431405';

export default function AdminDashboard() {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState('overview');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Simple admin check (replace with real auth logic later)
    // For now, we'll just allow access if wallet is connected, but in real app check against a whitelist
    useEffect(() => {
        if (!isConnected) {
            setLoading(false);
            return;
        }
        // Mock admin check
        setIsAdmin(true);
        setLoading(false);
    }, [isConnected, address]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isConnected || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center space-y-4">
                    <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="text-muted-foreground">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage platform settings and view statistics</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-foreground">System Operational</span>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <nav className="col-span-3 space-y-2">
                        <TabButton
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon={<Activity className="w-5 h-5" />}
                            label="Overview"
                        />
                        <TabButton
                            active={activeTab === 'sales'}
                            onClick={() => setActiveTab('sales')}
                            icon={<DollarSign className="w-5 h-5" />}
                            label="Sales & Fees"
                        />
                        <TabButton
                            active={activeTab === 'fees'}
                            onClick={() => setActiveTab('fees')}
                            icon={<Wallet className="w-5 h-5" />}
                            label="Fees & Contract"
                        />
                        <TabButton
                            active={activeTab === 'feedback'}
                            onClick={() => setActiveTab('feedback')}
                            icon={<MessageSquare className="w-5 h-5" />}
                            label="Feedback"
                        />
                        <TabButton
                            active={activeTab === 'users'}
                            onClick={() => setActiveTab('users')}
                            icon={<Users className="w-5 h-5" />}
                            label="User Roles"
                        />
                    </nav>

                    {/* Content */}
                    <main className="col-span-9 bg-card rounded-2xl p-6 border border-border">
                        {activeTab === 'overview' && <OverviewTab supabase={supabase} />}
                        {activeTab === 'sales' && <SalesTab supabase={supabase} />}
                        {activeTab === 'fees' && <FeesTab />}
                        {activeTab === 'feedback' && <FeedbackTab supabase={supabase} />}
                        {activeTab === 'users' && <UsersTab supabase={supabase} />}
                    </main>
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left",
                active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );
}

function OverviewTab({ supabase }: any) {
    const [stats, setStats] = useState({
        totalLinks: 0,
        totalVolume: 0,
        activeUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch all links
                const { data: links, error } = await supabase
                    .from('links')
                    .select('price, sales_count, receiver_address');

                if (error) throw error;

                if (links) {
                    const totalLinks = links.length;

                    // Calculate Total Volume (approximate based on price * sales_count)
                    const totalVolume = links.reduce((acc: number, link: any) => {
                        return acc + (parseFloat(link.price) * (link.sales_count || 0));
                    }, 0);

                    // Calculate Active Users (Unique receivers)
                    const uniqueUsers = new Set(links.map((link: any) => link.receiver_address)).size;

                    setStats({
                        totalLinks,
                        totalVolume,
                        activeUsers: uniqueUsers
                    });
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [supabase]);

    if (loading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />;

    return (
        <div className="grid grid-cols-3 gap-6">
            <StatCard label="Total Links" value={stats.totalLinks} icon={<Activity className="w-5 h-5 text-blue-500" />} />
            <StatCard label="Total Volume (Est.)" value={`$${stats.totalVolume.toFixed(2)}`} icon={<DollarSign className="w-5 h-5 text-green-500" />} />
            <StatCard label="Active Creators" value={stats.activeUsers} icon={<Users className="w-5 h-5 text-purple-500" />} />
        </div>
    );
}

function StatCard({ label, value, icon }: any) {
    return (
        <div className="bg-secondary/10 p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground text-sm font-medium">{label}</span>
                <div className="p-2 bg-background rounded-lg border border-border">{icon}</div>
            </div>
            <div className="text-3xl font-bold text-foreground">{value}</div>
        </div>
    );
}

function SalesTab({ supabase }: { supabase: any }) {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const { data, error } = await supabase
                    .from('purchases')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (error) throw error;
                setSales(data || []);
            } catch (err) {
                console.error('Error fetching sales:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [supabase]);

    const totalVolume = sales.reduce((acc, curr) => acc + curr.amount, 0);
    const totalFees = totalVolume * 0.01; // Assuming 1% fee

    if (loading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-secondary/10 p-6 rounded-xl border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Volume</h3>
                    <p className="text-3xl font-bold text-foreground">${totalVolume.toFixed(2)}</p>
                </div>
                <div className="bg-secondary/10 p-6 rounded-xl border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Estimated Fees (1%)</h3>
                    <p className="text-3xl font-bold text-green-500">${totalFees.toFixed(2)}</p>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-secondary/5">
                    <h3 className="font-semibold text-foreground">Recent Transactions</h3>
                </div>
                <div className="divide-y divide-border">
                    {sales.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No sales recorded yet.</div>
                    ) : (
                        sales.map((sale) => (
                            <div key={sale.id} className="p-4 flex items-center justify-between hover:bg-secondary/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">
                                            {sale.buyer_address.slice(0, 6)}...{sale.buyer_address.slice(-4)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(sale.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-foreground">+{sale.amount} USDC</p>
                                    <a
                                        href={`https://basescan.org/tx/${sale.transaction_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        View Tx
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function FeesTab() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Fees & Contract Settings</h2>
            <div className="bg-secondary/10 p-6 rounded-xl border border-border space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-foreground">Platform Fee</h3>
                        <p className="text-sm text-muted-foreground">Current fee percentage taken from each transaction.</p>
                    </div>
                    <span className="text-2xl font-bold text-foreground">1.0%</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-foreground">Contract Address</h3>
                        <p className="text-sm text-muted-foreground">Active smart contract on Base.</p>
                    </div>
                    <code className="bg-background px-3 py-1 rounded border border-border text-sm">
                        {CONTRACT_ADDRESS_V2.slice(0, 6)}...{CONTRACT_ADDRESS_V2.slice(-4)}
                    </code>
                </div>
            </div>

            <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                <h3 className="font-semibold text-yellow-500 mb-2 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Admin Controls
                </h3>
                <p className="text-sm text-yellow-500/80 mb-4">
                    To update fees, you must use the <code>setFee</code> function on the smart contract directly via Etherscan or a wallet interface.
                    Updates the <code>feeBasisPoints</code> on the smart contract. Max 5%.
                </p>
            </div>
        </div>
    );
}

function FeedbackTab({ supabase }: any) {
    const [feedback, setFeedback] = useState<any[]>([]);

    useEffect(() => {
        const fetchFeedback = async () => {
            const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
            if (data) setFeedback(data);
        };
        fetchFeedback();
    }, [supabase]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Feedback</h2>
            <div className="space-y-4">
                {feedback.length === 0 ? (
                    <p className="text-muted-foreground">No feedback yet.</p>
                ) : (
                    feedback.map((item) => (
                        <div key={item.id} className="bg-secondary/20 p-4 rounded-xl border border-border">
                            <div className="flex justify-between items-start mb-2">
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full uppercase font-bold",
                                    item.category === 'bug' ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                                )}>
                                    {item.category || 'General'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-foreground">{item.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function UsersTab({ supabase }: any) {
    // Placeholder for user management
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Roles</h2>
            <p className="text-muted-foreground">
                Manage user roles and permissions here. (Requires <code>profiles</code> table population).
            </p>
        </div>
    );
}
