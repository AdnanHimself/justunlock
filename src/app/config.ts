'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';
import { Chain } from 'wagmi/chains';

const baseWithFallbacks: Chain = {
    ...base,
    rpcUrls: {
        ...base.rpcUrls,
        default: {
            http: [
                'https://mainnet.base.org',
                'https://base.publicnode.com',
                'https://1rpc.io/base',
                'https://base.meowrpc.com',
            ],
        },
    },
};

export const config = getDefaultConfig({
    appName: 'BaseLock',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains: [baseWithFallbacks],
    ssr: true,
});
