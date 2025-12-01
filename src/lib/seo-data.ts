export type Category = 'messaging' | 'cloud' | 'video' | 'code' | 'meeting' | 'design' | 'productivity' | 'social' | 'music' | 'writing' | 'education' | 'gaming';

export interface Platform {
    id: string;
    name: string;
    categories: Category[];
    color?: string; // For UI styling later
}

export interface ContentType {
    id: string;
    name: string; // Singular, e.g. "Trading Signal"
    plural: string; // Plural, e.g. "Trading Signals"
    compatibleCategories: Category[];
}

// --- 1. PLATFORMS (Dimension A) ---
export const platforms: Platform[] = [
    // Messaging
    { id: 'telegram', name: 'Telegram', categories: ['messaging', 'social'] },
    { id: 'discord', name: 'Discord', categories: ['messaging', 'social', 'gaming'] },
    { id: 'whatsapp', name: 'WhatsApp', categories: ['messaging'] },
    { id: 'signal', name: 'Signal', categories: ['messaging'] },
    { id: 'slack', name: 'Slack', categories: ['messaging', 'productivity'] },

    // Cloud Storage (General Files)
    { id: 'google-drive', name: 'Google Drive', categories: ['cloud'] },
    { id: 'dropbox', name: 'Dropbox', categories: ['cloud'] },
    { id: 'onedrive', name: 'OneDrive', categories: ['cloud'] },
    { id: 'icloud', name: 'iCloud', categories: ['cloud'] },
    { id: 'mega', name: 'Mega', categories: ['cloud'] },
    { id: 'box', name: 'Box', categories: ['cloud'] },
    { id: 'wetransfer', name: 'WeTransfer', categories: ['cloud'] },

    // Productivity & Docs
    { id: 'notion', name: 'Notion', categories: ['productivity', 'writing'] },
    { id: 'obsidian', name: 'Obsidian', categories: ['productivity', 'writing'] },
    { id: 'evernote', name: 'Evernote', categories: ['productivity', 'writing'] },
    { id: 'clickup', name: 'ClickUp', categories: ['productivity'] },
    { id: 'trello', name: 'Trello', categories: ['productivity'] },
    { id: 'asana', name: 'Asana', categories: ['productivity'] },
    { id: 'monday', name: 'Monday.com', categories: ['productivity'] },
    { id: 'airtable', name: 'Airtable', categories: ['productivity'] },
    { id: 'coda', name: 'Coda', categories: ['productivity'] },

    // Video
    { id: 'youtube', name: 'YouTube', categories: ['video', 'education'] },
    { id: 'vimeo', name: 'Vimeo', categories: ['video'] },
    { id: 'loom', name: 'Loom', categories: ['video'] },
    { id: 'wistia', name: 'Wistia', categories: ['video'] },
    { id: 'tiktok', name: 'TikTok', categories: ['video', 'social'] },
    { id: 'twitch', name: 'Twitch', categories: ['video', 'gaming'] },
    { id: 'zoom', name: 'Zoom', categories: ['video', 'meeting'] }, // Also meeting

    // Code
    { id: 'github', name: 'GitHub', categories: ['code'] },
    { id: 'gitlab', name: 'GitLab', categories: ['code'] },
    { id: 'bitbucket', name: 'Bitbucket', categories: ['code'] },
    { id: 'replit', name: 'Replit', categories: ['code'] },
    { id: 'codepen', name: 'CodePen', categories: ['code'] },
    { id: 'stackoverflow', name: 'Stack Overflow', categories: ['code'] },

    // Meeting / Consulting
    { id: 'calendly', name: 'Calendly', categories: ['meeting'] },
    { id: 'google-meet', name: 'Google Meet', categories: ['meeting'] },
    { id: 'microsoft-teams', name: 'Microsoft Teams', categories: ['meeting'] },
    { id: 'cal-com', name: 'Cal.com', categories: ['meeting'] },

    // Design
    { id: 'figma', name: 'Figma', categories: ['design'] },
    { id: 'canva', name: 'Canva', categories: ['design'] },
    { id: 'adobe-xd', name: 'Adobe XD', categories: ['design'] },
    { id: 'sketch', name: 'Sketch', categories: ['design'] },
    { id: 'behance', name: 'Behance', categories: ['design'] },
    { id: 'dribbble', name: 'Dribbble', categories: ['design'] },
    { id: 'pinterest', name: 'Pinterest', categories: ['design', 'social'] },

    // Music
    { id: 'soundcloud', name: 'SoundCloud', categories: ['music'] },
    { id: 'spotify', name: 'Spotify', categories: ['music'] },
    { id: 'bandcamp', name: 'Bandcamp', categories: ['music'] },
    { id: 'mixcloud', name: 'Mixcloud', categories: ['music'] },

    // Education / Courses
    { id: 'teachable', name: 'Teachable', categories: ['education'] },
    { id: 'thinkific', name: 'Thinkific', categories: ['education'] },
    { id: 'kajabi', name: 'Kajabi', categories: ['education'] },
    { id: 'gumroad', name: 'Gumroad', categories: ['education', 'productivity'] }, // Catch-all
    { id: 'udemy', name: 'Udemy', categories: ['education'] },
    { id: 'coursera', name: 'Coursera', categories: ['education'] },
];

// --- 2. CONTENT TYPES (Dimension B) ---
export const contentTypes: ContentType[] = [
    // Signals / Groups
    { id: 'trading-signals', name: 'Trading Signal', plural: 'Trading Signals', compatibleCategories: ['messaging'] },
    { id: 'alpha-group', name: 'Alpha Group Access', plural: 'Alpha Group Access', compatibleCategories: ['messaging'] },
    { id: 'betting-tips', name: 'Betting Tip', plural: 'Betting Tips', compatibleCategories: ['messaging'] },
    { id: 'vip-channel', name: 'VIP Channel Access', plural: 'VIP Channel Access', compatibleCategories: ['messaging'] },
    { id: 'community-access', name: 'Community Access', plural: 'Community Access', compatibleCategories: ['messaging', 'social'] },

    // Templates
    { id: 'notion-template', name: 'Notion Template', plural: 'Notion Templates', compatibleCategories: ['productivity', 'writing'] },
    { id: 'obsidian-vault', name: 'Obsidian Vault', plural: 'Obsidian Vaults', compatibleCategories: ['productivity', 'writing'] },
    { id: 'excel-template', name: 'Excel Template', plural: 'Excel Templates', compatibleCategories: ['cloud', 'productivity'] },
    { id: 'google-sheet', name: 'Google Sheet', plural: 'Google Sheets', compatibleCategories: ['cloud', 'productivity'] },
    { id: 'airtable-base', name: 'Airtable Base', plural: 'Airtable Bases', compatibleCategories: ['productivity'] },
    { id: 'trello-board', name: 'Trello Board', plural: 'Trello Boards', compatibleCategories: ['productivity'] },

    // Design Assets
    { id: 'figma-kit', name: 'Figma UI Kit', plural: 'Figma UI Kits', compatibleCategories: ['design'] },
    { id: 'canva-template', name: 'Canva Template', plural: 'Canva Templates', compatibleCategories: ['design'] },
    { id: 'lightroom-preset', name: 'Lightroom Preset', plural: 'Lightroom Presets', compatibleCategories: ['cloud', 'design'] },
    { id: 'photoshop-brush', name: 'Photoshop Brush', plural: 'Photoshop Brushes', compatibleCategories: ['cloud', 'design'] },
    { id: '3d-model', name: '3D Model', plural: '3D Models', compatibleCategories: ['cloud', 'design'] },
    { id: 'font', name: 'Font', plural: 'Fonts', compatibleCategories: ['cloud', 'design'] },
    { id: 'icon-pack', name: 'Icon Pack', plural: 'Icon Packs', compatibleCategories: ['cloud', 'design'] },

    // Video / Courses
    { id: 'video-tutorial', name: 'Video Tutorial', plural: 'Video Tutorials', compatibleCategories: ['video', 'education', 'cloud'] },
    { id: 'online-course', name: 'Online Course', plural: 'Online Courses', compatibleCategories: ['video', 'education', 'cloud'] },
    { id: 'webinar-recording', name: 'Webinar Recording', plural: 'Webinar Recordings', compatibleCategories: ['video', 'cloud'] },
    { id: 'behind-the-scenes', name: 'Behind-the-Scenes Footage', plural: 'Behind-the-Scenes Footage', compatibleCategories: ['video', 'social'] },

    // Code
    { id: 'source-code', name: 'Source Code', plural: 'Source Code', compatibleCategories: ['code', 'cloud'] },
    { id: 'react-component', name: 'React Component', plural: 'React Components', compatibleCategories: ['code'] },
    { id: 'wordpress-theme', name: 'WordPress Theme', plural: 'WordPress Themes', compatibleCategories: ['code', 'cloud'] },
    { id: 'script', name: 'Script', plural: 'Scripts', compatibleCategories: ['code', 'cloud'] },
    { id: 'bot', name: 'Bot', plural: 'Bots', compatibleCategories: ['code', 'messaging'] }, // Bots often live on telegram/discord

    // Consulting
    { id: 'consulting-call', name: 'Consulting Call', plural: 'Consulting Calls', compatibleCategories: ['meeting'] },
    { id: 'coaching-session', name: 'Coaching Session', plural: 'Coaching Sessions', compatibleCategories: ['meeting'] },
    { id: 'audit', name: 'Audit', plural: 'Audits', compatibleCategories: ['meeting', 'video'] }, // Video audit or live call

    // Documents / Info
    { id: 'ebook', name: 'Ebook', plural: 'Ebooks', compatibleCategories: ['cloud', 'writing', 'education'] },
    { id: 'whitepaper', name: 'Whitepaper', plural: 'Whitepapers', compatibleCategories: ['cloud', 'writing'] },
    { id: 'research-report', name: 'Research Report', plural: 'Research Reports', compatibleCategories: ['cloud', 'writing'] },
    { id: 'checklist', name: 'Checklist', plural: 'Checklists', compatibleCategories: ['cloud', 'productivity'] },

    // Music
    { id: 'beat', name: 'Beat', plural: 'Beats', compatibleCategories: ['music', 'cloud'] },
    { id: 'sample-pack', name: 'Sample Pack', plural: 'Sample Packs', compatibleCategories: ['music', 'cloud'] },
    { id: 'dj-set', name: 'DJ Set', plural: 'DJ Sets', compatibleCategories: ['music', 'cloud', 'video'] },
];

// --- 3. GENERATION LOGIC ---

export interface SeoCombination {
    slug: string;
    title: string;
    description: string;
    platform: Platform;
    contentType: ContentType;
}

export function generateSeoCombinations(): SeoCombination[] {
    const combinations: SeoCombination[] = [];

    for (const platform of platforms) {
        for (const type of contentTypes) {
            // FILTER: Check if the platform has at least one category compatible with the content type
            const isCompatible = platform.categories.some(cat => type.compatibleCategories.includes(cat));

            if (isCompatible) {
                combinations.push({
                    slug: `sell-${type.id}-on-${platform.id}`,
                    title: `Sell ${type.plural} on ${platform.name} with Crypto`,
                    description: `The easiest way to sell ${type.plural} on ${platform.name}. Create a secure paywall and accept USDC or ETH.`,
                    platform,
                    contentType: type
                });

                // Variant: "Monetize"
                combinations.push({
                    slug: `monetize-${platform.id}-${type.id}`,
                    title: `Monetize ${platform.name} ${type.plural} with USDC`,
                    description: `Monetize your ${platform.name} ${type.plural} instantly. Gate access with a secure crypto paywall.`,
                    platform,
                    contentType: type
                });
            }
        }
    }

    return combinations;
}
