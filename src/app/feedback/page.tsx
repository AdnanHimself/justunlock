export default function FeedbackPage() {
    return (
        <main className="min-h-[calc(100vh-7rem)] bg-background text-foreground p-8 transition-colors">
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">Feedback</h1>
                <p className="text-muted-foreground">We would love to hear your thoughts! Please reach out to us on Twitter or via Email.</p>

                <div className="grid gap-4">
                    <a href="https://twitter.com" target="_blank" className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-secondary/50 transition-all group shadow-sm">
                        <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">Twitter / X</h3>
                        <p className="text-sm text-muted-foreground">Follow us for updates and DM us your feedback.</p>
                    </a>

                    <a href="mailto:support@baselock.xyz" className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-secondary/50 transition-all group shadow-sm">
                        <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">Email</h3>
                        <p className="text-sm text-muted-foreground">Send us a detailed message about bugs or feature requests.</p>
                    </a>
                </div>
            </div>
        </main>
    );
}
