'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, usePublicClient, useReadContract } from 'wagmi';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, Unlock, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseUnits, formatUnits } from 'viem';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

// USDC Address on Base Mainnet
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const CONTRACT_ADDRESS = '0x299433314161E725BB2E02D2D0ff890fD4Dbe85a';

const BASELOCK_ABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "address", "name": "receiver", "type": "address" },
            { "internalType": "string", "name": "linkId", "type": "string" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "payToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "payer", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "receiver", "type": "address" },
            { "indexed": true, "internalType": "string", "name": "linkId", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "address", "name": "token", "type": "address" }
        ],
        "name": "Paid",
        "type": "event"
    }
] as const;

const ERC20_ABI = [
    {
        "inputs": [
            { "name": "spender", "type": "address" },
            { "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "name": "owner", "type": "address" },
            { "name": "spender", "type": "address" }
        ],
        "name": "allowance",
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export default function UnlockPage() {
    const { shortId } = useParams();
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();
    const { showToast } = useToast();

    const [linkData, setLinkData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Read Allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address!, CONTRACT_ADDRESS],
        query: {
            enabled: !!address && !!linkData,
        }
    });

    // Read Balance
    const { data: balance } = useReadContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address!],
        query: {
            enabled: !!address,
        }
    });

    useEffect(() => {
        if (shortId) fetchLinkData();
    }, [shortId]);

    useEffect(() => {
        if (isConnected && address && linkData) {
            checkAccess();
        }
    }, [isConnected, address, linkData, isSuccess]);

    // Refetch allowance logic moved to the main success effect

    const fetchLinkData = async () => {
        try {
            // Only fetch public metadata, NOT the target_url
            const { data, error } = await supabase
                .from('links')
                .select('id, title, price, receiver_address, created_at') // Exclude target_url
                .eq('id', shortId)
                .single();

            if (error) throw error;
            setLinkData(data);
        } catch (err) {
            console.error('Error fetching link:', err);
            showToast('Failed to load link data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const unlockContent = async (txHash: string) => {
        try {
            const response = await fetch('/api/unlock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    linkId: shortId,
                    txHash: txHash,
                    userAddress: address
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to unlock');

            setLinkData((prev: any) => ({ ...prev, target_url: data.targetUrl }));
            setHasAccess(true);
            showToast('Content unlocked!', 'success');
        } catch (err) {
            console.error('Unlock error:', err);
            showToast('Failed to verify payment. Please try again.', 'error');
        }
    };

    const checkAccess = async () => {
        if (!address || !linkData || !publicClient) return;
        setCheckingAccess(true);
        try {
            const logs = await publicClient.getLogs({
                address: CONTRACT_ADDRESS,
                event: {
                    type: 'event',
                    name: 'Paid',
                    inputs: [
                        { indexed: true, name: 'payer', type: 'address' },
                        { indexed: true, name: 'receiver', type: 'address' },
                        { indexed: true, name: 'linkId', type: 'string' },
                        { indexed: false, name: 'amount', type: 'uint256' },
                        { indexed: false, name: 'token', type: 'address' }
                    ]
                },
                args: {
                    payer: address,
                    linkId: shortId as string
                },
                fromBlock: 'earliest'
            });

            if (logs.length > 0) {
                // Found a past payment! Use its hash to unlock.
                const txHash = logs[0].transactionHash;
                await unlockContent(txHash);
            }
        } catch (err) {
            console.error('Error checking access:', err);
        } finally {
            setCheckingAccess(false);
        }
    };

    // Watch for successful payment transaction
    useEffect(() => {
        if (isSuccess && hash) {
            refetchAllowance();
            unlockContent(hash);
        }
    }, [isSuccess, hash, refetchAllowance]);

    const handleApprove = () => {
        if (!linkData) return;
        setIsApproving(true);
        try {
            writeContract({
                address: USDC_ADDRESS,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [CONTRACT_ADDRESS, parseUnits(linkData.price.toString(), 6)], // USDC has 6 decimals
            });
        } catch (err) {
            console.error('Approval error:', err);
            showToast('Approval failed', 'error');
            setIsApproving(false);
        }
    };

    const handlePay = () => {
        if (!linkData) return;

        try {
            writeContract({
                address: CONTRACT_ADDRESS,
                abi: BASELOCK_ABI,
                functionName: 'payToken',
                args: [
                    USDC_ADDRESS,
                    linkData.receiver_address,
                    shortId as string,
                    parseUnits(linkData.price.toString(), 6)
                ],
            });
        } catch (err) {
            console.error('Payment error:', err);
            showToast('Payment failed to initiate', 'error');
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground"><Loader2 className="animate-spin" /></div>;
    if (!linkData) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Link not found</div>;

    const priceInUnits = parseUnits(linkData.price.toString(), 6);
    const hasAllowance = allowance ? allowance >= priceInUnits : false;
    const hasBalance = balance ? balance >= priceInUnits : false;

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-card rounded-full border border-border shadow-sm">
                        {hasAccess ? <Unlock className="w-8 h-8 text-green-500" /> : <Lock className="w-8 h-8 text-destructive" />}
                    </div>
                    <h1 className="text-3xl font-bold">{linkData.title}</h1>
                    <p className="text-muted-foreground">
                        {hasAccess ? "You have access to this content." : `Pay ${linkData.price} USDC to unlock.`}
                    </p>
                </div>

                {!isConnected ? (
                    <div className="flex justify-center">
                        <ConnectButton />
                    </div>
                ) : hasAccess ? (
                    <div className="bg-green-900/20 border border-green-900 rounded-2xl p-6 text-center space-y-4">
                        <p className="text-green-400 font-medium">Payment Verified!</p>
                        <a
                            href={linkData.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Access Content
                        </a>
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-xl">
                        <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>Price</span>
                            <span className="text-foreground font-mono text-lg">{linkData.price} USDC</span>
                        </div>

                        {!hasBalance && (
                            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                <AlertCircle className="w-4 h-4" />
                                <span>Insufficient USDC balance</span>
                            </div>
                        )}

                        {!hasAllowance ? (
                            <Button
                                onClick={handleApprove}
                                disabled={isPending || isConfirming || !hasBalance}
                                isLoading={isPending || isConfirming}
                            >
                                {isPending ? 'Confirm Approval...' :
                                    isConfirming ? 'Approving USDC...' :
                                        'Approve USDC'}
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePay}
                                disabled={isPending || isConfirming || checkingAccess}
                                isLoading={isPending || isConfirming || checkingAccess}
                            >
                                {isPending ? 'Confirm Payment...' :
                                    isConfirming ? 'Processing Transaction...' :
                                        checkingAccess ? 'Checking Access...' :
                                            'Pay to Unlock'}
                            </Button>
                        )}

                        {isSuccess && !hasAccess && hasAllowance && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-yellow-500 text-sm justify-center">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Transaction confirmed, verifying access...</span>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={checkAccess}
                                    isLoading={checkingAccess}
                                    disabled={checkingAccess}
                                >
                                    Verify Access Manually
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
