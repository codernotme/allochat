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
    <div className="from-background via-background/95 to-primary/5 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-6 relative overflow-hidden">
      {/* Animated background blobs - enhanced for premium feel */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/20 animate-blob absolute -top-40 -left-20 h-[30rem] w-[30rem] rounded-full blur-[100px] opacity-60" />
        <div className="animation-delay-2000 bg-blue-500/10 animate-blob absolute top-20 -right-20 h-[25rem] w-[25rem] rounded-full blur-[100px] opacity-50" />
        <div className="animation-delay-4000 bg-purple-500/10 animate-blob absolute -bottom-20 left-1/3 h-[35rem] w-[35rem] rounded-full blur-[100px] opacity-40" />
      </div>

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* AlloChat branding */}
      <div className="relative z-10 mb-10 flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-2 bg-primary/20 rounded-3xl blur-xl group-hover:bg-primary/30 transition-all duration-500" />
          <div className="bg-primary relative flex size-16 items-center justify-center rounded-2xl text-4xl shadow-2xl shadow-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon icon="solar:chat-round-bold-duotone" className="size-10 text-primary-foreground" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-foreground text-3xl font-black tracking-tight mb-1">AlloChat</h1>
          <p className="text-muted-foreground font-medium text-sm tracking-wide uppercase opacity-70">Connect • Chat • Call</p>
        </div>
      </div>

      {/* Card content - Premium Glassmorphism */}
      <div className="border-border/40 bg-card/40 relative z-10 w-full max-w-md rounded-[2rem] border p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] backdrop-blur-3xl ring-1 ring-white/10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        {children}
      </div>

      {/* Footer */}
      <p className="text-muted-foreground/60 relative z-10 mt-8 text-center text-xs font-medium">
        By continuing you agree to our{' '}
        <a href="/terms" className="text-primary/80 hover:text-primary transition-colors hover:underline">
          Terms
        </a>{' '}
        &amp;{' '}
        <a href="/privacy" className="text-primary/80 hover:text-primary transition-colors hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
