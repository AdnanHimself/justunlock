import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Lock, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ shortId: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { shortId } = await params;
    const { data } = await supabase
        .from('links')
        .select('title')
        .eq('id', shortId)
        .single();

    return {
        title: data?.title || 'Unlock Content',
    };
}

export default async function EmbedPage({ params }: Props) {
    const { shortId } = await params;

    const { data: linkData, error } = await supabase
        .from('links')
        .select('id, title, price, receiver_address')
        .eq('id', shortId)
        .single();

    if (error || !linkData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <p className="text-muted-foreground">Link not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 space-y-6 shadow-lg text-center">
                <div className="inline-flex items-center justify-center p-4 bg-secondary/30 rounded-full">
                    <Lock className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-xl font-bold text-foreground line-clamp-2">{linkData.title}</h1>
                    <p className="text-muted-foreground">
                        Unlock for <span className="font-bold text-foreground">{linkData.price} USDC</span>
                    </p>
                </div>

                <a
                    href={`https://justunlock.link/${shortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                >
                    <Button className="w-full gap-2">
                        Unlock Content <ExternalLink className="w-4 h-4" />
                    </Button>
                </a>

                <div className="text-xs text-muted-foreground">
                    Powered by <span className="font-bold text-primary">JustUnlock</span>
                </div>
            </div>
        </div>
    );
}
