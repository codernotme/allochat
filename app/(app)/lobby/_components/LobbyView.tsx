'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ROOM_CATEGORIES } from '@/lib/data/room-categories';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

export function LobbyView() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (currentUser && currentUser.onboardingCompleted === false) {
      router.replace('/auth/onboarding');
    }
  }, [currentUser, router]);

  // Query rooms from Convex
  const rooms = useQuery((api as any).rooms.listPublicRooms, {
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const featured = useQuery((api as any).rooms.getFeaturedRooms);

  if (currentUser === undefined) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <Icon icon="solar:round-alt-fill-line-duotone" className="animate-spin text-primary size-10" />
      </div>
    );
  }

  const filteredRooms = rooms?.filter((r: any) => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative flex flex-col gap-8 p-6 lg:p-10 min-h-full">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-40 right-0 h-[30rem] w-[30rem] rounded-full bg-secondary/5 blur-[100px]" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Communities</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl">
          Find your tribe, join active rooms, and start chatting instantly.
        </p>
      </motion.div>

      {/* Search + Create */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 relative z-10"
      >
        <div className="relative flex-1 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <Icon icon="solar:magnifer-linear" className="text-muted-foreground absolute top-1/2 left-4 size-5 -translate-y-1/2 z-10" />
          <Input
            placeholder="Search thousands of rooms…"
            className="pl-11 h-12 bg-card/60 backdrop-blur-md border-border/50 text-base shadow-sm rounded-xl relative z-10 transition-all focus-visible:ring-primary/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link 
          href="/chat/rooms/create" 
          className={cn(buttonVariants({ variant: 'default' }), "h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 whitespace-nowrap")}
        >
          <Icon icon="solar:plus-circle-bold" className="size-5 mr-2" />
          Create Room
        </Link>
      </motion.div>

      {/* Category Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-4 pt-1 snap-x hide-scrollbar relative z-10"
      >
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            "shrink-0 snap-start flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
            selectedCategory === 'all' 
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105" 
              : "bg-card/50 hover:bg-card border border-border/40 text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon icon="solar:home-smile-angle-bold" className="size-4" />
          All Rooms
        </button>
        {ROOM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "shrink-0 snap-start flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                : "bg-card/50 hover:bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:-translate-y-0.5"
            )}
          >
            <span>{cat.emoji}</span> {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Featured Rooms */}
      {featured && featured.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex flex-col gap-4 relative z-10"
        >
          <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Icon icon="solar:star-fall-bold-duotone" className="size-6 text-amber-500" />
            Spotlight
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((room: any, i: number) => (
              <RoomCard key={room._id} room={room} featured delay={i * 0.05} />
            ))}
          </div>
        </motion.div>
      )}

      {/* All Rooms */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="flex flex-col gap-4 relative z-10"
      >
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground mt-4">
          {selectedCategory === 'all' ? (
            <>
              <Icon icon="solar:earth-bold-duotone" className="size-6 text-primary" />
              Active Communities
            </>
          ) : (
            <>
              <span className="text-2xl">{ROOM_CATEGORIES.find(c => c.id === selectedCategory)?.emoji}</span>
              {ROOM_CATEGORIES.find(c => c.id === selectedCategory)?.label}
            </>
          )}
        </h2>

        {rooms === undefined && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card/40 border border-border/20 animate-pulse rounded-2xl h-36" />
            ))}
          </div>
        )}

        {filteredRooms?.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-20 text-center rounded-3xl border border-dashed border-border/60 bg-card/20 backdrop-blur-sm"
          >
            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
              <Icon icon="solar:ghost-smile-bold-duotone" className="text-primary size-8" />
            </div>
            <h3 className="text-xl font-bold">It's quiet in here</h3>
            <p className="text-muted-foreground max-w-sm">No rooms found matching your criteria. Why not be the first to start a conversation?</p>
            <Link href="/chat/rooms/create" className={cn(buttonVariants({ variant: 'default' }), "mt-4 rounded-full")}>
              Create a new room
            </Link>
          </motion.div>
        )}

        {filteredRooms && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredRooms.map((room: any, i: number) => (
                <RoomCard key={room._id} room={room} delay={i * 0.05} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function RoomCard({ room, featured, delay = 0 }: { room: any; featured?: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Link href={`/chat/room/${room._id}`} className="block h-full">
        <div className={cn(
          "group relative flex h-full cursor-pointer flex-col gap-4 rounded-2xl border bg-card/40 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
          featured 
            ? "border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.05)] hover:shadow-amber-500/10" 
            : "border-border/50 hover:border-primary/40 hover:bg-card/60 shadow-sm"
        )}>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
          
          <div className="flex items-start gap-4 relative z-10">
            <div className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-inner ring-1 transition-transform duration-300 group-hover:scale-110",
              featured ? "bg-amber-500/10 text-amber-500 ring-amber-500/20" : "bg-primary/10 text-primary ring-primary/20"
            )}>
              {room.icon || <Icon icon="solar:chat-round-bold-duotone" className="size-6" />}
            </div>
            
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate font-bold text-foreground group-hover:text-primary transition-colors">{room.name}</p>
                {room.isVerified && (
                  <span title="Verified Community" className="shrink-0 flex items-center justify-center bg-blue-500/10 rounded-full p-0.5">
                    <Icon icon="solar:verified-check-bold" className="size-3.5 text-blue-500" />
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed font-medium">
                {room.topic || room.description || "No topic set for this room."}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-center gap-3 text-xs font-semibold relative z-10">
            <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-md">
              <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              {room.onlineCount} online
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon icon="solar:users-group-rounded-bold" className="size-3.5 opacity-70" />
              {room.memberCount}
            </div>
            
            <div className="ml-auto flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-bold bg-muted/50 px-2 py-1 rounded-md">
              {room.category}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
