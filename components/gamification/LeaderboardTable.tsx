'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface LeaderboardUser {
  _id: string;
  displayName?: string;
  username: string;
  avatar?: string;
  level: number;
  xp: number;
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  isLoading?: boolean;
}

export function LeaderboardTable({ users, isLoading }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-muted h-14 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="divide-border divide-y">
      {users.map((user, index) => {
        const rank = index + 4; // Assuming top 3 are in podium
        return (
          <Link
            key={user._id}
            href={`/profile/${user._id}`}
            className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/40"
          >
            <span className="text-muted-foreground w-6 text-center text-sm font-bold group-hover:text-primary">
              {rank}
            </span>
            
            <Avatar className="size-9 ring-2 ring-border group-hover:ring-primary/50 transition-all">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {user.displayName?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold">{user.displayName || user.username}</p>
              <p className="text-muted-foreground text-xs">Level {user.level}</p>
            </div>

            <div className="text-right">
              <p className="font-bold tabular-nums">{user.xp.toLocaleString()} XP</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
