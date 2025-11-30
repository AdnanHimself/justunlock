'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { twMerge } from 'tailwind-merge';
import { useTheme } from 'next-themes';
import { Sun, Moon, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';

// V3 Contract Address
const CONTRACT_ADDRESS = '0xD2F2964Ac4665B539e7De9Dc3B14b1A8173c02E0';

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { address, isConnected } = useAccount();

    // Read owner from contract
    const { data: ownerAddress } = useReadContract({
        address: CONTRACT_ADDRESS,
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
        setMounted(true);
    }, []);

    const tabs = [
        { name: 'Create Link', href: '/' },
        { name: 'My Links', href: '/my-links' },
        { name: 'How it works', href: '/how-it-works' },
        { name: 'Feedback', href: '/feedback' },
    ];

    if (isConnected && address && ownerAddress && typeof ownerAddress === 'string' && address.toLowerCase() === ownerAddress.toLowerCase()) {
        tabs.push({ name: 'Admin', href: '/admin' });
    }

    return (
        <nav className="w-full border-b border-border bg-background transition-colors duration-300 sticky top-0 z-50 backdrop-blur-md bg-background/80">
            <div className="px-4 md:px-6 flex flex-col md:flex-row md:items-center md:justify-between min-h-[4rem]">
                {/* Top Row: Logo + Actions (Mobile) / Logo + Links + Actions (Desktop) */}
                <div className="flex items-center w-full h-14 md:h-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors shrink-0 mr-8">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                        JustUnlock
                    </Link>

                    {/* Desktop Links (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-1">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={twMerge(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                                    pathname === tab.href
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                )}
                            >
                                {tab.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions (Theme + Connect) - Pushed to right */}
                    <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-auto">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        )}
                        <div className="hidden md:block">
                            <ConnectButton showBalance={false} />
                        </div>
                        <div className="md:hidden">
                            <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="none" />
                        </div>
                    </div>
                </div>

                {/* Mobile Links (Second Row) */}
                <div className="md:hidden flex items-center gap-0.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={twMerge(
                                "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                                pathname === tab.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
