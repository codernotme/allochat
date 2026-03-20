'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';

interface ProfileHeaderProps {
  user: {
    avatar?: string;
    displayName?: string;
    username: string;
    bio?: string;
    xp: number;
    presenceStatus?: string;
  };
  isOwnProfile?: boolean;
  actions?: React.ReactNode;
}

export function ProfileHeader({ user, isOwnProfile, actions }: ProfileHeaderProps) {
  return (
    <div className="relative mb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-48 w-full rounded-2xl border" />
      
      {/* Avatar & User Info */}
      <div className="absolute -bottom-16 left-8 flex items-end gap-6">
        <div className="relative">
          <Avatar className="size-32 border-4 border-background shadow-lg">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              <Icon icon="solar:user-circle-linear" className="size-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className={`absolute bottom-2 right-2 size-5 rounded-full border-4 border-background ${
            user.presenceStatus === 'online' ? 'bg-green-500' : 'bg-muted-foreground'
          }`} />
        </div>
        
        <div className="mb-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{user.displayName || user.username}</h1>
            {isOwnProfile && (
              <Badge variant="outline" className="text-[10px] uppercase">You</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm font-medium italic">@{user.username}</p>
          <div className="mt-2 w-48">
            <XPProgressBar xp={user.xp} showDetails={false} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute -bottom-14 right-8 flex gap-2">
        {actions}
      </div>
    </div>
  );
}
