'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, usePublicClient, useSignMessage } from 'wagmi';
import { parseUnits, parseEther } from 'viem';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Unlock, AlertCircle, Loader2, CheckCircle2, CreditCard, Coins, Copy, ExternalLink, Download, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

// Addresses
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
// V3 Contract Address (Base Mainnet)
const CONTRACT_ADDRESS = '0xD2F2964Ac4665B539e7De9Dc3B14b1A8173c02E0';

const BASELOCK_V3_ABI = [
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
        "inputs": [
            { "internalType": "address payable", "name": "receiver", "type": "address" },
            { "internalType": "string", "name": "linkId", "type": "string" }
        ],
        "name": "payNative",
        "outputs": [],
        "stateMutability": "payable",
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

    // Link Data State
    const [linkData, setLinkData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Access State
    const [hasAccess, setHasAccess] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(false);

    // Payment State
    const [isApproving, setIsApproving] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'USDC' | 'ETH'>('USDC');
    const [ethPrice, setEthPrice] = useState<number | null>(null);
    const [tipAmount, setTipAmount] = useState('0');


    const publicClient = usePublicClient();
    const { showToast } = useToast();

    useEffect(() => {
        // Fetch ETH price from Coinbase API for conversion
        const fetchPrice = async () => {
            try {
                const response = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot');
                const data = await response.json();
                setEthPrice(parseFloat(data.data.amount));
            } catch (e) {
                console.error('Failed to fetch ETH price', e);
                setEthPrice(3000); // Fallback price if API fails
            }
        };
        fetchPrice();
    }, []);

    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Read Allowance (USDC)
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address!, CONTRACT_ADDRESS],
        query: {
            enabled: !!address && !!linkData && paymentMethod === 'USDC',
        }
    });

    // Read Balance (USDC)
    const { data: usdcBalance } = useReadContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address!],
        query: {
            enabled: !!address && paymentMethod === 'USDC',
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

    const fetchLinkData = async () => {
        try {
            // Fetch public link metadata from Supabase
            // Note: The actual secret content is NOT fetched here, only metadata
            const { data, error } = await supabase
                .from('links')
                .select('id, title, price, receiver_address, created_at')
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

    const { signMessageAsync } = useSignMessage();

    const unlockContent = async (txHash: string) => {
        try {
            // Sign a message to prove ownership of the wallet requesting access
            const message = `Unlock content for link: ${shortId}`;
            const signature = await signMessageAsync({ message });

            // Call API to verify transaction and signature
            const response = await fetch('/api/unlock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    linkId: shortId,
                    txHash: txHash,
                    userAddress: address,
                    signature: signature
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to unlock');

            // Success: Update state with the revealed content
            setLinkData((prev: any) => ({ ...prev, target_url: data.targetUrl, content_type: data.contentType }));
            setHasAccess(true);
            showToast('Content unlocked!', 'success');
        } catch (err) {
            console.error('Unlock error:', err);
            showToast('Failed to verify payment or signature. Please try again.', 'error');
        }
    };

    const checkAccess = async () => {
        if (!address || !linkData || !publicClient) return;
        setCheckingAccess(true);
        try {
            // Check for past "Paid" events for this user and link
            // This allows users to re-access content they've already paid for
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
                const txHash = logs[0].transactionHash;
                await unlockContent(txHash);
            }
        } catch (err) {
            console.error('Error checking access:', err);
        } finally {
            setCheckingAccess(false);
        }
    };

    useEffect(() => {
        if (isSuccess && hash) {
            if (paymentMethod === 'USDC') refetchAllowance();
            unlockContent(hash);
        }
    }, [isSuccess, hash, refetchAllowance, paymentMethod]);

    const handleApprove = () => {
        if (!linkData) return;
        setIsApproving(true);
        try {
            const totalAmount = parseFloat(linkData.price) + (parseFloat(tipAmount) || 0);
            writeContract({
                address: USDC_ADDRESS,
                abi: ERC20_ABI,
                functionName: 'approve',
                args: [CONTRACT_ADDRESS, parseUnits(totalAmount.toString(), 6)],
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
            const tip = parseFloat(tipAmount) || 0;

            if (paymentMethod === 'USDC') {
                // USDC Payment: Call payToken on contract
                const totalAmount = parseFloat(linkData.price) + tip;
                writeContract({
                    address: CONTRACT_ADDRESS,
                    abi: BASELOCK_V3_ABI,
                    functionName: 'payToken',
                    args: [
                        USDC_ADDRESS,
                        linkData.receiver_address,
                        shortId as string,
                        parseUnits(totalAmount.toString(), 6)
                    ],
                });
            } else {
                // ETH Payment: Call payNative on contract
                // Calculate required ETH based on current price
                const ethRate = 0.0003; // Note: This should use dynamic price in production
                const totalUSDC = parseFloat(linkData.price) + tip;
                const totalETH = totalUSDC * ethRate;

                writeContract({
                    address: CONTRACT_ADDRESS,
                    abi: BASELOCK_V3_ABI,
                    functionName: 'payNative',
                    args: [
                        linkData.receiver_address,
                        shortId as string
                    ],
                    value: parseEther(totalETH.toFixed(18))
                });
            }
        } catch (err) {
            console.error('Payment error:', err);
            showToast('Payment failed to initiate', 'error');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        </div>
    );


    if (!linkData) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center space-y-6">
            <div className="p-4 bg-secondary/30 rounded-full">
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Link Expired or Not Found</h1>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    The link you are trying to access has been deleted by the creator or does not exist.
                </p>
            </div>
            <Button onClick={() => window.location.href = '/'}>
                Create your own link
            </Button>
        </div>
    );

    const priceInUnits = parseUnits(linkData.price.toString(), 6);
    const hasAllowance = allowance ? allowance >= priceInUnits : false;
    const hasBalance = usdcBalance ? usdcBalance >= priceInUnits : false;

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-3 md:p-4">
            <div className="w-full max-w-sm md:max-w-md space-y-6 md:space-y-8">
                <div className="text-center space-y-3 md:space-y-4">
                    <div className="inline-flex items-center justify-center p-3 md:p-4 bg-card rounded-full border border-border">
                        {hasAccess ? <Unlock className="w-6 h-6 md:w-8 md:h-8 text-green-500" /> : <Lock className="w-6 h-6 md:w-8 md:h-8 text-destructive" />}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">{linkData.title}</h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        {hasAccess ? "You have access to this content." : `Pay ${linkData.price} USDC to unlock.`}
                    </p>

                    {/* Creator Verification */}
                    <div className="flex items-center justify-center gap-2 text-xs md:text-sm">
                        <span className="text-muted-foreground">Created by:</span>
                        <a
                            href={`https://basescan.org/address/${linkData.receiver_address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors font-mono bg-blue-500/10 px-2 py-1 rounded-md"
                        >
                            {linkData.receiver_address.slice(0, 6)}...{linkData.receiver_address.slice(-4)}
                            <CheckCircle2 className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                {hasAccess ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {linkData.content_type === 'text' ? (
                            <div className="relative group">
                                <pre className="p-4 bg-secondary/50 rounded-xl border border-border overflow-x-auto text-sm font-mono whitespace-pre-wrap break-words max-h-64 md:max-h-96">
                                    {linkData.target_url}
                                </pre>
                                <button
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background p-2 rounded-md text-foreground"
                                    onClick={() => {
                                        navigator.clipboard.writeText(linkData.target_url);
                                        showToast('Copied to clipboard', 'success');
                                    }}
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        ) : linkData.content_type === 'image' ? (
                            <div className="rounded-xl overflow-hidden border border-border bg-secondary/50 space-y-2">
                                <img
                                    src={linkData.target_url}
                                    alt="Unlocked Content"
                                    loading="lazy"
                                    className="w-full h-auto max-h-96 object-contain bg-black/50"
                                />
                                <div className="p-2 flex justify-center">
                                    <Button
                                        onClick={() => window.open(linkData.target_url, '_blank')}
                                        className="w-full"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Image
                                    </Button>
                                </div>
                            </div>
                        ) : linkData.content_type === 'video' ? (
                            <div className="rounded-xl overflow-hidden border border-border bg-secondary/50 space-y-2">
                                <video
                                    src={linkData.target_url}
                                    controls
                                    className="w-full h-auto max-h-96 bg-black"
                                />
                                <div className="p-2 flex justify-center">
                                    <Button
                                        onClick={() => window.open(linkData.target_url, '_blank')}
                                        className="w-full"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Video
                                    </Button>
                                </div>
                            </div>
                        ) : linkData.content_type === 'audio' ? (
                            <div className="rounded-xl border border-border bg-secondary/50 p-6 space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Music className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                                <audio
                                    src={linkData.target_url}
                                    controls
                                    className="w-full"
                                />
                                <div className="flex justify-center">
                                    <Button
                                        onClick={() => window.open(linkData.target_url, '_blank')}
                                        className="w-full"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Audio
                                    </Button>
                                </div>
                            </div>
                        ) : linkData.content_type === 'file' ? (
                            <Button
                                className="w-full gap-2 text-lg h-12 md:h-14 transition-all"
                                onClick={() => window.open(linkData.target_url, '_blank')}
                            >
                                <Download className="w-5 h-5" />
                                Download File
                            </Button>
                        ) : (
                            <Button
                                className="w-full gap-2 text-lg h-12 md:h-14 transition-all"
                                onClick={() => window.open(linkData.target_url, '_blank')}
                            >
                                <ExternalLink className="w-5 h-5" />
                                Access Content
                            </Button>
                        )}
                        <p className="text-xs text-center text-muted-foreground">
                            Thank you for your purchase!
                        </p>
                    </div>
                ) : (
                    !isConnected ? (
                        <div className="flex justify-center">
                            <ConnectButton />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-1 p-1 bg-secondary/50 rounded-lg">
                                <button
                                    onClick={() => setPaymentMethod('USDC')}
                                    className={cn(
                                        "flex items-center justify-center gap-2 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all",
                                        paymentMethod === 'USDC' ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
                                    USDC
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('ETH')}
                                    className={cn(
                                        "flex items-center justify-center gap-2 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-all",
                                        paymentMethod === 'ETH' ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Coins className="w-3 h-3 md:w-4 md:h-4" />
                                    ETH
                                </button>
                            </div>

                            <div className="flex justify-between items-center text-sm text-muted-foreground bg-secondary/20 p-3 md:p-4 rounded-xl border border-border/50">
                                <span className="text-xs md:text-sm">Price</span>
                                <span className="text-foreground font-bold text-xl md:text-2xl text-primary">
                                    {paymentMethod === 'USDC'
                                        ? `${linkData.price} USDC`
                                        : ethPrice
                                            ? `~${(parseFloat(linkData.price) / ethPrice).toFixed(5)} ETH`
                                            : 'Loading...'}
                                </span>
                            </div>

                            {paymentMethod === 'USDC' && !hasBalance && (
                                <div className="flex items-center gap-2 text-destructive text-xs md:text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Insufficient USDC balance</span>
                                </div>
                            )}

                            {paymentMethod === 'USDC' && !hasAllowance ? (
                                <Button
                                    onClick={handleApprove}
                                    disabled={isPending || isConfirming || !hasBalance}
                                    isLoading={isPending || isConfirming}
                                    className="w-full"
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
                                    className="w-full"
                                >
                                    {isPending ? 'Confirm Payment...' :
                                        isConfirming ? 'Processing Transaction...' :
                                            checkingAccess ? 'Checking Access...' :
                                                `Pay with ${paymentMethod}`}
                                </Button>
                            )}

                            {isSuccess && !hasAccess && (hasAllowance || paymentMethod === 'ETH') && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-yellow-500 text-xs md:text-sm justify-center">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Transaction confirmed, verifying access...</span>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={checkAccess}
                                        isLoading={checkingAccess}
                                        disabled={checkingAccess}
                                        className="w-full"
                                    >
                                        Verify Access Manually
                                    </Button>
                                </div>
                            )}
                        </div>
                    )
                )}
            </div >
        </main >
    );
}
