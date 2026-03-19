import type { Metadata } from 'next';
import { Figtree, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { AnalyticsCookieSync } from '@/components/analytics-cookie-sync';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { ConvexClientProvider } from '@/lib/convex';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'AlloChat — Real-Time Chat & Calling Platform',
    template: '%s | AlloChat',
  },
  description:
    'AlloChat — A modern, real-time global chat and calling platform. Connect with friends, join rooms, and chat in HD.',
  keywords: ['chat', 'calling', 'rooms', 'real-time', 'video', 'voice'],
  authors: [{ name: 'AlloChat Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://allochat.app',
    siteName: 'AlloChat',
    title: 'AlloChat — Real-Time Chat & Calling',
    description: 'Connect, chat, and call with anyone, anywhere.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('antialiased', fontMono.variable, 'font-sans', figtree.variable)}
    >
      <body>
        <ConvexClientProvider>
          <ThemeProvider>
            <Suspense fallback={null}>
              <AnalyticsCookieSync />
            </Suspense>
            {children}
            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
