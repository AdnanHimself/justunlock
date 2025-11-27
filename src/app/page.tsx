'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';
import { Loader2, Lock, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { showToast } = useToast();
  const [targetUrl, setTargetUrl] = useState('');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;

    setLoading(true);
    const slug = generateSlug();

    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          target_url: targetUrl,
          price: parseFloat(price),
          receiver_address: address,
          title: title
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create link');

      setCreatedLink(`${window.location.origin}/${slug}`);
      showToast('Link created successfully!', 'success');
    } catch (err) {
      console.error('Error creating link:', err);
      showToast('Failed to create link. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-center p-4 bg-background text-foreground transition-colors">
      <div className="w-full max-w-md space-y-8">
        {!isConnected ? (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center p-4 bg-blue-600/10 dark:bg-blue-600/20 rounded-3xl mb-2">
                <Lock className="w-10 h-10 md:w-12 md:h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                BaseLock
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Monetize your content on Base.<br className="hidden md:block" />
                Secure, simple, and decentralized.
              </p>
            </div>

            <div className="grid gap-4 text-left">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Create a Lock</h3>
                  <p className="text-sm text-muted-foreground">Paste any URL and set a price in USDC.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 shrink-0">
                  <Copy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Share & Earn</h3>
                  <p className="text-sm text-muted-foreground">Share the link. Get paid instantly when users unlock it.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">Connect your wallet to get started</p>
            </div>
          </div>
        ) : createdLink ? (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold text-green-500">Link Created!</h3>
              <p className="text-sm text-muted-foreground">Share this link to start earning.</p>
            </div>

            <div className="flex items-center gap-2 bg-secondary/50 p-3 rounded-xl border border-border">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <input
                readOnly
                value={createdLink}
                className="bg-transparent flex-1 text-sm outline-none text-foreground"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setCreatedLink(null);
                setTargetUrl('');
                setPrice('');
                setTitle('');
              }}
            >
              Create Another
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Create Lock</h1>
              <p className="text-muted-foreground">Set a price for your secret content.</p>
            </div>
            <form onSubmit={handleCreate} className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-input/10 border border-input rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground"
                  required
                />
                <p className="text-xs text-muted-foreground">The secret content users pay to see.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Exclusive Report"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-input/10 border border-input rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Price (USDC)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-input/10 border border-input rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground"
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                </div>
                <p className="text-xs text-muted-foreground">Minimum 0.1 USDC. 1% platform fee applies.</p>
              </div>

              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
              >
                Create Locked Link
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
