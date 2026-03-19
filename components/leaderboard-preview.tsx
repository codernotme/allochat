"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Icon } from "@iconify/react";
import { leaderboardPreview } from "@/app/data/home";

export function LeaderboardPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background">
      {/* Background glow */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-primary/5 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Gamification</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
              Climb the ranks.<br />Become a legend.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every message, every call, every reaction earns you XP. Level up to unlock exclusive badges, custom colors, and priority features in your favorite rooms.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-medium shadow-sm">
                🔥 Streak
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-medium shadow-sm">
                💎 Elite
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-medium shadow-sm">
                🎤 Speaker
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-medium shadow-sm">
                ✍️ Scribe
              </span>
            </div>
          </div>

          {/* Leaderboard UI Mockup */}
          <div className="order-1 lg:order-2 relative" ref={ref}>
            <div className="relative rounded-3xl border border-border/40 bg-card/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="solar:cup-star-bold" className="text-yellow-500 size-5" />
                  Global Rankings
                </h3>
                <span className="text-sm font-medium text-muted-foreground">Season 4</span>
              </div>

              <div className="space-y-4">
                {leaderboardPreview.map((user, i) => {
                  const maxXP = 13000;
                  const currentXP = parseInt(user.xp.replace(/[^0-9]/g, ""));
                  const fillPercentage = (currentXP / maxXP) * 100;

                  return (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="group relative flex items-center gap-4 rounded-2xl border border-transparent p-3 hover:bg-muted/50 hover:border-border/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-6 text-sm font-bold text-muted-foreground">
                        {user.rank <= 3 ? (
                          <Icon icon="solar:medal-star-bold" className={`size-6 ${user.rank === 1 ? "text-yellow-500" : user.rank === 2 ? "text-slate-400" : "text-amber-700"}`} />
                        ) : (
                          `#${user.rank}`
                        )}
                      </div>
                      
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold ring-1 ring-primary/20 ${user.color}`}>
                        {user.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate">{user.name}</span>
                            <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                              Lv.{user.level}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-medium text-muted-foreground">{user.xp}</span>
                        </div>
                        {/* XP Bar */}
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${fillPercentage}%` } : {}}
                            transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                            className={`h-full rounded-full ${user.rank <= 3 ? "bg-gradient-to-r from-primary to-primary/60" : "bg-primary/40"}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between rounded-xl bg-primary/5 p-4 border border-primary/10">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Your rank:</span>
                  <span className="text-xs text-muted-foreground">Join to find out</span>
                </div>
                <button className="text-sm font-bold text-primary hover:underline underline-offset-2">Sign In →</button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
