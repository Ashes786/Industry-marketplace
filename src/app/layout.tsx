import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "B2B Pakistan - Industrial Marketplace",
  description: "Pakistan's premier B2B industrial marketplace connecting buyers and sellers of raw materials, semi-finished goods, and industrial products.",
  keywords: ["B2B Pakistan", "industrial marketplace", "raw materials", "manufacturing", "suppliers", "buyers"],
  authors: [{ name: "B2B Pakistan Team" }],
  openGraph: {
    title: "B2B Pakistan - Industrial Marketplace",
    description: "Connect with trusted suppliers and buyers for industrial goods in Pakistan",
    url: "https://b2bpakistan.com",
    siteName: "B2B Pakistan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Pakistan - Industrial Marketplace",
    description: "Connect with trusted suppliers and buyers for industrial goods in Pakistan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
