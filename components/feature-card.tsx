"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/50 flex flex-col items-start gap-5 rounded-3xl border p-7 shadow-lg shadow-black/5 transition-all duration-300 sm:p-8"
      data-cursor="hover"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative z-10 bg-background/80 text-primary rounded-2xl p-3.5 ring-1 ring-border/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:ring-primary/40 group-hover:bg-primary/10 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]">
        <Icon icon={icon} className="size-7" />
      </div>
      
      <div className="relative z-10 mt-2">
        <h3 className="text-foreground text-xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">{description}</p>
      </div>
      
      {/* Decorative background glow */}
      <div className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none" />
    </motion.div>
  );
}
