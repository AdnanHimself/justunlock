
'use client';

import { useState } from 'react';
import { useAccount, useSignMessage, useReadContract } from 'wagmi';
import { Link as LinkIcon, Copy, Upload, Check, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { UseCaseCard } from "@/components/UseCaseCard";

import Link from 'next/link';

// V3 Contract Address
const CONTRACT_ADDRESS = '0xD2F2964Ac4665B539e7De9Dc3B14b1A8173c02E0';

const FEE_ABI = [{
  inputs: [],
  name: "feeBasisPoints",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function"
}] as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { showToast } = useToast();
  const [targetUrl, setTargetUrl] = useState('');
  const [contentType, setContentType] = useState<'url' | 'text' | 'file'>('url');
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Read fee from contract
  const { data: feeBasisPoints } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FEE_ABI,
    functionName: 'feeBasisPoints',
  });

  const feePercentage = feeBasisPoints ? Number(feeBasisPoints) / 100 : 1;

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;

    setLoading(true);
    const slug = generateSlug();

    try {
      // 1. Sign Message for Security (DoS Protection)
      const message = `Create Lock: ${slug} `;
      const signature = await signMessageAsync({ message });

      let body;
      const headers: Record<string, string> = {
        'x-signature': signature,
        'x-address': address,
      };

      if (contentType === 'file' && file) {
        const formData = new FormData();
        formData.append('slug', slug);
        formData.append('title', title || '');
        formData.append('price', price);
        formData.append('receiver_address', address);
        formData.append('content_type', file.type.startsWith('image/') ? 'image' : 'file');
        formData.append('file', file);
        body = formData;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          slug: slug,
          title: title || undefined,
          price: parseFloat(price),
          receiver_address: address,
          target_url: targetUrl,
          content_type: contentType
        });
      }

      const response = await fetch('/api/create', {
        method: 'POST',
        headers: headers,
        body: body,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create link');

      setCreatedLink(`${window.location.origin}/${slug}`);
      showToast('Link created successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to create link', 'error');
    } finally {
      setLoading(false);
    }
  }


  const copyToClipboard = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-start pt-12 md:pt-24 p-4 bg-background text-foreground transition-colors">
      <div className="w-full max-w-5xl space-y-12 py-8">
        {!isConnected ? (
          <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">

            {/* Hero Section */}
            <div className="space-y-8 max-w-4xl mx-auto text-center pt-8 md:pt-12">
              <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent pb-2">
                Make Any Link Pay.
              </h1>
              <p className="text-lg md:text-2xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Turn any URL into a digital product in seconds. Simply lock your content, set a price, and start selling.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  className="w-full sm:w-auto px-8 py-4 text-lg h-auto"
                  onClick={() => document.getElementById('create-link-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Monetizing
                </Button>
                <Link
                  href="/how-it-works"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold rounded-xl border border-border hover:bg-secondary/50 transition-colors text-center"
                >
                  How it Works
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">Get paid instantly in ETH or USDC.</p>
            </div>

            {/* Value Proposition Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-border/50 bg-secondary/10">
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                  <Zap className="w-8 h-8 text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold">Direct Payouts</h3>
                <p className="text-foreground/80 text-sm px-4">Funds go straight to your wallet. No holding periods.</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                  <Shield className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold">Zero Friction</h3>
                <p className="text-foreground/80 text-sm px-4">Buyers pay and reveal in one click. No accounts needed.</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">B</div>
                </div>
                <h3 className="text-lg font-bold">Base Native</h3>
                <p className="text-foreground/80 text-sm px-4">Built for low gas fees and lightning-fast transactions.</p>
              </div>
            </div>

            {/* Use Cases Section */}
            <div className="space-y-10">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">What can you sell with BaseLock?</h2>
                <p className="text-muted-foreground text-lg">Perfect for micro-transactions and time-sensitive value.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 text-left">
                <UseCaseCard
                  icon="🚀"
                  title="Exclusive &apos;Alpha&apos;"
                  description="Sell time-sensitive trading insights or market analysis. The value is in the speed."
                />
                <UseCaseCard
                  icon="🤝"
                  title="Consultation Deposits"
                  description="Stop no-shows. Send a locked Calendly link that requires a $50 deposit to book."
                />
                <UseCaseCard
                  icon="💬"
                  title="Community Access"
                  description="Gate your Telegram or Discord invite links. Filter out bots and verify supporters."
                />
                <UseCaseCard
                  icon="📂"
                  title="Digital Downloads"
                  description="Presets, templates, or checklists. Low-cost tools that users are happy to pay for."
                />
              </div>
            </div>

            {/* Philosophy / Reality Check */}
            <div className="py-12 bg-card border border-border rounded-3xl p-8 md:p-12 text-left">
              <div className="max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl font-bold">Built for Speed, Not Bureaucracy.</h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  BaseLock is designed as a digital cash register, not a bank vault. It is the fastest way to facilitate honest exchanges between you and your audience.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Optimized for items between $1 - $100.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Simple Pay-to-Reveal mechanics (no DRM).</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Proven &quot;Pay-what-you-want&quot; psychology.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">Connect your wallet to start earning</p>
            </div>
          </div>
        ) : createdLink ? (
          <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-300">
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
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Create Lock</h1>
              <p className="text-muted-foreground">Set a price for your secret content.</p>
            </div>
            <form id="create-link-form" onSubmit={handleCreate} className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm">
              {/* Content Type Tabs */}
              <div className="flex p-1 bg-secondary/20 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setContentType('url')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${contentType === 'url'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Link (URL)
                </button>
                <button
                  type="button"
                  onClick={() => setContentType('text')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${contentType === 'text'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  Text / Code
                </button>
                <button
                  type="button"
                  onClick={() => setContentType('file')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${contentType === 'file'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  File / Image
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {contentType === 'url' ? 'Target URL' : contentType === 'text' ? 'Secret Content' : 'Upload File'}
                </label>
                {contentType === 'url' ? (
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-input/10 border border-input rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      required
                    />
                  </div>
                ) : contentType === 'text' ? (
                  <div className="relative">
                    <textarea
                      placeholder="Enter secret text, code, or private keys..."
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full p-4 bg-input/10 border border-input rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[120px] font-mono text-sm"
                      required
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) {
                            if (selectedFile.size > 50 * 1024 * 1024) {
                              showToast('File size exceeds 50MB limit', 'error');
                              e.target.value = ''; // Clear input
                              setFile(null);
                            } else {
                              setFile(selectedFile);
                            }
                          } else {
                            setFile(null);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm font-medium">
                          {file ? file.name : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-xs">Max 50MB (Images, PDF)</span>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">The secret content users pay to see.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Link Title</label>
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
                <div className="flex gap-4 items-start">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max="10000"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-input/10 border border-input rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground text-foreground"
                      required
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  </div>
                  <div className="hidden md:block p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-600 dark:text-blue-400 max-w-[200px]">
                    <p><strong>Note:</strong> You set the price in USDC, but buyers can pay with <strong>ETH</strong> (auto-converted).</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground md:hidden mt-1">
                  Buyers can also pay with ETH (auto-converted).
                </p>
                <p className="text-xs text-muted-foreground mt-1">Min 1 USDC. Max 10,000 USDC. {feePercentage}% platform fee applies.</p>
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


