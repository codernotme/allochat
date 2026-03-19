"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";

export function MobileAppSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Available everywhere</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
              Take your conversations anywhere.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Stay connected even when you step away from your computer. The AlloChat mobile experience delivers everything you love about the platform in your pocket.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-medium shadow-sm">
                 Push notifications
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-medium shadow-sm">
                 Dark mode
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-medium shadow-sm">
                 Offline messages
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-medium shadow-sm">
                 Widgets
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl border border-border/40 bg-card/60 shadow-lg backdrop-blur-md w-fit">
              <div className="flex gap-4">
                <button className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-xl bg-foreground px-6 text-background transition-transform hover:scale-105 active:scale-95">
                  <Icon icon="bi:apple" className="size-6" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-semibold opacity-80">Download on the</span>
                    <span className="text-sm font-bold">App Store</span>
                  </div>
                  <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0 rounded-xl" />
                </button>
                <button className="group relative flex h-14 items-center justify-center gap-3 overflow-hidden rounded-xl bg-foreground px-6 text-background transition-transform hover:scale-105 active:scale-95">
                  <Icon icon="bi:google-play" className="size-6" />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-semibold opacity-80">GET IT ON</span>
                    <span className="text-sm font-bold">Google Play</span>
                  </div>
                  <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0 rounded-xl" />
                </button>
              </div>

              <div className="hidden sm:block h-12 w-px bg-border/50"></div>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2 text-black align-middle border-4 border-primary/20">
                  <Icon icon="mingcute:qrcode-2-line" className="size-full" />
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-bold text-foreground">Scan to download</span>
                  <span className="text-xs text-muted-foreground">iOS & Android</span>
                </div>
              </div>
            </div>

          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-primary/20 blur-[100px] rounded-full point-events-none" />
            
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 hidden sm:block w-[240px] h-[500px] rounded-[3rem] border-[8px] border-border/50 bg-background shadow-2xl overflow-hidden -right-10 top-10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-3xl z-20"></div>
              {/* Fake UI */}
              <div className="h-full w-full bg-black/50 p-4 pt-10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/40 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 bg-muted rounded-full"></div>
                    <div className="h-2 w-3/4 bg-muted/50 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 bg-muted/20 rounded-2xl p-4 flex flex-col gap-3 justify-end">
                   <div className="flex items-end gap-2">
                     <div className="h-8 w-8 rounded-full bg-primary/40"></div>
                     <div className="h-10 w-3/4 bg-muted rounded-2xl rounded-bl-sm"></div>
                   </div>
                   <div className="flex items-end gap-2 justify-end">
                     <div className="h-10 w-2/3 bg-primary rounded-xl rounded-br-sm"></div>
                   </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="relative z-20 w-[240px] sm:w-[260px] h-[520px] rounded-[3rem] border-[8px] border-foreground/20 bg-card shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-black rounded-b-3xl z-20"></div>
              {/* Fake UI */}
              <div className="h-full w-full bg-background flex flex-col">
                <div className="bg-primary/10 h-32 flex flex-col justify-end p-4">
                  <h3 className="text-xl font-bold">Gaming Lounge</h3>
                  <span className="text-xs text-primary font-bold">2.4K Online</span>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
                  <div className="self-start bg-muted p-3 w-3/4 rounded-2xl rounded-tl-sm shadow-sm border border-border/40">
                    <div className="h-2 w-1/2 bg-foreground/20 rounded-full mb-2"></div>
                    <div className="h-2 w-full bg-foreground/10 rounded-full mb-1"></div>
                    <div className="h-2 w-3/4 bg-foreground/10 rounded-full"></div>
                  </div>
                  <div className="self-end bg-primary p-3 w-2/3 rounded-xl rounded-tr-sm shadow-sm relative">
                    <div className="absolute -bottom-2 -left-2 bg-background border border-border p-1 rounded-full text-[10px]">🔥</div>
                    <div className="h-2 w-full bg-primary-foreground/40 rounded-full mb-1"></div>
                    <div className="h-2 w-1/2 bg-primary-foreground/40 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
