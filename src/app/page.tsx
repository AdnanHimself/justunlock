
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSignMessage, useReadContract } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Link as LinkIcon, Copy, Upload, Check, Zap, Shield, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { UseCaseCard } from "@/components/UseCaseCard";

// Required Imports for this file:
// - React: useState, useEffect
// - Wagmi: useAccount, useSignMessage, useReadContract
// - RainbowKit: useConnectModal
// - Lucide React: Link, Copy, Upload, Check, Zap, Shield
// - UI Components: Button, Toast, UseCaseCard



// V3 Contract Address (Base Mainnet)
// This contract handles the fee collection and payment routing
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
  const { openConnectModal } = useConnectModal();

  // State for form inputs
  const [targetUrl, setTargetUrl] = useState('');
  const [contentType, setContentType] = useState<'url' | 'text' | 'file'>('url');
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(false);

  // Read fee from contract
  const { data: feeBasisPoints } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: FEE_ABI,
    functionName: 'feeBasisPoints',
  });



  // Helper to generate a random 6-character slug for the link
  const generateSlug = (type: 'url' | 'text' | 'file') => {
    let prefix = 'link';
    if (type === 'text') prefix = 'txt';
    if (type === 'file') {
      if (file?.type.startsWith('image/')) prefix = 'img';
      else if (file?.type === 'application/pdf') prefix = 'pdf';
      else if (file?.type === 'text/plain') prefix = 'txt';
      else prefix = 'file';
    }
    return `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
  };

  // Effect to auto-submit the form after the user connects their wallet
  // This improves UX by not requiring the user to click "Create" again
  useEffect(() => {
    if (isConnected && pendingSubmission && address) {
      submitForm();
      setPendingSubmission(false);
    }
  }, [isConnected, pendingSubmission, address]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // If wallet is not connected, prompt connection and set pending state
    if (!isConnected) {
      setPendingSubmission(true);
      if (openConnectModal) {
        openConnectModal();
      } else {
        showToast('Please connect your wallet', 'error');
      }
      return;
    }

    await submitForm();
  }

  const submitForm = async () => {
    if (!address) return;

    setLoading(true);
    setLoading(true);
    const slug = generateSlug(contentType);

    try {
      // 1. Sign Message for Security (DoS Protection)
      // We require a signature to prove ownership of the wallet creating the link
      const message = `Create Lock: ${slug}`;
      const signature = await signMessageAsync({ message });

      let body;
      const headers: Record<string, string> = {
        'x-signature': signature,
        'x-address': address,
      };

      // 2. Prepare Request Body
      // Use FormData for file uploads, JSON for text/url
      if (contentType === 'file' && file) {
        const formData = new FormData();
        formData.append('slug', slug);
        formData.append('title', title || '');
        formData.append('price', price);
        formData.append('receiver_address', address);
        const isImage = file.type.startsWith('image/');
        let typeStr = 'file';
        if (isImage) typeStr = 'image';

        formData.append('content_type', typeStr);
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

      // 3. Call API to create link and store secret
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: headers,
        body: body,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create link');

      // 4. Success: Show the created link
      setCreatedLink(`${window.location.origin}/${slug}`);
      showToast('Link created successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to create link', 'error');
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'JustUnlock',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Turn any URL, file, or text into a digital product. The fastest way to sell content for USDC or ETH on Base.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '120',
    },
    image: 'https://justunlock.link/og-image.png',
  };

  return (
    <main className="min-h-[calc(100vh-7rem)] flex flex-col items-center justify-start pt-8 md:pt-16 p-4 bg-background text-foreground transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full max-w-5xl space-y-8 py-4">
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">

          {/* Hero Section */}
          <div className="space-y-4 max-w-4xl mx-auto text-center pt-4 md:pt-8">
            <h1 className="text-3xl md:text-[3.5rem] font-bold tracking-tight text-foreground pb-1 leading-tight">
              Make Any Link <span className="bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400 bg-clip-text text-transparent">Pay.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Turn any URL or file into a secure crypto paywall.
            </p>
          </div>

          {/* Creation Form (Always Visible) */}
          {createdLink ? (
            <div className="max-w-md mx-auto bg-card border border-border rounded-3xl p-8 space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Link Created!</h3>
                <p className="text-muted-foreground">Your paywall is ready. Share it to start earning.</p>
              </div>

              <div className="flex items-center gap-2 bg-secondary/30 p-4 rounded-2xl border border-border group hover:border-primary/50 transition-colors">
                <LinkIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <input
                  readOnly
                  value={createdLink}
                  className="bg-transparent flex-1 text-base outline-none text-foreground font-medium"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-background rounded-xl transition-all"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-foreground" />}
                </button>
              </div>

              <Button
                variant="gold"
                className="w-full h-12 text-base rounded-xl"
                onClick={() => {
                  setCreatedLink(null);
                  setTargetUrl('');
                  setPrice('');
                  setTitle('');
                }}
              >
                Create Another Link
              </Button>
            </div>
          ) : (
            <div className="max-w-lg mx-auto space-y-6">

              <form id="create-link-form" onSubmit={handleCreate} className="bg-card/50 backdrop-blur-sm border border-border/80 rounded-3xl p-5 md:p-6 space-y-6">

                {/* Content Type Tabs */}
                <div className="flex p-1.5 bg-secondary/50 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setContentType('url')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${contentType === 'url'
                      ? 'bg-background text-foreground ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }`}
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('text')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${contentType === 'text'
                      ? 'bg-background text-foreground ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }`}
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('file')}
                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${contentType === 'file'
                      ? 'bg-background text-foreground ring-1 ring-black/5 dark:ring-white/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      }`}
                  >
                    File
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground ml-1 mb-2 block">
                    {contentType === 'url' ? 'Paste your URL' : contentType === 'text' ? 'Enter Secret Content' : 'Upload File'}
                  </label>
                  {contentType === 'url' ? (
                    <div className="relative group">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="url"
                        placeholder="https://..."
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-background border-2 border-border/80 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
                        required
                      />
                    </div>
                  ) : contentType === 'text' ? (
                    <div className="relative group space-y-2">
                      <textarea
                        placeholder="Enter secret text, passwords, or exclusive content..."
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="w-full p-4 bg-background border-2 border-border/80 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all min-h-[140px] font-mono text-base resize-none"
                        required
                      />
                      {targetUrl.match(/^https?:\/\//) && (
                        <p className="text-xs text-yellow-500 font-medium flex items-center gap-1">
                          ⚠️ Looks like a URL. Use the &quot;Link&quot; tab instead if you want to redirect users.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className={`border-2 border-dashed ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'} rounded-2xl p-8 text-center hover:bg-secondary/30 transition-all cursor-pointer relative group-hover:scale-[1.01] duration-200`}>
                        <input
                          type="file"
                          accept="image/*,application/pdf,text/plain"
                          onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (selectedFile) {
                              if (selectedFile.size > 4 * 1024 * 1024) {
                                showToast('File size exceeds 4MB limit', 'error');
                                e.target.value = ''; // Clear input
                                setFile(null);
                              } else {
                                setFile(selectedFile);
                              }
                            } else {
                              setFile(null);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          required
                        />
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                          {file ? (
                            <div className="space-y-2">
                              {file.type.startsWith('image/') ? (
                                <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border border-border shadow-sm">
                                  <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                              ) : file.type === 'application/pdf' ? (
                                <div className="w-16 h-16 mx-auto bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                                  <span className="text-xs font-bold">PDF</span>
                                </div>
                              ) : (
                                <div className="w-16 h-16 mx-auto bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                                  <span className="text-xs font-bold">TXT</span>
                                </div>
                              )}
                              <div className="space-y-1">
                                <span className="text-base font-medium text-foreground block truncate max-w-[200px]">
                                  {file.name}
                                </span>
                                <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                              <p className="text-xs text-primary font-medium">Click to change file</p>
                            </div>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Upload className="w-6 h-6" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-base font-medium text-foreground block">
                                  Click to upload file
                                </span>
                                <span className="text-xs text-muted-foreground">Max 4MB (Images, PDF, TXT)</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground ml-1 mb-2 block">Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. My Exclusive Guide"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-background border-2 border-border/80 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-foreground ml-1 mb-2 block">Set Price (USDC)</label>

                  <div className="relative group">
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max="10000"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-background border-2 border-border/80 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-lg font-semibold"
                      required
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">$</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading}
                  variant="high-contrast"
                  className="w-full h-12 text-base font-bold rounded-2xl transition-all"
                  icon={loading ? undefined : <Unlock className="w-5 h-5 text-red-500" />}
                >
                  {isConnected ? 'Create Paywall' : 'Create Paywall'}
                </Button>

                {/* Trust Signals */}
                <div className="pt-2 flex flex-col items-center gap-4">
                  <p className="text-sm text-muted-foreground">No signup required</p>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground/80">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>Instant payout</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>Accept any crypto</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      <span>1% Fee</span>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          )}

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
              <h2 className="text-3xl font-bold">What can you sell with JustUnlock?</h2>
              <p className="text-muted-foreground text-lg">Perfect for micro-transactions and time-sensitive value.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-left">
              <UseCaseCard
                icon="💬"
                title="Telegram & Discord"
                description="Gate your community invite links. Filter out bots and verify supporters with a small fee."
              />
              <UseCaseCard
                icon="📅"
                title="Calendly Links"
                description="Charge for your time. Lock your booking link so only serious clients can schedule a call."
              />
              <UseCaseCard
                icon="💎"
                title="Token CAs"
                description="Launching a coin? Lock the Contract Address to prevent sniper bots and ensure fair entry."
              />
              <UseCaseCard
                icon="📝"
                title="Notion Templates"
                description="Sell your productivity systems. Lock the template link and get paid instantly in crypto."
              />
              <UseCaseCard
                icon="🚀"
                title="Exclusive Alpha"
                description="Sell time-sensitive trading insights or market analysis. The value is in the speed."
              />
              <UseCaseCard
                icon="🎨"
                title="Digital Assets"
                description="Sell presets, ebooks, or design files. Upload directly or link to your cloud storage."
              />
            </div>
          </div>

          {/* Philosophy / Reality Check */}
          <div className="py-12 bg-card border border-border rounded-3xl p-8 md:p-12 text-left">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold">Built for Speed, Not Bureaucracy.</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                JustUnlock is designed as a digital cash register, not a bank vault. It is the fastest way to facilitate honest exchanges between you and your audience.
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
      </div>
    </main>
  );
}


