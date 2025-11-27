'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
    RainbowKitProvider,
    darkTheme,
    lightTheme,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '../app/config';
import { ToastProvider } from '@/components/ui/Toast';

const queryClient = new QueryClient();


export function Providers({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={mounted && theme === 'light' ? lightTheme({
                        accentColor: '#0052FF',
                        borderRadius: 'medium',
                        overlayBlur: 'small',
                    }) : darkTheme({
                        accentColor: '#0052FF',
                        borderRadius: 'medium',
                        overlayBlur: 'small',
                    })}
                >
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
