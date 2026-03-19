"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { trustSafety } from "@/app/data/home";

export function TrustSafetySection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[50rem] w-[50rem] rounded-full bg-green-500/5 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-3">Trust & Safety</p>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Your safety is our first feature.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We built AlloChat with privacy and security at its core. From encryption to human moderation, we&apos;ve got your back.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustSafety.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-card/30 p-8 text-center backdrop-blur-sm sm:text-left shadow-sm hover:border-green-500/30 transition-colors"
            >
              <div className="mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 ring-1 ring-green-500/20 sm:mx-0">
                <Icon icon={item.icon} className="size-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-muted-foreground opacity-80"
        >
          <span className="flex items-center gap-2">
            <Icon icon="solar:shield-check-bold" className="size-4" /> SSL Secured
          </span>
          <span className="flex items-center gap-2">
            <Icon icon="solar:shield-check-bold" className="size-4" /> GDPR Compliant
          </span>
          <span className="flex items-center gap-2">
            <Icon icon="solar:shield-check-bold" className="size-4" /> SOC 2 Ready
          </span>
        </motion.div>
      </div>
    </section>
  );
}
