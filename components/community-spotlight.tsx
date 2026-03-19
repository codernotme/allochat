"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { communitySpotlight } from "@/app/data/home";
import { cn } from "@/lib/utils";

// Dummy avatars to stack
const avatars = ["👩‍🎤", "👨‍💻", "👩‍🚀", "👨‍🎨", "👩‍🌾"];

export function CommunitySpotlight() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Community Spotlight</p>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Real communities.<br />Real stories.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communitySpotlight.map((room, i) => (
             <motion.div
               key={room.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: i * 0.1 }}
               className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/40 shadow-sm backdrop-blur-md transition-all hover:scale-[1.02] hover:shadow-xl hover:border-primary/30"
             >
               {/* Cover Image Placeholder with Gradient */}
               <div className={cn(
                 "h-32 w-full",
                 room.theme === "gaming" ? "bg-gradient-to-br from-indigo-500/80 to-purple-500/80" : 
                 room.theme === "study" ? "bg-gradient-to-br from-emerald-500/80 to-teal-500/80" : 
                 "bg-gradient-to-br from-orange-500/80 to-amber-500/80"
               )} />
               
               <div className="flex-1 p-6 relative">
                 {/* Icon floating over cover */}
                 <div className="absolute -top-10 left-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border/50 text-foreground shadow-lg">
                   <Icon icon={
                     room.theme === "gaming" ? "solar:gameboy-bold" : 
                     room.theme === "study" ? "solar:notebook-bold" : "solar:code-bold"
                   } className="size-6" />
                 </div>

                 <div className="mt-6">
                   <h3 className="text-xl font-bold">{room.title}</h3>
                   <p className="mt-2 text-sm text-muted-foreground">{room.description}</p>
                 </div>
                 
                 <div className="mt-6 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                   <span>{room.members} members</span>
                   <span>{room.posts} posts today</span>
                 </div>

                 {/* Avatars */}
                 <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-4">
                   <div className="flex -space-x-2">
                     {avatars.map((emoji, idx) => (
                       <div key={idx} className="flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-background bg-secondary text-xs">
                         {emoji}
                       </div>
                     ))}
                   </div>
                   <span className="text-xs text-muted-foreground font-medium">
                     +{parseInt(room.members.replace(/,/g, '')) - avatars.length}
                   </span>
                 </div>
               </div>

               {/* Hover CTA */}
               <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-primary/95 px-6 py-4 text-center font-bold text-primary-foreground backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                 Join Community →
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
