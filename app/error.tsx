'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="from-background via-background to-destructive/5 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-40 -left-20 h-[30rem] w-[30rem] rounded-full bg-destructive/10 blur-[100px] opacity-40 animate-pulse" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px] opacity-30 animate-pulse [animation-delay:2s]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative"
        >
          <div className="bg-destructive/10 flex size-24 items-center justify-center rounded-[2rem] shadow-2xl ring-1 ring-destructive/20 transition-transform hover:scale-110">
            <Icon icon="solar:danger-bold-duotone" className="size-12 text-destructive" />
          </div>
        </motion.div>

        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            System Overload
          </h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            Something went wrong while processing your request. Don't worry, our engineers have been notified.
          </p>
          {error.digest && (
            <p className="inline-flex self-center px-3 py-1 bg-destructive/5 rounded-full text-xs font-mono text-destructive/70 border border-destructive/10">
              ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            onClick={() => reset()}
            size="lg"
            variant="default"
            className="rounded-full h-14 px-10 text-lg font-extrabold shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Icon icon="solar:refresh-bold-duotone" className="mr-2 size-6" />
            Try Again
          </Button>
          <a
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full h-14 px-10 text-lg font-bold backdrop-blur-xl hover:bg-card/80 transition-all border-border/40"
            )}
          >
            Go Home
          </a>
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  );
}
