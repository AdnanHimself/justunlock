'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { twMerge } from 'tailwind-merge';
import { useTheme } from 'next-themes';
import { Sun, Moon, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAccount } from 'wagmi';

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isConnected } = useAccount();

    useEffect(() => {
        setMounted(true);
    }, []);

    const tabs = [
        { name: 'Create Link', href: '/' },
        { name: 'My Links', href: '/my-links' },
        { name: 'How it works', href: '/how-it-works' },
        { name: 'Feedback', href: '/feedback' },
    ];

    return (
        <nav className="w-full border-b border-border bg-background transition-colors duration-300 sticky top-0 z-50 backdrop-blur-md bg-background/80">
            <div className="px-4 md:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-8 overflow-hidden">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors shrink-0">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                        BaseLock
                    </Link>

                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar transition-all duration-500 ease-in-out">
                        {tabs.map((tab) => (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={twMerge(
                                    "px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
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

                <div className="flex items-center gap-2 md:gap-4 shrink-0">
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
        </nav>
    );
}
