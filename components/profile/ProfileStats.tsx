'use client';

import { Icon } from '@iconify/react';

interface ProfileStatsProps {
  stats: {
    messagesSent: number;
    callsJoined: number;
    friendsCount: number;
    badgesCount: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    { label: 'Messages', value: stats.messagesSent, icon: 'solar:chat-round-dots-linear', color: 'text-blue-500' },
    { label: 'Calls', value: stats.callsJoined, icon: 'solar:phone-calling-rounded-linear', color: 'text-green-500' },
    { label: 'Friends', value: stats.friendsCount, icon: 'solar:users-group-rounded-linear', color: 'text-purple-500' },
    { label: 'Badges', value: stats.badgesCount, icon: 'solar:medal-star-linear', color: 'text-amber-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {statItems.map((item) => (
        <div key={item.label} className="bg-card/50 border-border/50 flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all hover:bg-card">
          <Icon icon={item.icon} className={`size-5 ${item.color}`} />
          <p className="text-lg font-bold tracking-tight">{item.value}</p>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
