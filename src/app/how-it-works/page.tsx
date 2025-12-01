


import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
    return (
        <main className="min-h-[calc(100vh-7rem)] bg-background text-foreground p-4 md:p-8 transition-colors">
            <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
                <div className="space-y-4 md:space-y-6 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold">Monetize in 30 Seconds.</h1>
                    <p className="text-lg md:text-xl text-muted-foreground">Turn any link, text, image, or PDF into a product.</p>
                </div>

                <div className="grid gap-8 md:gap-10">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all group hover-glow">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform">1</div>
                        <div className="space-y-3 md:space-y-4">
                            <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">Lock It</h3>
                            <p className="text-foreground/80 text-base md:text-lg leading-relaxed">
                                Paste a link (Google Drive, Notion, Calendly) or upload a file (Image, PDF). Set your price in USDC or ETH.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all group hover-glow">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform">2</div>
                        <div className="space-y-3 md:space-y-4">
                            <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">Share It</h3>
                            <p className="text-foreground/80 text-base md:text-lg leading-relaxed">
                                We generate a unique justunlock.link URL. Post it on Farcaster, Twitter, Discord, or send it via DM.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all group hover-glow">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform">3</div>
                        <div className="space-y-3 md:space-y-4">
                            <h3 className="text-2xl md:text-3xl font-semibold text-foreground group-hover:text-primary transition-colors">Profit</h3>
                            <p className="text-foreground/80 text-base md:text-lg leading-relaxed">
                                Users pay to unlock the content. The crypto hits your wallet instantly. No accounts, no middlemen, no waiting.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-secondary/20 border border-border rounded-3xl p-8 md:p-10 space-y-8">
                    <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                        <span className="text-primary">💡</span> How to maximize sales
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Keep it accessible</h3>
                            <p className="text-base text-foreground/80">JustUnlock works best for impulse buys ($1 - $20).</p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Describe the value</h3>
                            <p className="text-base text-foreground/80">Since users can&apos;t see the content yet, clearly state what they are buying.</p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Proof of Support</h3>
                            <p className="text-base text-foreground/80">Ask true fans to &quot;unlock&quot; a link just to support your work.</p>
                        </div>
                    </div>
                </div>

                {/* Is BaseLock Right For Me? */}
                <div className="py-10 md:py-12 border-t border-border space-y-8">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl md:text-4xl font-bold">Is JustUnlock right for me?</h2>
                        <p className="text-foreground/80 text-lg">JustUnlock is built for speed and friction-free commerce.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl space-y-5">
                            <h3 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-3 text-xl">
                                <span>✅</span> Perfect For
                            </h3>
                            <ul className="space-y-3 text-base md:text-lg text-foreground/80">
                                <li className="flex items-start gap-3"><span>•</span> Quick templates & presets</li>
                                <li className="flex items-start gap-3"><span>•</span> Exclusive alpha & leaks</li>
                                <li className="flex items-start gap-3"><span>•</span> Community invites (Telegram/Discord)</li>
                                <li className="flex items-start gap-3"><span>•</span> Consultation deposits</li>
                                <li className="flex items-start gap-3"><span>•</span> Low-cost digital goods ($1 - $100)</li>
                            </ul>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl space-y-5">
                            <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-3 text-xl">
                                <span>❌</span> Not For
                            </h3>
                            <ul className="space-y-3 text-base md:text-lg text-foreground/80">
                                <li className="flex items-start gap-3"><span>•</span> High-value enterprise software ($5000+)</li>
                                <li className="flex items-start gap-3"><span>•</span> High-security IP needing DRM protection</li>
                                <li className="flex items-start gap-3"><span>•</span> Physical goods shipping</li>
                            </ul>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                        <div className="p-6 md:p-8 bg-secondary/20 rounded-2xl">
                            <h4 className="font-semibold mb-2 md:mb-3 text-lg">Does JustUnlock take a fee?</h4>
                            <p className="text-foreground/80 text-base">We take a flat 1% protocol fee on successful transactions to maintain the platform. There are no monthly costs.</p>
                        </div>
                        <div className="p-6 md:p-8 bg-secondary/20 rounded-2xl">
                            <h4 className="font-semibold mb-2 md:mb-3 text-lg">Can buyers share the link after buying?</h4>
                            <p className="text-foreground/80 text-base">Yes. Once revealed, the link is theirs. JustUnlock is designed for convenience and speed, not enterprise-grade DRM. It is perfect for communities, deposits, and supporters.</p>
                        </div>
                        <div className="p-6 md:p-8 bg-secondary/20 rounded-2xl">
                            <h4 className="font-semibold mb-2 md:mb-3 text-lg">Do buyers need a wallet?</h4>
                            <p className="text-foreground/80 text-base">Yes, they need a Web3 wallet (like Coinbase Wallet, MetaMask, or Rainbow) connected to the Base network to pay.</p>
                        </div>
                        <div className="p-6 md:p-8 bg-secondary/20 rounded-2xl">
                            <h4 className="font-semibold mb-2 md:mb-3 text-lg">Can I edit a link?</h4>
                            <p className="text-foreground/80 text-base">Currently, links are immutable once created. If you made a mistake, simply create a new link.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
