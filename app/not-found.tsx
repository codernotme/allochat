'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="from-background via-background to-primary/5 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-40 -left-20 h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-[100px] opacity-60 animate-pulse" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-[30rem] w-[30rem] rounded-full bg-secondary/10 blur-[100px] opacity-40 animate-pulse [animation-delay:2s]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg gap-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.5 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, type: "spring" }}
           className="relative"
        >
          <div className="absolute inset-x-0 bottom-0 h-4 bg-primary/20 blur-xl rounded-full" />
          <span className="text-[10rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50 select-none">
            404
          </span>
        </motion.div>

        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Lost in Space?
          </h2>
          <p className="text-muted-foreground font-medium text-lg leading-relaxed">
            The page you are looking for has been moved to another dimension or simply doesn't exist anymore.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/" 
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full h-14 px-10 text-lg font-extrabold shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            )}
          >
            <Icon icon="solar:home-2-bold-duotone" className="size-6" />
            Beam Me Home
          </Link>
        </motion.div>
      </div>

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  );
}
