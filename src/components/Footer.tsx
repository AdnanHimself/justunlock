import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background py-6 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                    <span>&copy; {new Date().getFullYear()} BaseLock</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <Link href="/how-it-works" className="hover:text-foreground transition-colors">
                        How it Works
                    </Link>
                    <Link href="/my-links" className="hover:text-foreground transition-colors">
                        My Links
                    </Link>
                    <Link href="/feedback" className="hover:text-foreground transition-colors">
                        Feedback
                    </Link>
                    <Link href="/admin" className="hover:text-foreground transition-colors">
                        Admin
                    </Link>
                </div>
            </div>
        </footer>
    );
}
