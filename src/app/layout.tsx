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
  description: "Turn any URL, image, or text into a digital product. Instant payouts in USDC/ETH on Base.",
  keywords: ["Base", "Crypto Payment Link", "Telegram Paywall", "Consulting Deposit", "USDC Payment", "Monetize Links", "Ethereum", "L2"],
  authors: [{ name: "JustUnlock Team" }],
  creator: "JustUnlock",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://justunlock.link",
    title: "JustUnlock | Monetize Any Link with Crypto",
    description: "Turn any URL, image, or text into a digital product. Instant payouts in USDC/ETH on Base.",
    siteName: "JustUnlock",
    images: [
      {
        url: "/og-image.png", // We should ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "JustUnlock - Pay-to-Reveal Links",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JustUnlock | Monetize Any Link with Crypto",
    description: "Turn any URL, image, or text into a digital product. Instant payouts in USDC/ETH on Base.",
    creator: "@justunlock", // Placeholder
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
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </div>
          </ThemeProvider>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
