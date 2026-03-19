"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <section className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border/40 bg-card/40 p-10 text-center shadow-sm backdrop-blur-md sm:p-14 relative overflow-hidden">
          
          <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-secondary/10 blur-[80px]" />

          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Stay in the loop.</h2>
            <p className="mt-4 text-base text-muted-foreground">
              Get updates on new features, room spotlights, and community events.
            </p>

            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row shadow-sm">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={status !== "idle"}
                className="min-w-0 flex-auto rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                disabled={status !== "idle"}
                className="flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 active:scale-95"
              >
                {status === "idle" && "Subscribe"}
                {status === "loading" && <Icon icon="line-md:loading-twotone-loop" className="size-5" />}
                {status === "success" && <Icon icon="solar:check-circle-bold" className="size-5 mr-2" />}
                {status === "success" && "Subscribed!"}
              </button>
            </form>
            
            <p className="mt-4 text-xs font-medium text-muted-foreground">
              No spam. Unsubscribe anytime. We respect your inbox.
              <span className="block mt-1 sm:inline sm:mt-0 sm:ml-2 text-foreground/70 border sm:border-l sm:pl-2 border-transparent">
                 🟢 Join 8,400 subscribers
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
