import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

type Props = { roomId: Id<'rooms'> };

export function MemberPanel({ roomId }: Props) {
  const members = useQuery(api.rooms.getRoomMembers, { roomId });

  return (
    <aside className="border-border bg-card hidden w-64 shrink-0 flex-col border-l lg:flex">
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">
          Members {members ? `(${members.length})` : ''}
        </h3>
      </div>
      <div className="flex flex-col gap-1 overflow-y-auto p-3">
        {members === undefined && (
          <div className="flex items-center justify-center py-8">
            <div className="border-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}
        {members?.map((member) => (
          <div
            key={member._id}
            className="hover:bg-accent group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-all hover:shadow-sm"
          >
            <div className="relative">
              <Avatar className="size-8 border border-border/50 transition-transform group-hover:scale-105">
                <AvatarImage src={member.user?.image} />
                <AvatarFallback className="bg-primary/10 text-[10px] font-bold">
                  {member.user?.name?.slice(0, 2).toUpperCase() || '??'}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background shadow-sm",
                  member.user?.isOnline ? "bg-green-500" : "bg-slate-400"
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-semibold leading-none">
                  {member.user?.name || 'Anonymous User'}
                </p>
                <LevelBadge level={member.user?.level || 1} />
              </div>
              <p className="text-muted-foreground mt-1 text-[10px] font-medium capitalize flex items-center gap-1">
                {member.role === 'owner' ? (
                  <>
                    <Icon icon="solar:crown-linear" className="size-3" /> Owner
                  </>
                ) : member.role === 'admin' ? (
                  <>
                    <Icon icon="solar:shield-check-linear" className="size-3" /> Admin
                  </>
                ) : (
                  <>
                    <Icon icon="solar:user-linear" className="size-3" /> Member
                  </>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
