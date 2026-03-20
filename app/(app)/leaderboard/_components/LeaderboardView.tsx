'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Icon } from '@iconify/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getLevelFromXP } from '@/lib/data/xp-actions';

export function LeaderboardView() {
  // Use gamification - get top users by XP from users table 
  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground text-sm">Top chatters on AlloChat</p>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2">
        {['All Time', 'Monthly', 'Weekly'].map((period, i) => (
          <button
            key={period}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              i === 0
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Your rank card */}
      {currentUser && (
        <div className="from-primary/10 to-primary/5 border-primary/20 flex items-center gap-4 rounded-xl border bg-gradient-to-r p-4">
          <div className="bg-primary/20 flex size-10 items-center justify-center rounded-full">
            <Icon icon="solar:user-circle-linear" className="size-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{currentUser.displayName}</p>
            <p className="text-muted-foreground text-xs">Level {currentUser.level || 1} · {currentUser.xp || 0} XP</p>
          </div>
          <div className="text-right">
            <p className="text-primary text-lg font-bold">#–</p>
            <p className="text-muted-foreground text-xs">Your rank</p>
          </div>
        </div>
      )}

      {/* Leaderboard table */}
      <div className="border-border overflow-hidden rounded-xl border">
        {/* Top 3 podium */}
        <div className="bg-muted/30 grid grid-cols-3 gap-0 border-b p-4">
          {/* 2nd place */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="bg-muted-foreground/20 flex size-14 items-center justify-center rounded-full">
                <Icon icon="solar:user-circle-linear" className="size-8 text-muted-foreground" />
              </div>
              <span className="bg-slate-400 absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full text-xs font-bold text-white">2</span>
            </div>
            <p className="text-muted-foreground text-xs font-medium">—</p>
            <p className="text-muted-foreground text-xs">— XP</p>
          </div>

          {/* 1st place */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="size-5 flex justify-center">
                <Icon icon="solar:crown-minimalistic-bold" className="size-5 text-amber-500" />
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 flex size-16 items-center justify-center rounded-full ring-2 ring-amber-400">
                <Icon icon="solar:user-circle-linear" className="size-10 text-amber-600" />
              </div>
              <span className="bg-amber-500 absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full text-xs font-bold text-white">1</span>
            </div>
            <p className="text-xs font-bold">—</p>
            <p className="text-muted-foreground text-xs">— XP</p>
          </div>

          {/* 3rd place */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="bg-muted-foreground/20 flex size-14 items-center justify-center rounded-full">
                <Icon icon="solar:user-circle-linear" className="size-8 text-muted-foreground" />
              </div>
              <span className="bg-orange-400 absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full text-xs font-bold text-white">3</span>
            </div>
            <p className="text-muted-foreground text-xs font-medium">—</p>
            <p className="text-muted-foreground text-xs">— XP</p>
          </div>
        </div>

        {/* Rank rows 4-10 */}
        <div className="divide-border divide-y">
          {[4, 5, 6, 7, 8, 9, 10].map((rank) => (
            <div key={rank} className="flex items-center gap-4 px-4 py-3">
              <span className="text-muted-foreground w-6 text-center text-sm font-bold">{rank}</span>
              <div className="bg-muted flex size-9 items-center justify-center rounded-full">
                <Icon icon="solar:user-circle-linear" className="size-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground/50 text-sm font-medium italic">Loading…</p>
                <p className="text-muted-foreground text-xs">Lv. —</p>
              </div>
              <div className="text-right">
                <p className="font-bold">— XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-center text-xs">
        Leaderboard updates every hour. Earn XP by chatting, joining calls, and being active!
      </p>
    </div>
  );
}
