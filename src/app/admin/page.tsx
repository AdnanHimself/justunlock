'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAccount, useReadContract } from 'wagmi';
import { Wallet, Users, MessageSquare, Settings, ShieldAlert, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder for V2 Contract Address - User needs to update this after deployment
const CONTRACT_ADDRESS_V2 = '0x5CB532D8799b36a6E5dfa1663b6cFDDdDB431405';

export default function AdminPage() {
    const { address, isConnected } = useAccount();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const router = useRouter();

    // Read owner from contract
    const { data: ownerAddress, isLoading: isLoadingOwner } = useReadContract({
        address: CONTRACT_ADDRESS_V2,
        abi: [{
            inputs: [],
            name: "owner",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function"
        }] as const,
        functionName: 'owner',
    });

    useEffect(() => {
        if (!isConnected) {
            // Wait a bit for connection to initialize? 
            // Actually, if not connected, we can't verify.
            // But we should show a "Connect Wallet" state or redirect.
            // For now, let's just wait.
            return;
        }
        checkAdmin();
    }, [isConnected, address, ownerAddress]);

    const checkAdmin = () => {
        if (address && ownerAddress) {
            if (address.toLowerCase() === ownerAddress.toLowerCase()) {
                setIsAdmin(true);
            } else {
                // Not the owner
                router.push('/');
            }
            setLoading(false);
        } else if (!isLoadingOwner) {
            // Loaded owner but mismatch or no address
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
                <p>Please connect your wallet to access the Admin Dashboard.</p>
                {/* We need ConnectButton here. But it's not imported. Let's just tell them to connect. 
                    Or better, import ConnectButton. */}
            </div>
        );
    }

    if (!isAdmin && !loading) return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <p>Access Denied. You are not the owner of the contract.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <nav className="col-span-3 space-y-2">
                        <TabButton
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon={<Settings className="w-5 h-5" />}
                            label="Overview"
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
                    <main className="col-span-9 bg-white/5 rounded-2xl p-6 border border-white/10">
                        {activeTab === 'overview' && <OverviewTab />}
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
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                    : "hover:bg-white/5 text-gray-400 hover:text-white"
            )}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </button>
    );
}

function OverviewTab() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Overview</h2>
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="Total Links" value="Loading..." />
                <StatCard label="Total Volume" value="Loading..." />
                <StatCard label="Active Users" value="Loading..." />
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-yellow-500 shrink-0" />
                <div>
                    <h3 className="font-bold text-yellow-500">Action Required</h3>
                    <p className="text-sm text-yellow-200/80">
                        Please deploy the <strong>BaseLockV2</strong> contract and update the address in the admin dashboard code.
                    </p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }: any) {
    return (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}

function FeesTab() {
    const [fee, setFee] = useState(1); // Default 1%

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Fees & Contract</h2>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Platform Fee (%)</label>
                <div className="flex gap-4">
                    <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={fee}
                        onChange={(e) => setFee(parseFloat(e.target.value))}
                        className="bg-black/50 border border-white/20 rounded-lg px-4 py-2 w-32 focus:outline-none focus:border-purple-500"
                    />
                    <button className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg font-medium transition-colors">
                        Update Fee
                    </button>
                </div>
                <p className="text-xs text-gray-500">
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
                    <p className="text-gray-500">No feedback yet.</p>
                ) : (
                    feedback.map((item) => (
                        <div key={item.id} className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full uppercase font-bold",
                                    item.category === 'bug' ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"
                                )}>
                                    {item.category || 'General'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-200">{item.message}</p>
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
            <p className="text-gray-400">
                Manage user roles and permissions here. (Requires <code>profiles</code> table population).
            </p>
        </div>
    );
}
