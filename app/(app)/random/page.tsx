'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RandomMatchPage() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [matchType, setMatchType] = useState<'video' | 'audio' | 'text'>('text');
  
  const joinQueue = useMutation(api.matchmaking.joinQueue);
  const leaveQueue = useMutation(api.matchmaking.leaveQueue);
  const matchStatus = useQuery(api.matchmaking.checkMatchStatus);

  useEffect(() => {
    if (isSearching && matchStatus?.matched && matchStatus.roomId) {
      router.push(`/room/${matchStatus.roomId}`);
    }
  }, [isSearching, matchStatus, router]);

  useEffect(() => {
    // If user leaves the page while searching, drop from queue
    return () => {
      leaveQueue().catch(console.error);
    };
  }, [leaveQueue]);

  const handleStartSearch = async (type: 'video' | 'audio' | 'text') => {
    setIsSearching(true);
    setMatchType(type);
    
    try {
      const res = await joinQueue({ type });
      if (res.matched && res.roomId) {
        router.push(`/room/${res.roomId}`);
      }
    } catch (err) {
      console.error(err);
      setIsSearching(false);
    }
  };

  const handleStopSearch = async () => {
    setIsSearching(false);
    await leaveQueue();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-md w-full space-y-8 text-center relative z-10">
        
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
            <Icon icon="solar:incognito-bold-duotone" className="size-12" />
          </div>
          <h1 className="text-4xl font-black tracking-tight tracking-tighter mix-blend-mode">
            Anonymous Match
          </h1>
          <p className="text-muted-foreground font-medium">
            Talk to strangers around the world. Your identity remains hidden until you add each other as friends.
          </p>
        </div>

        <div className="pt-8">
          <AnimatePresence mode="wait">
            {!isSearching ? (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid gap-4"
              >
                <button
                  onClick={() => handleStartSearch('video')}
                  className="group relative flex items-center justify-center gap-3 w-full p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all"
                >
                  <Icon icon="solar:videocamera-bold-duotone" className="size-6 transition-transform group-hover:scale-110" />
                  Video Chat
                </button>
                <button
                  onClick={() => handleStartSearch('audio')}
                  className="group relative flex items-center justify-center gap-3 w-full p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all"
                >
                  <Icon icon="solar:microphone-3-bold-duotone" className="size-6 transition-transform group-hover:scale-110" />
                  Voice Call
                </button>
                <button
                  onClick={() => handleStartSearch('text')}
                  className="group relative flex items-center justify-center gap-3 w-full p-4 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-lg shadow-[0_0_20px_rgba(var(--primary),0.1)] transition-all"
                >
                  <Icon icon="solar:chat-round-bold-duotone" className="size-6 transition-transform group-hover:scale-110" />
                  Text Chat
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="searching"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute inset-0 size-32 rounded-full border-4 border-primary/30 animate-ping duration-1000" />
                  <div className="absolute inset-0 size-32 rounded-full border-4 border-primary/20 animate-ping duration-700" style={{ animationDelay: '0.4s' }} />
                  <div className="size-24 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md border border-primary/40 shadow-[0_0_40px_rgba(var(--primary),0.4)]">
                    <Icon icon="solar:radar-linear" className="size-10 text-primary animate-pulse" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Finding a Stranger...</h3>
                <p className="text-muted-foreground mb-8">Type: {matchType.toUpperCase()}</p>

                <Button variant="destructive" size="lg" onClick={handleStopSearch} className="rounded-full px-8 shadow-lg shadow-red-500/25">
                  Cancel Search
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
