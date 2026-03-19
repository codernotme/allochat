"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "chat", label: "Real-time Chat", icon: "solar:chat-round-line-bold" },
  { id: "video", label: "HD Video Call", icon: "solar:videocamera-record-bold" },
  { id: "leaderboard", label: "Live Leaderboard", icon: "solar:cup-star-bold" },
];

export function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="py-24 md:py-32 relative bg-background border-y border-border/40 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[50rem] rounded-full bg-primary/5 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Live Preview</p>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            See it in action
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience the tools that power the internet&apos;s best communities.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          
          {/* Tab Switcher */}
          <div className="flex flex-row overflow-x-auto lg:flex-col gap-2 pb-4 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-card text-foreground shadow-sm border border-border/50" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-glow"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon icon={tab.icon} className={cn("size-5", activeTab === tab.id ? "text-primary" : "")} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
            
            <button className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-primary border-dashed bg-primary/5 px-5 py-4 text-sm font-bold text-primary transition-all hover:bg-primary/10 shrink-0">
              Try Live Demo →
            </button>
          </div>

          {/* Interactive Mockup Frame */}
          <div className="lg:col-span-3 relative rounded-3xl border border-border/50 bg-card/60 shadow-2xl shadow-black/20 backdrop-blur-xl overflow-hidden min-h-[500px] flex">
            {/* OSX style window header */}
            <div className="absolute top-0 inset-x-0 h-12 bg-background/80 border-b border-border/50 backdrop-blur.md flex items-center px-4 gap-2 z-20">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto bg-muted/50 rounded-md px-3 py-1 flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border/40">
                <Icon icon="solar:lock-keyhole-minimalistic-bold" className="size-3" />
                allochat.app/gaming-lounge
              </div>
            </div>

            <div className="flex-1 mt-12 relative bg-background/50">
              <AnimatePresence mode="wait">
                {activeTab === "chat" && <ChatPreview key="chat" />}
                {activeTab === "video" && <VideoPreview key="video" />}
                {activeTab === "leaderboard" && <LeaderboardTabPreview key="leaderboard" />}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// Subcomponents for the mockups
function ChatPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col p-6"
    >
      <div className="flex-1 space-y-6 overflow-hidden relative">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-bold">JD</div>
          <div>
            <div className="flex gap-2 items-baseline">
              <span className="font-bold">Jamie_Dev</span>
              <span className="text-xs text-muted-foreground">Today at 4:20 PM</span>
            </div>
            <div className="mt-1 rounded-2xl rounded-tl-none bg-muted px-4 py-2 border border-border/50 w-fit">
              <p className="text-sm">Just deployed the new landing page updates! 🚀</p>
            </div>
            <div className="mt-2 flex gap-1">
              <span className="inline-flex items-center gap-1 rounded bg-secondary/50 px-2 py-1 text-xs border border-border/40">🔥 <span className="font-bold">4</span></span>
              <span className="inline-flex items-center gap-1 rounded bg-secondary/50 px-2 py-1 text-xs border border-border/40">🙌 <span className="font-bold">2</span></span>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-4 flex-row-reverse">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold">AK</div>
          <div className="flex items-end flex-col">
            <div className="flex gap-2 items-baseline flex-row-reverse">
              <span className="font-bold text-primary">Alex (You)</span>
              <span className="text-xs text-muted-foreground">Today at 4:22 PM</span>
            </div>
            <div className="mt-1 rounded-2xl rounded-tr-none bg-primary px-4 py-2 text-primary-foreground shadow-sm shadow-primary/20 w-fit">
              <p className="text-sm">Looks incredible. The animations are so slick.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/50 bg-background px-4 py-3 shadow-sm">
        <Icon icon="solar:smile-circle-bold" className="size-6 text-muted-foreground hover:text-foreground cursor-pointer" />
        <p className="text-sm text-muted-foreground flex-1">Message Gaming Lounge...</p>
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
          <Icon icon="solar:microphone-3-bold" className="size-5" />
        </div>
      </div>
    </motion.div>
  );
}

function VideoPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col p-6"
    >
       <div className="grid grid-cols-2 gap-4 flex-1">
         {[1, 2, 3, 4].map((i) => (
           <div key={i} className="relative rounded-2xl bg-muted/30 border border-border/40 overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex items-end p-4">
               <div className="flex items-center gap-2 w-full justify-between">
                 <span className="text-sm font-bold shadow-sm shadow-black/50">User {i}</span>
                 {i === 2 && <Icon icon="solar:microphone-3-bold" className="size-4 text-red-500 bg-black/50 rounded-full p-1" />}
               </div>
             </div>
             {i === 1 && <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500/50"></div>}
           </div>
         ))}
       </div>
       <div className="mt-6 flex items-center justify-center gap-4">
         <button className="h-12 w-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 border border-border/50 shadow-sm"><Icon icon="solar:microphone-3-bold" className="size-5" /></button>
         <button className="h-12 w-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 border border-border/50 shadow-sm"><Icon icon="solar:videocamera-record-bold" className="size-5" /></button>
         <button className="h-12 w-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 border border-border/50 shadow-sm"><Icon icon="solar:monitor-smartphone-line-duotone" className="size-5" /></button>
         <button className="h-12 px-6 rounded-full bg-red-500/90 hover:bg-red-500 text-white font-bold tracking-wide shadow-sm flex items-center gap-2">Leave</button>
       </div>
    </motion.div>
  );
}

function LeaderboardTabPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 flex flex-col p-6"
    >
      <div className="flex flex-col items-center justify-center h-full gap-4">
         <Icon icon="solar:cup-star-bold" className="size-16 text-yellow-500 drop-shadow-xl" />
         <div className="text-center">
           <h3 className="text-xl font-bold">Season 4 Rankings</h3>
           <p className="text-sm text-muted-foreground mt-1">14 days left in the season.</p>
         </div>
         <div className="w-full max-w-md bg-muted/20 border border-border/40 rounded-2xl p-4 flex flex-col gap-3 mt-4">
           {/* Row 1 */}
           <div className="flex items-center gap-3 bg-secondary/50 p-2 rounded-xl">
             <span className="font-bold text-yellow-500 w-6 text-center">#1</span>
             <div className="h-8 w-8 rounded-full bg-primary/20"></div>
             <span className="flex-1 font-semibold text-sm">Alex_K</span>
             <span className="text-sm font-mono text-primary font-bold">12,450 XP</span>
           </div>
           {/* Row 2 */}
           <div className="flex items-center gap-3 p-2 rounded-xl">
             <span className="font-bold text-slate-400 w-6 text-center">#2</span>
             <div className="h-8 w-8 rounded-full bg-primary/20"></div>
             <span className="flex-1 font-semibold text-sm">Priya_M</span>
             <span className="text-sm font-mono font-medium">11,200 XP</span>
           </div>
           {/* Row 3 */}
           <div className="flex items-center gap-3 p-2 rounded-xl">
             <span className="font-bold text-amber-700 w-6 text-center">#3</span>
             <div className="h-8 w-8 rounded-full bg-primary/20"></div>
             <span className="flex-1 font-semibold text-sm">Jay_T</span>
             <span className="text-sm font-mono font-medium">10,890 XP</span>
           </div>
         </div>
      </div>
    </motion.div>
  );
}
