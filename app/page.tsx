"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Icon } from "@iconify/react";
import { Cursor } from "@/components/cursor";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  hero,
  features,
  howItWorks,
  roomCategories,
  testimonials,
  faqs,
} from "@/app/data/home";
import { HeroChatMockup } from "@/components/hero-chat-mockup";
import { StatsBar } from "@/components/stats-bar";
import { InteractiveDemo } from "@/components/interactive-demo";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { PricingSection } from "@/components/pricing-section";
import { ComparisonTable } from "@/components/comparison-table";
import { CommunitySpotlight } from "@/components/community-spotlight";
import { MobileAppSection } from "@/components/mobile-app-section";
import { TrustSafetySection } from "@/components/trust-safety";
import { NewsletterSection } from "@/components/newsletter-section";

// ─── Animation helpers ──────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const initial = {
    opacity: 0,
    y: direction === "up" ? 28 : 0,
    x: direction === "left" ? -28 : direction === "right" ? 28 : 0,
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main className="bg-background relative min-h-svh overflow-hidden selection:bg-primary/20 selection:text-primary">
      <Cursor />
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute -top-32 -left-64 h-[50rem] w-[50rem] rounded-full bg-primary/8 blur-[120px]" />
        <div className="pointer-events-none absolute top-64 -right-64 h-[40rem] w-[40rem] rounded-full bg-secondary/10 blur-[120px]" />
        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/25 shadow-[0_0_20px_rgba(0,0,0,0.05)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {hero.badge}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {hero.heading[0]}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-muted-foreground">
                {hero.heading[1]}
              </span>
              <br />
              {hero.heading[2]}
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              {hero.subheading}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href={hero.primaryCta.href}
                data-cursor="hover"
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_50px_-10px_rgba(0,0,0,0.4)] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {hero.primaryCta.label}
                  <Icon icon="solar:arrow-right-bold" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0 rounded-full" />
              </Link>

              <Link
                href={hero.secondaryCta.href}
                data-cursor="hover"
                className="inline-flex h-14 items-center justify-center rounded-full border-2 border-border/60 bg-background/50 px-8 text-base font-semibold backdrop-blur-md transition-all hover:scale-105 hover:border-border hover:bg-muted/80 active:scale-95"
              >
                {hero.secondaryCta.label}
              </Link>

              <Link
                href={hero.ghostCta.href}
                className="h-14 inline-flex items-center justify-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground underline-offset-4 hover:underline decoration-primary/50 px-2"
              >
                {hero.ghostCta.label}
              </Link>
            </motion.div>

            {/* Chat UI Mockup */}
            <HeroChatMockup />
          </div>
        </div>
      </section>

      <StatsBar />

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <FadeIn className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Everything you need</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Built for communities,<br />loved by individuals.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From text to HD video — AlloChat is built around one simple promise: make human connection effortless.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border/40 bg-card/40 p-7 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:border-border/80 hover:shadow-xl hover:shadow-black/10 md:p-8`}
                  data-cursor="hover"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  <div className={`relative z-10 w-fit rounded-2xl bg-background p-3.5 ring-1 ring-border/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${f.accent} group-hover:ring-current/30`}>
                    <Icon icon={f.icon} className="size-7" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{f.description}</p>
                  </div>
                  <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <InteractiveDemo />

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/30 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <FadeIn className="text-center mb-16 max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Up and running in minutes</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps stand between you and your new favourite community.
            </p>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.12} direction="up">
                <div className="relative flex flex-col gap-5 rounded-3xl border border-border/40 bg-card/60 p-8 shadow-sm backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-black text-border/50 leading-none select-none">{step.step}</span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon icon={step.icon} className="size-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden text-muted-foreground/30 sm:block">
                      <Icon icon="solar:alt-arrow-right-bold" className="size-6" />
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="mt-10 text-center">
            <Link
              href="/sign-up"
              data-cursor="hover"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-10 text-base font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95"
            >
              Get Started — It&apos;s Free
              <Icon icon="solar:arrow-right-bold" className="size-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── ROOMS ────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[30rem] w-[60rem] rounded-full bg-primary/5 blur-[100px]" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Thousands of rooms</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Find your people</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
              Whatever you&apos;re into, there&apos;s a room for it. Browse and join instantly.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
            {roomCategories.map((room, i) => (
              <FadeIn key={room.label} delay={i * 0.06}>
                <Link
                  href="/lobby"
                  data-cursor="hover"
                  className="group flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/50 p-5 transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 active:scale-95"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all group-hover:scale-110">
                      <Icon icon={room.icon} className="size-5" />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{room.users} online</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{room.label}</p>
                </Link>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="mt-10 text-center">
            <Link href="/lobby" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 decoration-primary/50 transition-colors">
              Browse all rooms
              <Icon icon="solar:arrow-right-bold" className="size-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      <LeaderboardPreview />
      <PricingSection />
      <ComparisonTable />
      <CommunitySpotlight />

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-muted/30 border-y border-border/40">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Loved by our community</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">What people are saying</h2>
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <FadeIn key={t.author} delay={i * 0.12}>
                <div className="flex flex-col gap-5 rounded-3xl border border-border/40 bg-card/60 p-8 backdrop-blur-md shadow-sm h-full">
                  <div className="flex text-primary gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Icon key={j} icon="solar:star-bold" className="size-4" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold ring-1 ring-primary/20">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <MobileAppSection />
      <TrustSafetySection />

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8 lg:px-12">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Got questions?</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Frequently asked</h2>
          </FadeIn>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FaqItem key={faq.question} q={faq.question} a={faq.answer} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />

      {/* ── CTA BAND ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
          <FadeIn>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
              Ready to find your tribe?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join thousands of people already building connections on AlloChat. Free forever, no credit card needed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/sign-up"
                data-cursor="hover"
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-10 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95"
              >
                Start for Free
                <Icon icon="solar:arrow-right-bold" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="inline-flex h-14 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline decoration-primary/50">
                Learn more about us →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ─── FAQ Accordion Item ──────────────────────────────────────────────────────
function FaqItem({ q, a, delay }: { q: string; a: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.details
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, delay }}
      className="group rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md open:bg-card/70 transition-colors"
    >
      <summary className="flex cursor-pointer select-none items-center justify-between gap-4 p-5 text-sm font-semibold text-foreground marker:content-none list-none">
        {q}
        <Icon
          icon="solar:alt-arrow-down-bold"
          className="size-4 text-muted-foreground transition-transform group-open:rotate-180 shrink-0"
        />
      </summary>
      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </motion.details>
  );
}
