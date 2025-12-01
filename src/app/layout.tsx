import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://justunlock.link'),
  title: {
    default: "JustUnlock | Monetize Any Link with Crypto",
    template: "%s | JustUnlock"
  },
  // This is read by humans on Google & Twitter. It must encourage clicking:
  description: "The simplest Gumroad alternative for crypto. Turn any URL, Telegram invite, or file into a digital product. Instant payouts in USDC/ETH on Base. No sign-ups.",

  // Your keyword list (Technically integrated):
  keywords: [
    "Base", "Crypto Payment Link", "Telegram Paywall", "Consulting Deposit",
    "USDC Payment", "Monetize Links", "Ethereum", "L2",
    "Gumroad alternative", "Token gating", "Sell files crypto", "No KYC paywall"
  ],
  authors: [{ name: "JustUnlock Team" }],
  creator: "JustUnlock",

  // Social Media Preview (Facebook, Discord, LinkedIn, WhatsApp)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://justunlock.link",
    title: "JustUnlock | Monetize Any Link with Crypto",
    description: "Turn any URL, image, or text into a digital product. Instant payouts in USDC/ETH on Base.",
    siteName: "JustUnlock",
    images: [
      {
        url: "/og-image.png", // The image must be in the public folder
        width: 1200,
        height: 630,
        alt: "JustUnlock - Pay-to-Reveal Links",
      },
    ],
  },

  // Twitter / X Preview
  twitter: {
    card: "summary_large_image",
    title: "JustUnlock | Monetize Any Link with Crypto",
    description: "Turn any URL, image, or text into a digital product. Instant payouts in USDC/ETH on Base.",
    // creator: "@your_twitter_handle", // If you don't have one, delete this line
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </div>
          </Providers>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
