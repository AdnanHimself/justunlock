

export default function HowItWorksPage() {
    return (
        <main className="min-h-[calc(100vh-7rem)] bg-background text-foreground p-4 md:p-8 transition-colors">
            <div className="max-w-2xl mx-auto space-y-8 md:space-y-10">
                <div className="space-y-3 md:space-y-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold">Monetize in 30 Seconds.</h1>
                    <p className="text-lg md:text-xl text-muted-foreground">Turn any link into a product.</p>
                </div>

                <div className="grid gap-4 md:gap-6">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm hover-glow">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform">1</div>
                        <div className="space-y-2 md:space-y-3">
                            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">Lock It</h3>
                            <p className="text-foreground/80 text-sm md:text-base">
                                Paste the link to your content (Google Drive, Notion, Calendly, unlisted YouTube video). Set your price in USDC or ETH.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm hover-glow">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform">2</div>
                        <div className="space-y-2 md:space-y-3">
                            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">Share It</h3>
                            <p className="text-foreground/80 text-sm md:text-base">
                                We generate a unique justunlock.link link. Post it on Farcaster, Twitter, or send it via DM.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm hover-glow">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform">3</div>
                        <div className="space-y-2 md:space-y-3">
                            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">Profit</h3>
                            <p className="text-foreground/80 text-sm md:text-base">
                                Users pay to unlock the link. The crypto hits your wallet instantly. No middlemen, no waiting.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-secondary/20 border border-border rounded-2xl p-6 md:p-8 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-yellow-500">💡</span> How to maximize sales
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Keep it accessible</h3>
                            <p className="text-sm text-foreground/80">JustUnlock works best for impulse buys ($1 - $20).</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold">Describe the value</h3>
                            <p className="text-sm text-foreground/80">Since users can&apos;t see the content yet, clearly state what they are buying.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold">Proof of Support</h3>
                            <p className="text-sm text-foreground/80">Ask true fans to &quot;unlock&quot; a link just to support your work.</p>
                        </div>
                    </div>
                </div>

                {/* Is BaseLock Right For Me? */}
                <div className="py-8 md:py-10 border-t border-border space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold">Is JustUnlock right for me?</h2>
                        <p className="text-foreground/80">JustUnlock is built for speed and friction-free commerce.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl space-y-4">
                            <h3 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                                <span className="text-xl">✅</span> Perfect For
                            </h3>
                            <ul className="space-y-2 text-sm md:text-base text-foreground/80">
                                <li className="flex items-start gap-2"><span>•</span> Quick templates & presets</li>
                                <li className="flex items-start gap-2"><span>•</span> Exclusive alpha & leaks</li>
                                <li className="flex items-start gap-2"><span>•</span> Community invites (Telegram/Discord)</li>
                                <li className="flex items-start gap-2"><span>•</span> Consultation deposits</li>
                                <li className="flex items-start gap-2"><span>•</span> Low-cost digital goods ($1 - $100)</li>
                            </ul>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-4">
                            <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                <span className="text-xl">❌</span> Not For
                            </h3>
                            <ul className="space-y-2 text-sm md:text-base text-foreground/80">
                                <li className="flex items-start gap-2"><span>•</span> High-value enterprise software ($5000+)</li>
                                <li className="flex items-start gap-2"><span>•</span> High-security IP needing DRM protection</li>
                                <li className="flex items-start gap-2"><span>•</span> Physical goods shipping</li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center bg-secondary/30 p-4 rounded-xl">
                        <p className="font-medium text-foreground">
                            &quot;Think of JustUnlock as a digital vending machine. Quick, easy, and direct.&quot;
                        </p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="space-y-6 pt-8 md:pt-10 border-t border-border">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 md:p-8 text-center space-y-3">
                        <h2 className="text-2xl md:text-3xl font-bold">The Digital Vending Machine for Web3.</h2>
                        <p className="text-foreground/80 max-w-2xl mx-auto">
                            Is it unhackable DRM? No. It’s a friction-free way to collect micro-payments for low-ticket items, deposits, and instant access. Quick, easy, and direct to your wallet.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-center pt-4">Frequently Asked Questions</h2>
                    <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                        <div className="p-4 md:p-6 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Does JustUnlock take a fee?</h4>
                            <p className="text-foreground/80 text-xs md:text-sm">We take a flat 1% protocol fee on successful transactions to maintain the platform. There are no monthly costs.</p>
                        </div>
                        <div className="p-4 md:p-6 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Can buyers share the link after buying?</h4>
                            <p className="text-foreground/80 text-xs md:text-sm">Yes. Once revealed, the link is theirs. JustUnlock is designed for convenience and speed, not enterprise-grade DRM. It is perfect for communities, deposits, and supporters.</p>
                        </div>
                        <div className="p-4 md:p-6 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Do buyers need a wallet?</h4>
                            <p className="text-foreground/80 text-xs md:text-sm">Yes, they need a Web3 wallet (like Coinbase Wallet, MetaMask, or Rainbow) connected to the Base network to pay.</p>
                        </div>
                        <div className="p-4 md:p-6 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Can I edit a link?</h4>
                            <p className="text-foreground/80 text-xs md:text-sm">Currently, links are immutable once created. If you made a mistake, simply create a new link.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
