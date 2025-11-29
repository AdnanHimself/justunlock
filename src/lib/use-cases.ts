import { LucideIcon, MessageCircle, Lock, Zap, Heart, Key, Briefcase, Calendar, Shield, Star, UserCheck } from 'lucide-react';

export interface UseCase {
    slug: string;
    title: string;
    description: string;
    icon: any; // Using any to avoid complex type issues with Lucide in this file, but in usage it's LucideIcon
    heroTitle: string;
    heroDescription: string;
    benefits: string[];
    faq: { question: string; answer: string }[];
}

export const useCases: UseCase[] = [
    {
        slug: 'consulting-deposit',
        title: 'Collect Consulting Deposits with Crypto',
        description: 'Stop no-shows. Require a USDC deposit before booking a call.',
        icon: Calendar,
        heroTitle: 'No Deposit, No Call.',
        heroDescription: 'Eliminate time-wasters. Send a BaseLock link to collect a $50 deposit before you share your Calendly link.',
        benefits: [
            'Instant USDC settlement',
            'Filters out non-serious clients',
            'Professional and automated',
            'No monthly fees'
        ],
        faq: [
            { question: 'Can I refund the deposit?', answer: 'Crypto transactions are irreversible by default, but you can manually send the funds back if needed.' },
            { question: 'Do clients need a wallet?', answer: 'Yes, they need a wallet like MetaMask, Coinbase Wallet, or Rainbow to pay.' }
        ]
    },
    {
        slug: 'telegram-access',
        title: 'Sell Telegram Group Access',
        description: 'Monetize your Telegram community. One-time payment for an invite link.',
        icon: MessageCircle,
        heroTitle: 'Pay-to-Enter Telegram Groups.',
        heroDescription: 'The easiest way to monetize your alpha group or community. Users pay USDC, they get the invite link instantly.',
        benefits: [
            'Automated delivery',
            'No bot setup required',
            'Works for channels and groups',
            'Keep 99% of revenue'
        ],
        faq: [
            { question: 'Can users share the link?', answer: 'Technically yes, but as an admin you can see who joins and kick unauthorized users.' },
            { question: 'Is it recurring billing?', answer: 'No, BaseLock handles one-time payments. Perfect for lifetime access or specific drops.' }
        ]
    },
    {
        slug: 'discord-invite',
        title: 'Sell Discord Server Access',
        description: 'Create a paid Discord community without complex bots.',
        icon: MessageCircle,
        heroTitle: 'Paid Discord Access Made Simple.',
        heroDescription: 'Forget complex subscription bots. Just lock your Discord invite link behind a payment wall and share it.',
        benefits: [
            'Zero technical setup',
            'Instant access for buyers',
            'Low gas fees on Base',
            'Global payments'
        ],
        faq: [
            { question: 'How do I prevent leaks?', answer: 'You can set your Discord invite to have a limited number of uses or expire after a certain time.' },
            { question: 'What tokens are accepted?', answer: 'We accept ETH and USDC on the Base network.' }
        ]
    },
    {
        slug: 'alpha-leaks',
        title: 'Sell Exclusive Alpha & Insights',
        description: 'Monetize time-sensitive information instantly.',
        icon: Zap,
        heroTitle: 'Monetize Your Alpha Instantly.',
        heroDescription: 'Have a hot tip or market analysis? Lock it, set a price, and share. Speed is your asset.',
        benefits: [
            'Fastest way to sell text',
            'No file upload needed',
            'Buyers pay for speed',
            'Direct-to-wallet'
        ],
        faq: [
            { question: 'Is the content encrypted?', answer: 'The content is hidden until payment is confirmed on the blockchain.' },
            { question: 'How fast is the payout?', answer: 'Instant. The funds go directly from the buyer to your wallet smart contract.' }
        ]
    },
    {
        slug: 'creator-support',
        title: 'Accept Crypto Donations & Support',
        description: 'A simple way for fans to support your work.',
        icon: Heart,
        heroTitle: 'Support My Work with Crypto.',
        heroDescription: 'Give your true fans a way to say "Thank You". Lock a simple "Thank You" note or exclusive image behind a donation.',
        benefits: [
            'No platform cuts (besides 1% protocol fee)',
            'Global support',
            'Micro-transactions allowed ($1)',
            'Fun and interactive'
        ],
        faq: [
            { question: 'Is there a minimum amount?', answer: 'The minimum price is 1 USDC.' },
            { question: 'Can I use this for crowdfunding?', answer: 'Yes, you can sell "supporter badges" (images) to raise funds for a project.' }
        ]
    },
    {
        slug: 'early-access',
        title: 'Sell Early Access Codes',
        description: 'Monetize beta access or whitelist spots.',
        icon: Key,
        heroTitle: 'Paid Early Access.',
        heroDescription: 'Distributing beta keys or whitelist spots? Make users pay a small fee to prove they are serious testers.',
        benefits: [
            'Reduces spam signups',
            'Validates demand',
            'Generates revenue pre-launch',
            'Simple text delivery'
        ],
        faq: [
            { question: 'How do I deliver unique codes?', answer: 'Currently, BaseLock delivers the same content to everyone. You can link to a Google Sheet or use a generic access code.' },
            { question: 'Is it secure?', answer: 'Yes, the content is only revealed after a successful blockchain transaction.' }
        ]
    },
    {
        slug: 'freelance-payment',
        title: 'Collect Freelance Payments',
        description: 'Send a link to get paid for your work instantly.',
        icon: Briefcase,
        heroTitle: 'Get Paid for Your Work.',
        heroDescription: 'Finished a design or code snippet? Lock the final file and send the link to your client. They pay, they get the file.',
        benefits: [
            'No chasing invoices',
            'Instant settlement',
            'Client gets file immediately',
            'Escrow-like safety'
        ],
        faq: [
            { question: 'What file types are supported?', answer: 'Images, PDFs, Zips, and text. Max file size is 50MB.' },
            { question: 'Can I charge in ETH?', answer: 'You set the price in USDC, but clients can pay with ETH (auto-converted).' }
        ]
    },
    {
        slug: 'sell-passwords',
        title: 'Sell Passwords & Access Codes',
        description: 'Securely sell access to protected pages or archives.',
        icon: Lock,
        heroTitle: 'Sell Access to Anything.',
        heroDescription: 'Have a password-protected website or zip file? Sell the password directly. Simple and effective.',
        benefits: [
            'Works with any platform',
            'No integration needed',
            'Instant delivery',
            'Anonymous'
        ],
        faq: [
            { question: 'Is this safe?', answer: 'The password is only revealed to people who pay. However, they can share it after buying.' },
            { question: 'Good for?', answer: 'Private blogs, protected archives, exclusive streams.' }
        ]
    },
    {
        slug: 'date-deposit',
        title: 'Date Deposit & Coffee Fee',
        description: 'Filter out time-wasters with a small commitment.',
        icon: UserCheck,
        heroTitle: 'Serious Inquiries Only.',
        heroDescription: 'Meeting someone new? Ask for a small "Coffee Deposit" to ensure they show up. Refund it when you meet (or keep it if they ghost).',
        benefits: [
            'Filters non-serious people',
            'Ensures commitment',
            'Safe and pseudonymous',
            'Viral trend'
        ],
        faq: [
            { question: 'Is this real?', answer: 'Yes, "Date Deposits" are a growing trend to prevent ghosting.' },
            { question: 'How do I refund?', answer: 'You would manually send the funds back from your wallet if you choose to.' }
        ]
    },
    {
        slug: 'custom-service',
        title: 'Sell Custom Services',
        description: 'Get paid for quick tasks and micro-services.',
        icon: Star,
        heroTitle: 'Micro-Services for Crypto.',
        heroDescription: 'Offer quick services like "I will review your code" or "I will audit your profile". Lock the submission form or your contact info.',
        benefits: [
            'Upfront payment',
            'Low friction',
            'Global client base',
            'Instant payout'
        ],
        faq: [
            { question: 'How does it work?', answer: 'You lock a link to a form (e.g., Google Forms) where they submit their request details.' },
            { question: 'Why upfront?', answer: 'It ensures you don\'t work for free. The client shows commitment.' }
        ]
    }
];
