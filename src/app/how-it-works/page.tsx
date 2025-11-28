export default function HowItWorksPage() {
    return (
        <main className="min-h-[calc(100vh-7rem)] bg-background text-foreground p-4 md:p-8 transition-colors">
            <div className="max-w-2xl mx-auto space-y-8 md:space-y-10">
                <div className="space-y-3 md:space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold">How BaseLock Works</h1>
                    <p className="text-lg md:text-xl text-muted-foreground">Monetize your digital content in 3 simple steps.</p>
                </div>

                <div className="grid gap-4 md:gap-6">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform">1</div>
                        <div className="space-y-2 md:space-y-3">
                            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">Lock It</h3>
                            <p className="text-muted-foreground text-sm md:text-base">
                                Paste the link to your secret content. This could be a Google Drive folder, a Notion page, a Dropbox file, or an unlisted YouTube video.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground text-sm md:text-base space-y-1 ml-2">
                                <li>Set a price in USDC (e.g., $10).</li>
                                <li>Give your link a catchy title.</li>
                                <li>The content is hidden until purchased.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform">2</div>
                        <div className="space-y-2 md:space-y-3">
                            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">Share It</h3>
                            <p className="text-muted-foreground text-sm md:text-base">
                                You get a unique BaseLock link (e.g., <code>baselock.xyz/xyz123</code>). Share this link anywhere:
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <span className="px-2.5 py-1 bg-secondary rounded-full text-xs md:text-sm">Twitter / X</span>
                                <span className="px-2.5 py-1 bg-secondary rounded-full text-xs md:text-sm">Discord</span>
                                <span className="px-2.5 py-1 bg-secondary rounded-full text-xs md:text-sm">Telegram</span>
                                <span className="px-2.5 py-1 bg-secondary rounded-full text-xs md:text-sm">Email</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl md:text-2xl shrink-0 group-hover:scale-110 transition-transform">3</div>
                        <div className="space-y-2 md:space-y-3">
                            <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">Profit</h3>
                            <p className="text-muted-foreground text-sm md:text-base">
                                When someone clicks your link, they see a payment screen.
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground text-sm md:text-base space-y-1 ml-2">
                                <li>They pay in <strong>USDC</strong> or <strong>ETH</strong>.</li>
                                <li>The smart contract verifies the payment.</li>
                                <li>The funds are sent <strong>instantly</strong> to your wallet.</li>
                                <li>The buyer gets access to your secret link.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="space-y-6 pt-8 md:pt-10 border-t border-border">
                    <h2 className="text-2xl md:text-3xl font-bold text-center">Frequently Asked Questions</h2>
                    <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                        <div className="p-4 md:p-6 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Is it secure?</h4>
                            <p className="text-muted-foreground text-xs md:text-sm">Yes. Your secret link is stored securely and only revealed to the buyer after the blockchain confirms the payment.</p>
                        </div>
                        <div className="p-4 md:p-6 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">What are the fees?</h4>
                            <p className="text-muted-foreground text-xs md:text-sm">BaseLock takes a small 1% fee on each transaction to maintain the platform. You keep 99%.</p>
                        </div>
                        <div className="p-4 md:p-6 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Can I edit a link?</h4>
                            <p className="text-muted-foreground text-xs md:text-sm">Currently, links are immutable once created. If you made a mistake, simply create a new link.</p>
                        </div>
                        <div className="p-4 md:p-6 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Do I need a wallet?</h4>
                            <p className="text-muted-foreground text-xs md:text-sm">Yes, you need a crypto wallet (like MetaMask or Coinbase Wallet) on the Base network to receive payments.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
