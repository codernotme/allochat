"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { homeData } from "@/app/data/home";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export function AnimatedHero() {
  const { hero } = homeData;

  return (
    <motion.div 
      className="flex flex-col gap-6 relative z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <p className="text-primary text-xs md:text-sm font-bold uppercase tracking-widest backdrop-blur-md inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 ring-1 ring-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {hero.badge}
        </p>
      </motion.div>
      
      <motion.h1 
        variants={itemVariants} 
        className="text-foreground text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70"
      >
        Real-time chat,
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary">rooms</span>, and calls 
        <br />
        in one place.
      </motion.h1>

      <motion.p variants={itemVariants} className="text-muted-foreground max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
        {hero.description}
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mt-4">
        <Link data-cursor="hover" href={hero.primaryButton.href} className="group relative bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-14 items-center justify-center rounded-full px-8 text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] overflow-hidden">
          <span className="relative z-10 flex items-center gap-2">
            {hero.primaryButton.text}
            <svg xmlns="http://www.w3.org/20oda/chat/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform group-hover:translate-y-0 duration-300 rounded-full" />
        </Link>
        
        <Link data-cursor="hover" href={hero.secondaryButton.href} className="border-border/60 bg-background/50 backdrop-blur-md hover:bg-muted/80 hover:border-border inline-flex h-14 items-center justify-center rounded-full border-2 px-8 text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm">
          {hero.secondaryButton.text}
        </Link>
        
        <Link data-cursor="hover" href={hero.tertiaryButton.href} className="text-muted-foreground hover:text-foreground inline-flex h-14 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors hover:underline underline-offset-4 decoration-primary/50">
          {hero.tertiaryButton.text}
        </Link>
      </motion.div>
    </motion.div>
  );
}
