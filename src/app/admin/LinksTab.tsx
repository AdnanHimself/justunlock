import { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LinksTab({ supabase }: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const { data, error } = await supabase
                    .from('links')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                // Filter out any links that might have missing IDs to prevent /undefined errors
                const validLinks = (data || []).filter((link: any) => link.id);
                setLinks(validLinks);
            } catch (err) {
                console.error('Error fetching links:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, [supabase]);

    const filteredLinks = links.filter(link => {
        const term = searchTerm.toLowerCase();
        return (
            (link.title && link.title.toLowerCase().includes(term)) ||
            (link.receiver_address && link.receiver_address.toLowerCase().includes(term)) ||
            (link.id && link.id.toLowerCase().includes(term))
        );
    });

    if (loading) return <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold">All Links</h2>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search links..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-secondary/10 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/5 border-b border-border text-muted-foreground font-medium">
                            <tr>
                                <th className="px-4 py-3">Title / ID</th>
                                <th className="px-4 py-3">Creator</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Sales</th>
                                <th className="px-4 py-3">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredLinks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        No links found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredLinks.map((link) => (
                                    <tr key={link.id} className="hover:bg-secondary/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-foreground">{link.title || 'Untitled'}</div>
                                            <a href={`/${link.id}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                                /{link.id}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <a
                                                href={`https://basescan.org/address/${link.receiver_address}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {link.receiver_address.slice(0, 6)}...{link.receiver_address.slice(-4)}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {link.price} USDC
                                        </td>
                                        <td className="px-4 py-3">
                                            {link.sales_count || 0}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(link.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
