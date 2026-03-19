"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { pricing } from "@/app/data/home";
import { cn } from "@/lib/utils";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Simple pricing</p>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Free vs Pro</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            AlloChat is free forever. Upgrade to Pro for HD video and advanced community tools.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="relative flex items-center p-1 bg-muted/50 rounded-full border border-border/40">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn("relative z-10 px-6 py-2 text-sm font-semibold transition-colors", !isAnnual ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn("relative z-10 px-6 py-2 text-sm font-semibold transition-colors", isAnnual ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Annually <span className="ml-1 text-xs text-primary font-bold">(Save 30%)</span>
            </button>
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-y-1 w-[calc(50%-4px)] bg-background rounded-full shadow-sm"
              style={{ left: isAnnual ? "calc(50% + 2px)" : "4px" }}
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Card */}
          <div className="relative flex flex-col rounded-3xl border border-border/40 bg-card/40 p-8 shadow-sm backdrop-blur-md">
            <h3 className="text-2xl font-bold">{pricing.free.name}</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              $0
              <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Great for individuals and small groups.</p>
            
            <ul className="mt-8 space-y-4 flex-1">
              {pricing.free.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary">
                    <Icon icon="solar:check-read-bold" className="size-3" />
                  </div>
                  <span className="text-sm text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="mt-8 w-full rounded-full border border-border/60 bg-background/50 py-3.5 text-sm font-bold shadow-sm transition-all hover:bg-muted active:scale-95">
              Get Started Free
            </button>
          </div>

          {/* Pro Card */}
          <div className="relative flex flex-col rounded-3xl border border-primary/50 bg-card/60 p-8 shadow-2xl shadow-primary/10 backdrop-blur-md">
            <div className="absolute top-0 right-8 -translate-y-1/2">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground uppercase tracking-widest shadow-lg shadow-primary/20">
                Most Popular
              </span>
            </div>
            <div className="absolute -z-10 inset-0 rounded-3xl bg-gradient-to-b from-primary/5 to-transparent blur-xl" />
            
            <h3 className="text-2xl font-bold">{pricing.pro.name}</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold text-foreground">
              {isAnnual ? "₹139" : pricing.pro.price}
              <span className="ml-1 text-xl font-medium text-muted-foreground">{pricing.pro.period}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">For serious creators and large communities.</p>
            
            <ul className="mt-8 space-y-4 flex-1">
              {pricing.pro.features.map((feature, i) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 flex items-center justify-center size-5 rounded-full bg-primary/20 text-primary">
                    <Icon icon="solar:star-bold" className="size-3 lg:size-4" />
                  </div>
                  <span className={cn("text-sm", i === 0 ? "text-primary font-medium" : "text-foreground/90")}>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="mt-8 w-full rounded-full bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95">
              Go Pro Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
