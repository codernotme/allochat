import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Icon } from '@iconify/react';

export const metadata: Metadata = {
  title: {
    default: 'Sign In',
    template: '%s | AlloChat',
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="from-background via-background to-muted/30 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-4">
      {/* Animated background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/10 animate-blob absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="animation-delay-2000 bg-secondary/10 animate-blob absolute top-40 -right-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="animation-delay-4000 bg-accent/10 animate-blob absolute bottom-0 left-1/2 h-96 w-96 rounded-full blur-3xl" />
      </div>

      {/* AlloChat branding */}
      <div className="relative z-10 mb-8 flex flex-col items-center gap-2">
        <div className="bg-primary flex size-14 items-center justify-center rounded-2xl text-3xl shadow-lg">
          <Icon icon="solar:chat-round-bold-duotone" className="size-8 text-primary-foreground" />
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">AlloChat</h1>
        <p className="text-muted-foreground text-sm">Connect. Chat. Call.</p>
      </div>

      {/* Card content */}
      <div className="border-border/50 bg-background/80 relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-2xl backdrop-blur-xl">
        {children}
      </div>

      {/* Footer */}
      <p className="text-muted-foreground relative z-10 mt-6 text-center text-xs">
        By continuing you agree to our{' '}
        <a href="/terms" className="text-primary hover:underline">
          Terms
        </a>{' '}
        &amp;{' '}
        <a href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
