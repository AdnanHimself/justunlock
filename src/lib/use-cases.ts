import { LucideIcon, FileText, File, MessageCircle, Lock, Zap, Heart, Key, Briefcase, Calendar, Shield, Star, UserCheck, Music, Video, Code, Database, Globe, Smartphone, PenTool, Camera, Headphones, Gift, ShoppingBag, Map, Book, Coffee, Box } from 'lucide-react';

export interface UseCase {
    slug: string;
    title: string;
    description: string;
    icon: LucideIcon;
    heroTitle: string;
    heroDescription: string;
    benefits: string[];
    faq: { question: string; answer: string }[];
}

export const useCases: UseCase[] = [
    // --- EXISTING 10 ---
    {
        slug: 'consulting-deposit',
        title: 'Collect Consulting Deposits',
        description: 'Stop no-shows. Require a USDC deposit before booking a call.',
        icon: Calendar,
        heroTitle: 'No Deposit, No Call.',
        heroDescription: 'Eliminate time-wasters. Send a JustUnlock link to collect a $50 deposit before you share your Calendly link.',
        benefits: ['Instant USDC settlement', 'Filters out non-serious clients', 'Professional and automated', 'No monthly fees'],
        faq: [{ question: 'Can I refund?', answer: 'Yes, manually from your wallet.' }, { question: 'Do clients need a wallet?', answer: 'Yes, MetaMask or Coinbase Wallet.' }]
    },
    {
        slug: 'telegram-access',
        title: 'Sell Telegram Group Access',
        description: 'Monetize your Telegram community. One-time payment for an invite link.',
        icon: MessageCircle,
        heroTitle: 'Pay-to-Enter Telegram Groups.',
        heroDescription: 'The easiest way to monetize your alpha group or community. Users pay USDC, they get the invite link instantly.',
        benefits: ['Automated delivery', 'No bot setup required', 'Works for channels and groups', 'Keep 99% of revenue'],
        faq: [{ question: 'Can users share the link?', answer: 'Technically yes, but you can moderate.' }, { question: 'Recurring billing?', answer: 'No, one-time payment only.' }]
    },
    {
        slug: 'discord-invite',
        title: 'Sell Discord Server Access',
        description: 'Create a paid Discord community without complex bots.',
        icon: MessageCircle,
        heroTitle: 'Paid Discord Access Made Simple.',
        heroDescription: 'Forget complex subscription bots. Just lock your Discord invite link behind a payment wall and share it.',
        benefits: ['Zero technical setup', 'Instant access', 'Low gas fees', 'Global payments'],
        faq: [{ question: 'Prevent leaks?', answer: 'Set invite limits in Discord.' }, { question: 'Tokens accepted?', answer: 'ETH and USDC on Base.' }]
    },
    {
        slug: 'alpha-leaks',
        title: 'Sell Exclusive Alpha',
        description: 'Monetize time-sensitive information instantly.',
        icon: Zap,
        heroTitle: 'Monetize Your Alpha Instantly.',
        heroDescription: 'Have a hot tip or market analysis? Lock it, set a price, and share. Speed is your asset.',
        benefits: ['Fastest way to sell text', 'No file upload needed', 'Buyers pay for speed', 'Direct-to-wallet'],
        faq: [{ question: 'Encrypted?', answer: 'Hidden until payment.' }, { question: 'Payout speed?', answer: 'Instant.' }]
    },
    {
        slug: 'creator-support',
        title: 'Accept Crypto Donations',
        description: 'A simple way for fans to support your work.',
        icon: Heart,
        heroTitle: 'Support My Work with Crypto.',
        heroDescription: 'Give your true fans a way to say "Thank You". Lock a simple "Thank You" note or exclusive image behind a donation.',
        benefits: ['No platform cuts', 'Global support', 'Micro-transactions allowed', 'Fun and interactive'],
        faq: [{ question: 'Minimum amount?', answer: '1 USDC.' }, { question: 'Crowdfunding?', answer: 'Yes, sell supporter badges.' }]
    },
    {
        slug: 'early-access',
        title: 'Sell Early Access Codes',
        description: 'Monetize beta access or whitelist spots.',
        icon: Key,
        heroTitle: 'Paid Early Access.',
        heroDescription: 'Distributing beta keys or whitelist spots? Make users pay a small fee to prove they are serious testers.',
        benefits: ['Reduces spam', 'Validates demand', 'Revenue pre-launch', 'Simple delivery'],
        faq: [{ question: 'Unique codes?', answer: 'Link to a sheet or use generic code.' }, { question: 'Secure?', answer: 'Yes, revealed after payment.' }]
    },
    {
        slug: 'freelance-payment',
        title: 'Collect Freelance Payments',
        description: 'Send a link to get paid for your work instantly.',
        icon: Briefcase,
        heroTitle: 'Get Paid for Your Work.',
        heroDescription: 'Finished a design or code snippet? Lock the final file and send the link to your client. They pay, they get the file.',
        benefits: ['No chasing invoices', 'Instant settlement', 'Client gets file immediately', 'Escrow-like safety'],
        faq: [{ question: 'File types?', answer: 'Images, PDFs, Zips, Text.' }, { question: 'ETH payment?', answer: 'Yes, auto-converted.' }]
    },
    {
        slug: 'sell-passwords',
        title: 'Sell Passwords',
        description: 'Securely sell access to protected pages or archives.',
        icon: Lock,
        heroTitle: 'Sell Access to Anything.',
        heroDescription: 'Have a password-protected website or zip file? Sell the password directly. Simple and effective.',
        benefits: ['Works with any platform', 'No integration needed', 'Instant delivery', 'Anonymous'],
        faq: [{ question: 'Safe?', answer: 'Revealed only to buyers.' }, { question: 'Use cases?', answer: 'Private blogs, archives.' }]
    },
    {
        slug: 'date-deposit',
        title: 'Date Deposit',
        description: 'Filter out time-wasters with a small commitment.',
        icon: UserCheck,
        heroTitle: 'Serious Inquiries Only.',
        heroDescription: 'Meeting someone new? Ask for a small "Coffee Deposit" to ensure they show up. Refund it when you meet.',
        benefits: ['Filters non-serious people', 'Ensures commitment', 'Safe and pseudonymous', 'Viral trend'],
        faq: [{ question: 'Real?', answer: 'Yes, growing trend.' }, { question: 'Refund?', answer: 'Manual refund possible.' }]
    },
    {
        slug: 'custom-service',
        title: 'Sell Custom Services',
        description: 'Get paid for quick tasks and micro-services.',
        icon: Star,
        heroTitle: 'Micro-Services for Crypto.',
        heroDescription: 'Offer quick services like "I will review your code". Lock the submission form or your contact info.',
        benefits: ['Upfront payment', 'Low friction', 'Global client base', 'Instant payout'],
        faq: [{ question: 'How?', answer: 'Lock a link to a form.' }, { question: 'Why upfront?', answer: 'Commitment.' }]
    },

    // --- DIGITAL PRODUCTS (PDFs, Ebooks) ---
    {
        slug: 'sell-pdf-crypto',
        title: 'Sell PDF with Crypto',
        description: 'Monetize your ebooks, guides, and reports instantly.',
        icon: FileText,
        heroTitle: 'Sell PDFs for USDC & ETH.',
        heroDescription: 'Upload your PDF, set a price, and share the link. The easiest way to sell ebooks and guides on Base.',
        benefits: ['Direct file upload', 'No hosting needed', 'Instant download', 'Global sales'],
        faq: [{ question: 'Max file size?', answer: '4MB.' }, { question: 'Fees?', answer: 'Only 1%.' }]
    },
    {
        slug: 'sell-ebook-crypto',
        title: 'Sell Ebook with Crypto',
        description: 'Self-publish your ebook and get paid in crypto.',
        icon: Book,
        heroTitle: 'Your Ebook. Your Revenue.',
        heroDescription: 'Skip Amazon. Sell your ebook directly to your audience for crypto. Instant payouts, no middlemen.',
        benefits: ['Keep 99% revenue', 'Instant payouts', 'Own your audience', 'No approval process'],
        faq: [{ question: 'Formats?', answer: 'PDF supported.' }, { question: 'Protection?', answer: 'Link is locked until payment.' }]
    },
    {
        slug: 'sell-whitepaper',
        title: 'Sell Whitepapers',
        description: 'Monetize premium research and whitepapers.',
        icon: FileText,
        heroTitle: 'Premium Research Paywall.',
        heroDescription: 'Sell access to your deep-dive research or whitepapers. Professionals pay in USDC to unlock the PDF.',
        benefits: ['Professional look', 'Secure delivery', 'B2B friendly', 'Instant access'],
        faq: [{ question: 'Receipts?', answer: 'On-chain proof of payment.' }, { question: 'Bulk sales?', answer: 'Yes, unlimited sales.' }]
    },
    {
        slug: 'sell-fitness-plan',
        title: 'Sell Fitness Plans',
        description: 'Monetize your workout routines and diet plans.',
        icon: FileText,
        heroTitle: 'Sell Workout Plans for Crypto.',
        heroDescription: 'Personal trainers: Upload your PDF workout plan and sell it directly on social media.',
        benefits: ['Direct to client', 'No app needed', 'Instant payment', 'Mobile friendly'],
        faq: [{ question: 'Video links?', answer: 'Yes, include links in PDF.' }, { question: 'Refunds?', answer: 'No refunds by default.' }]
    },
    {
        slug: 'sell-study-notes',
        title: 'Sell Study Notes',
        description: 'Earn money from your university notes.',
        icon: Book,
        heroTitle: 'Monetize Your Study Notes.',
        heroDescription: 'Good at taking notes? Sell your summaries and cheat sheets to other students for crypto.',
        benefits: ['Passive income', 'Help others', 'Simple upload', 'Anonymous'],
        faq: [{ question: 'Legal?', answer: 'Your notes are your IP.' }, { question: 'Price?', answer: 'Micro-payments supported.' }]
    },

    // --- TEMPLATES & PRESETS ---
    {
        slug: 'sell-notion-template',
        title: 'Sell Notion Templates',
        description: 'Monetize your productivity systems.',
        icon: File,
        heroTitle: 'Sell Notion Templates.',
        heroDescription: 'Lock your Notion template duplicate link. Users pay to get the link and clone your system.',
        benefits: ['Huge market', 'Digital delivery', 'No shipping', 'High margins'],
        faq: [{ question: 'How?', answer: 'Lock the "Duplicate" link.' }, { question: 'Updates?', answer: 'Update the Notion page anytime.' }]
    },
    {
        slug: 'sell-lightroom-presets',
        title: 'Sell Lightroom Presets',
        description: 'Monetize your photo editing style.',
        icon: Camera,
        heroTitle: 'Sell Photo Presets.',
        heroDescription: 'Photographers: Sell your DNG or XMP presets. Upload the zip file or link to a drive.',
        benefits: ['Passive income', 'Creative freedom', 'Global audience', 'Instant delivery'],
        faq: [{ question: 'File types?', answer: 'Zip files supported.' }, { question: 'Mobile?', answer: 'Yes, works on mobile.' }]
    },
    {
        slug: 'sell-canva-templates',
        title: 'Sell Canva Templates',
        description: 'Monetize your design skills.',
        icon: PenTool,
        heroTitle: 'Sell Canva Designs.',
        heroDescription: 'Create beautiful templates and sell the edit link. Perfect for social media managers.',
        benefits: ['Recurring sales', 'Easy to make', 'High demand', 'Instant access'],
        faq: [{ question: 'License?', answer: 'You define the license.' }, { question: 'Delivery?', answer: 'Link to Canva template.' }]
    },
    {
        slug: 'sell-excel-templates',
        title: 'Sell Excel Templates',
        description: 'Monetize your spreadsheets and financial models.',
        icon: FileText,
        heroTitle: 'Sell Spreadsheets.',
        heroDescription: 'Financial models, trackers, and calculators. Sell your Excel or Google Sheets templates.',
        benefits: ['B2B sales', 'High value', 'Instant download', 'Professional'],
        faq: [{ question: 'Google Sheets?', answer: 'Lock the "Make a copy" link.' }, { question: 'Excel?', answer: 'Upload the .xlsx file.' }]
    },
    {
        slug: 'sell-framer-templates',
        title: 'Sell Framer Templates',
        description: 'Monetize your website designs.',
        icon: Globe,
        heroTitle: 'Sell Framer Remix Links.',
        heroDescription: 'Designers: Sell your Framer remix links. Buyers get the project instantly after payment.',
        benefits: ['High ticket items', 'Design community', 'Instant transfer', 'Secure'],
        faq: [{ question: 'Remix link?', answer: 'Yes, lock the remix URL.' }, { question: 'Support?', answer: 'Handle support via email.' }]
    },

    // --- CODE & TECH ---
    {
        slug: 'sell-source-code',
        title: 'Sell Source Code',
        description: 'Monetize your scripts and snippets.',
        icon: Code,
        heroTitle: 'Sell Your Code.',
        heroDescription: 'Have a useful script or boilerplate? Sell the GitHub repo invite or the zip file directly.',
        benefits: ['Developer economy', 'Instant access', 'No marketplace fees', 'Direct sales'],
        faq: [{ question: 'Repo access?', answer: 'Lock the invite link.' }, { question: 'Zip?', answer: 'Upload the code zip.' }]
    },
    {
        slug: 'sell-api-keys',
        title: 'Sell API Keys',
        description: 'Monetize access to your API.',
        icon: Key,
        heroTitle: 'Sell API Access.',
        heroDescription: 'Building a micro-SaaS? Sell API keys directly. Lock the key behind a payment.',
        benefits: ['Simple billing', 'No Stripe needed', 'Crypto native', 'Instant key delivery'],
        faq: [{ question: 'Automation?', answer: 'Manual key delivery for now.' }, { question: 'Recurring?', answer: 'One-time purchase.' }]
    },
    {
        slug: 'sell-prompts',
        title: 'Sell AI Prompts',
        description: 'Monetize your prompt engineering skills.',
        icon: MessageCircle,
        heroTitle: 'Sell ChatGPT Prompts.',
        heroDescription: 'Crafted the perfect prompt? Sell the text string directly. Buyers copy-paste it.',
        benefits: ['AI trend', 'Text-based', 'Instant delivery', 'Low price point'],
        faq: [{ question: 'Format?', answer: 'Locked text.' }, { question: 'Protection?', answer: 'Hidden until paid.' }]
    },
    {
        slug: 'sell-datasets',
        title: 'Sell Datasets',
        description: 'Monetize your data collection.',
        icon: Database,
        heroTitle: 'Sell Data.',
        heroDescription: 'Collected a valuable list or dataset? Sell the CSV or JSON file directly.',
        benefits: ['High value', 'B2B sales', 'Instant download', 'Secure'],
        faq: [{ question: 'File size?', answer: 'Up to 4MB.' }, { question: 'Format?', answer: 'CSV, JSON, Zip.' }]
    },
    {
        slug: 'sell-config-files',
        title: 'Sell Config Files',
        description: 'Monetize your dotfiles and setups.',
        icon: File,
        heroTitle: 'Sell Your Setup.',
        heroDescription: 'Sell your VS Code settings, terminal configs, or OBS setups.',
        benefits: ['Niche audience', 'Helpful', 'Simple text/file', 'Community driven'],
        faq: [{ question: 'Who buys?', answer: 'Developers, streamers.' }, { question: 'How?', answer: 'Upload config file.' }]
    },

    // --- MEDIA (Audio, Video, Photo) ---
    {
        slug: 'sell-beats-crypto',
        title: 'Sell Beats with Crypto',
        description: 'Producers: Sell your beats directly.',
        icon: Music,
        heroTitle: 'Sell Beats for Crypto.',
        heroDescription: 'Upload your beat (MP3/WAV in Zip) and sell the lease or exclusive rights.',
        benefits: ['Direct to artist', 'No platform fees', 'Instant payment', 'Global reach'],
        faq: [{ question: 'Audio player?', answer: 'Not yet, file download only.' }, { question: 'Rights?', answer: 'Include contract in Zip.' }]
    },
    {
        slug: 'sell-samples',
        title: 'Sell Sample Packs',
        description: 'Monetize your sound design.',
        icon: Headphones,
        heroTitle: 'Sell Sample Packs.',
        heroDescription: 'Sound designers: Sell your drum kits and loop packs. Upload the Zip file.',
        benefits: ['Passive income', 'Music community', 'Simple delivery', 'Crypto payments'],
        faq: [{ question: 'Size limit?', answer: '4MB (split if larger).' }, { question: 'Format?', answer: 'Zip recommended.' }]
    },
    {
        slug: 'sell-stock-photos',
        title: 'Sell Stock Photos',
        description: 'Monetize your photography.',
        icon: Camera,
        heroTitle: 'Sell Your Photos.',
        heroDescription: 'Sell high-res downloads of your photography. No stock site commissions.',
        benefits: ['100% royalties', 'Direct sales', 'Instant download', 'Own your rights'],
        faq: [{ question: 'Preview?', answer: 'Show low-res, sell high-res.' }, { question: 'License?', answer: 'Include license text.' }]
    },
    {
        slug: 'sell-video-clips',
        title: 'Sell Video Clips',
        description: 'Monetize your footage.',
        icon: Video,
        heroTitle: 'Sell Stock Footage.',
        heroDescription: 'Sell your B-roll, drone shots, or exclusive clips. Upload the video file.',
        benefits: ['Filmmaker economy', 'Direct sales', 'High value', 'Instant transfer'],
        faq: [{ question: 'Size?', answer: 'Max 4MB.' }, { question: 'Format?', answer: 'MP4, MOV.' }]
    },
    {
        slug: 'sell-podcasts',
        title: 'Sell Premium Podcasts',
        description: 'Monetize your audio content.',
        icon: Music,
        heroTitle: 'Sell Premium Episodes.',
        heroDescription: 'Lock your bonus episodes or extended cuts. Listeners pay to download the MP3.',
        benefits: ['Podcaster revenue', 'Direct support', 'No subscription needed', 'Simple'],
        faq: [{ question: 'RSS?', answer: 'No, direct download.' }, { question: 'Player?', answer: 'Download to listen.' }]
    },

    // --- ACCESS & COMMUNITIES (More specific) ---
    {
        slug: 'whatsapp-group-link',
        title: 'Sell WhatsApp Group Access',
        description: 'Monetize your WhatsApp community.',
        icon: MessageCircle,
        heroTitle: 'Paid WhatsApp Groups.',
        heroDescription: 'Run a premium WhatsApp group? Lock the invite link and charge for entry.',
        benefits: ['Global usage', 'High engagement', 'Simple setup', 'Direct access'],
        faq: [{ question: 'Limit?', answer: 'WhatsApp limits apply.' }, { question: 'Kick?', answer: 'Admin can remove users.' }]
    },
    {
        slug: 'slack-invite',
        title: 'Sell Slack Access',
        description: 'Monetize your professional community.',
        icon: MessageCircle,
        heroTitle: 'Paid Slack Communities.',
        heroDescription: 'Running a pro community on Slack? Sell the invite link for a one-time fee.',
        benefits: ['B2B focus', 'Professional', 'High ticket', 'Automated'],
        faq: [{ question: 'Enterprise?', answer: 'Works with any workspace.' }, { question: 'Expiry?', answer: 'Set link expiry in Slack.' }]
    },
    {
        slug: 'signal-group',
        title: 'Sell Signal Group Access',
        description: 'Monetize your privacy-focused group.',
        icon: Shield,
        heroTitle: 'Paid Signal Groups.',
        heroDescription: 'For privacy-conscious communities. Sell access to your Signal group.',
        benefits: ['Privacy first', 'Crypto native', 'Secure', 'Direct'],
        faq: [{ question: 'Anonymous?', answer: 'Yes, Signal is private.' }, { question: 'Payment?', answer: 'USDC/ETH.' }]
    },
    {
        slug: 'private-instagram',
        title: 'Sell Close Friends Access',
        description: 'Monetize your Instagram content.',
        icon: Camera,
        heroTitle: 'Paid "Close Friends".',
        heroDescription: 'Influencers: Sell access to your "Close Friends" list. Use the link to verify payment.',
        benefits: ['Creator economy', 'Recurring potential', 'High engagement', 'Exclusive'],
        faq: [{ question: 'Automated?', answer: 'Manual add after payment.' }, { question: 'Proof?', answer: 'Buyer sends screenshot.' }]
    },
    {
        slug: 'snapchat-premium',
        title: 'Sell Premium Snapchat',
        description: 'Monetize your exclusive snaps.',
        icon: Smartphone,
        heroTitle: 'Premium Snapchat Access.',
        heroDescription: 'Sell access to your private Snapchat. Lock your username or Snapcode.',
        benefits: ['Direct to fan', 'High engagement', 'Simple', 'Crypto payments'],
        faq: [{ question: 'Allowed?', answer: 'Check platform terms.' }, { question: 'Delivery?', answer: 'Reveal username.' }]
    },

    // --- GAMING & VIRTUAL ITEMS ---
    {
        slug: 'sell-minecraft-skins',
        title: 'Sell Minecraft Skins',
        description: 'Monetize your custom game art.',
        icon: UserCheck,
        heroTitle: 'Sell Minecraft Skins.',
        heroDescription: 'Designers: Sell your custom skins. Upload the PNG file.',
        benefits: ['Gaming niche', 'Young audience', 'Instant delivery', 'Global'],
        faq: [{ question: 'Format?', answer: 'PNG file.' }, { question: 'Installation?', answer: 'User installs manually.' }]
    },
    {
        slug: 'sell-roblox-assets',
        title: 'Sell Roblox Assets',
        description: 'Monetize your game assets.',
        icon: Box,
        heroTitle: 'Sell Roblox Assets.',
        heroDescription: 'Sell your models, scripts, or GFX for Roblox developers.',
        benefits: ['Huge market', 'Developer economy', 'Direct sales', 'Crypto'],
        faq: [{ question: 'Robux?', answer: 'No, earn real crypto.' }, { question: 'Delivery?', answer: 'File or Model ID.' }]
    },
    {
        slug: 'sell-game-keys',
        title: 'Sell Game Keys',
        description: 'Resell your unused game keys.',
        icon: Key,
        heroTitle: 'Sell Steam Keys.',
        heroDescription: 'Have extra bundle keys? Sell them for crypto. Lock the key code.',
        benefits: ['Gamer friendly', 'Instant delivery', 'No marketplace fees', 'Secure'],
        faq: [{ question: 'Region lock?', answer: 'Specify in description.' }, { question: 'Fraud?', answer: 'Code revealed after pay.' }]
    },
    {
        slug: 'sell-carry-services',
        title: 'Sell Gaming Carries',
        description: 'Get paid to help others rank up.',
        icon: Zap,
        heroTitle: 'Sell Gaming Carries.',
        heroDescription: 'Pro gamers: Sell your boosting or carry services. Lock your Discord or lobby invite.',
        benefits: ['Skill based', 'High demand', 'Instant payment', 'Direct'],
        faq: [{ question: 'Trust?', answer: 'Reputation based.' }, { question: 'Payment?', answer: 'Upfront deposit.' }]
    },
    {
        slug: 'sell-mod-packs',
        title: 'Sell Mod Packs',
        description: 'Monetize your game modifications.',
        icon: Code,
        heroTitle: 'Sell Game Mods.',
        heroDescription: 'Curated mod packs or custom configs. Sell the download link.',
        benefits: ['Niche communities', 'Value add', 'Simple delivery', 'Support'],
        faq: [{ question: 'Legal?', answer: 'Check game EULA.' }, { question: 'Hosting?', answer: 'Upload zip or link.' }]
    },

    // --- EVENTS & TICKETS ---
    {
        slug: 'sell-event-tickets',
        title: 'Sell Event Tickets',
        description: 'Simple ticketing for small events.',
        icon: Calendar,
        heroTitle: 'Crypto Event Tickets.',
        heroDescription: 'Hosting a meetup or party? Sell tickets for crypto. The revealed content is the ticket/location.',
        benefits: ['No ticketing fees', 'Instant payout', 'QR code possible', 'Simple'],
        faq: [{ question: 'Validation?', answer: 'Manual check at door.' }, { question: 'Refunds?', answer: 'Manual only.' }]
    },
    {
        slug: 'sell-webinar-access',
        title: 'Sell Webinar Access',
        description: 'Monetize your online workshops.',
        icon: Video,
        heroTitle: 'Paid Webinar Access.',
        heroDescription: 'Hosting a Zoom workshop? Lock the Zoom link behind a payment.',
        benefits: ['Education', 'High value', 'Automated entry', 'Global'],
        faq: [{ question: 'Platform?', answer: 'Zoom, Google Meet.' }, { question: 'Recording?', answer: 'Sell recording later.' }]
    },
    {
        slug: 'sell-livestream',
        title: 'Sell Livestream Access',
        description: 'Monetize your live broadcasts.',
        icon: Video,
        heroTitle: 'Pay-Per-View Stream.',
        heroDescription: 'Lock your unlisted YouTube or Twitch stream link.',
        benefits: ['Exclusive content', 'Live interaction', 'Direct revenue', 'Simple'],
        faq: [{ question: 'Platform?', answer: 'YouTube Unlisted.' }, { question: 'Leaks?', answer: 'Hard to prevent fully.' }]
    },
    {
        slug: 'secret-party',
        title: 'Secret Party Location',
        description: 'Reveal location only to ticket holders.',
        icon: Map,
        heroTitle: 'Secret Location Reveal.',
        heroDescription: 'Hosting an underground event? Sell the "Location Drop". Buyers get the address after paying.',
        benefits: ['Exclusive', 'Hype building', 'Secure', 'Instant'],
        faq: [{ question: 'Map?', answer: 'Google Maps link.' }, { question: 'Safety?', answer: 'Only buyers see it.' }]
    },
    {
        slug: 'vip-upgrade',
        title: 'Sell VIP Upgrades',
        description: 'Upsell your existing customers.',
        icon: Star,
        heroTitle: 'VIP Upgrade Link.',
        heroDescription: 'Offer a VIP upgrade for your community or event. Lock the "VIP Area" access info.',
        benefits: ['High margin', 'Exclusive', 'Loyalty', 'Simple'],
        faq: [{ question: 'What is it?', answer: 'Access to better perks.' }, { question: 'Delivery?', answer: 'Link or code.' }]
    },

    // --- MISC & NICHE ---
    {
        slug: 'sell-gift-cards',
        title: 'Sell Gift Cards',
        description: 'Resell unwanted gift cards.',
        icon: Gift,
        heroTitle: 'Sell Gift Cards for Crypto.',
        heroDescription: 'Have an Amazon card you don\'t need? Sell the code for USDC.',
        benefits: ['Liquidity', 'Fast sale', 'No marketplace fees', 'Direct'],
        faq: [{ question: 'Fraud?', answer: 'Buyer verifies instantly.' }, { question: 'Rate?', answer: 'Usually discounted.' }]
    },
    {
        slug: 'sell-recipes',
        title: 'Sell Secret Recipes',
        description: 'Monetize your culinary secrets.',
        icon: Coffee,
        heroTitle: 'Sell Your Secret Recipe.',
        heroDescription: 'Chefs and foodies: Sell your famous cookie recipe. Lock the PDF or text.',
        benefits: ['Niche', 'Viral potential', 'Low cost', 'High volume'],
        faq: [{ question: 'Format?', answer: 'PDF or Text.' }, { question: 'Copyright?', answer: 'Recipes are hard to copyright.' }]
    },
    {
        slug: 'sell-travel-guide',
        title: 'Sell Travel Guides',
        description: 'Monetize your travel knowledge.',
        icon: Map,
        heroTitle: 'Sell Travel Itineraries.',
        heroDescription: 'Planned the perfect trip? Sell your itinerary and map pins.',
        benefits: ['Travel niche', 'High value', 'Evergreen', 'Digital'],
        faq: [{ question: 'Format?', answer: 'PDF or Google Map.' }, { question: 'Updates?', answer: 'Sell updated versions.' }]
    },
    {
        slug: 'sell-3d-models',
        title: 'Sell 3D Models',
        description: 'Monetize your 3D art.',
        icon: Box,
        heroTitle: 'Sell 3D Assets.',
        heroDescription: 'Sell your OBJ, FBX, or Blender files. Upload the zip.',
        benefits: ['Design market', 'B2B', 'Instant download', 'Crypto'],
        faq: [{ question: 'Size?', answer: 'Max 4MB.' }, { question: 'License?', answer: 'Include in zip.' }]
    },
    {
        slug: 'sell-promotional-slot',
        title: 'Sell Ad Space',
        description: 'Monetize your newsletter or feed.',
        icon: ShoppingBag,
        heroTitle: 'Buy Ad Space.',
        heroDescription: 'Influencers: Sell a shoutout or ad slot. Lock the submission form.',
        benefits: ['B2B', 'High ticket', 'Automated booking', 'Upfront pay'],
        faq: [{ question: 'Approval?', answer: 'Review after submission.' }, { question: 'Refund?', answer: 'If rejected.' }]
    }
];


