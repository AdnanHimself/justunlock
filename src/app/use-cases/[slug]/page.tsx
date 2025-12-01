import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateSeoCombinations, SeoCombination } from '@/lib/seo-data';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Zap } from 'lucide-react';

// Generate all valid paths at build time
export async function generateStaticParams() {
    const combinations = generateSeoCombinations();
    return combinations.map((combo) => ({
        slug: combo.slug,
    }));
}

// Generate metadata for each page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const combinations = generateSeoCombinations();
    const combo = combinations.find((c) => c.slug === slug);

    if (!combo) return {};

    return {
        title: combo.title,
        description: combo.description,
        openGraph: {
            title: combo.title,
            description: combo.description,
        },
    };
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const combinations = generateSeoCombinations();
    const combo = combinations.find((c) => c.slug === slug);

    if (!combo) {
        notFound();
    }

    const { platform, contentType } = combo;

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Works with {platform.name}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                            The easiest way to sell <br />
                            <span className="text-primary">{contentType.plural}</span> on <span className="text-primary">{platform.name}</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Create a secure paywall for your {platform.name} content in seconds.
                            Accept USDC & ETH directly to your wallet.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                            <Link href="/">
                                <Button className="h-14 px-8 text-lg rounded-full gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                                    Start Selling Now <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-16 md:py-24 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-background p-8 rounded-3xl border border-border/50 hover:border-primary/20 transition-colors space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Instant Access</h3>
                            <p className="text-muted-foreground">
                                Your customers get instant access to your {contentType.name} immediately after payment. No manual work required.
                            </p>
                        </div>
                        <div className="bg-background p-8 rounded-3xl border border-border/50 hover:border-primary/20 transition-colors space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Secure Payments</h3>
                            <p className="text-muted-foreground">
                                Accept USDC on Base network. Low fees, instant settlement, and no chargebacks.
                            </p>
                        </div>
                        <div className="bg-background p-8 rounded-3xl border border-border/50 hover:border-primary/20 transition-colors space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Encrypted Content</h3>
                            <p className="text-muted-foreground">
                                Your {platform.name} link or file is securely encrypted and only revealed to verified buyers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works (Tailored) */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold">How to sell {contentType.plural} on {platform.name}</h2>
                            <p className="text-muted-foreground">Set up your paywall in 3 simple steps.</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 mt-1">1</div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Prepare your content</h3>
                                    <p className="text-muted-foreground">
                                        Upload your {contentType.name} file (PDF, Zip, etc.) or copy the link to your {platform.name} content.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 mt-1">2</div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Create a Paywall</h3>
                                    <p className="text-muted-foreground">
                                        Paste the link or upload the file into JustUnlock. Set your price in USDC.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 mt-1">3</div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Share & Earn</h3>
                                    <p className="text-muted-foreground">
                                        Share your JustUnlock link on {platform.name}, social media, or email. Get paid instantly when someone buys.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 md:py-24 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto space-y-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-center">Frequently Asked Questions</h2>
                        <div className="grid gap-6">
                            <div className="bg-background p-6 rounded-2xl border border-border">
                                <h3 className="font-bold text-lg mb-2">Can I sell {contentType.plural} on {platform.name}?</h3>
                                <p className="text-muted-foreground">
                                    Yes! JustUnlock acts as a bridge. You lock your {platform.name} content behind a payment link, and we handle the crypto transaction and access delivery.
                                </p>
                            </div>
                            <div className="bg-background p-6 rounded-2xl border border-border">
                                <h3 className="font-bold text-lg mb-2">What fees does JustUnlock charge?</h3>
                                <p className="text-muted-foreground">
                                    We charge a flat 1% fee on successful transactions. No monthly fees, no setup costs.
                                </p>
                            </div>
                            <div className="bg-background p-6 rounded-2xl border border-border">
                                <h3 className="font-bold text-lg mb-2">Do I need a crypto wallet?</h3>
                                <p className="text-muted-foreground">
                                    Yes, you need a wallet (like MetaMask or Coinbase Wallet) to receive your earnings. Buyers can pay with any wallet on the Base network.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24">
                <div className="container mx-auto px-4 text-center space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold">Ready to monetize your {platform.name} audience?</h2>
                    <Link href="/">
                        <Button className="h-16 px-10 text-xl rounded-full gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                            Create {platform.name} Paywall <ArrowRight className="w-6 h-6" />
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
