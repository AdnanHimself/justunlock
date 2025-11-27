export default function HowItWorksPage() {
    return (
        <main className="min-h-[calc(100vh-7rem)] bg-background text-foreground p-8 transition-colors">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold">How BaseLock Works</h1>
                    <p className="text-xl text-muted-foreground">Monetize your digital content in 3 simple steps.</p>
                </div>

                <div className="grid gap-6">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-110 transition-transform">1</div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">Lock It</h3>
                            <p className="text-muted-foreground">Paste the link to your secret content (Dropbox, Drive, Notion, etc.) and set your price.</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-110 transition-transform">2</div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">Share It</h3>
                            <p className="text-muted-foreground">Post your BaseLock link on Twitter, Discord, or send it directly to your customers.</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-110 transition-transform">3</div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">Profit</h3>
                            <p className="text-muted-foreground">Users pay in USDC or ETH to unlock. The funds are sent instantly to your wallet.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
