import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { toast } from 'sonner';

type Props = { roomId: Id<'rooms'> };

type RoomMember = {
  _id: Id<'roomMembers'>;
  roomId: Id<'rooms'>;
  userId: Id<'users'>;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  joinedAt: number;
  user?: {
    name?: string;
    username?: string;
    image?: string | null;
    level?: number;
    isOnline?: boolean;
  } | null;
};

export function MemberPanel({ roomId }: Props) {
  const members = useQuery(api.rooms.getRoomMembers, { roomId }) as RoomMember[] | undefined;
  const room = useQuery(api.rooms.getRoom, { roomId });
  const currentUser = useQuery(api.users.getCurrentUser);

  const sendFriendRequest = useMutation(api.users.sendFriendRequest);
  const updateMemberRole = useMutation(api.rooms.updateMemberRole);

  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null);

  const canManageRanks = useMemo(() => {
    if (!currentUser || !room) return false;
    return room.ownerId === currentUser._id || currentUser.role === 'admin' || currentUser.role === 'owner';
  }, [currentUser, room]);

  return (
    <>
      <aside className="border-border bg-card hidden w-72 shrink-0 flex-col border-l lg:flex">
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Members {members ? `(${members.length})` : ''}</h3>
        </div>
        <div className="flex flex-col gap-1 overflow-y-auto p-3">
          {members === undefined && (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}

          {members?.map((member) => (
            <button
              key={member._id}
              type="button"
              className="hover:bg-accent group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-all hover:shadow-sm"
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative">
                <Avatar className="size-8 border border-border/50 transition-transform group-hover:scale-105">
                  <AvatarImage src={member.user?.image ?? undefined} />
                  <AvatarFallback className="bg-primary/10 text-[10px] font-bold">
                    {member.user?.name?.slice(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background shadow-sm',
                    member.user?.isOnline ? 'bg-green-500' : 'bg-slate-400'
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-semibold leading-none">{member.user?.name || 'Anonymous User'}</p>
                  <LevelBadge level={member.user?.level || 1} />
                </div>
                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px] font-medium capitalize">
                  {member.role === 'owner' ? (
                    <>
                      <Icon icon="solar:crown-linear" className="size-3" /> Owner
                    </>
                  ) : member.role === 'admin' ? (
                    <>
                      <Icon icon="solar:shield-check-linear" className="size-3" /> Admin
                    </>
                  ) : member.role === 'moderator' ? (
                    <>
                      <Icon icon="solar:shield-user-linear" className="size-3" /> Moderator
                    </>
                  ) : (
                    <>
                      <Icon icon="solar:user-linear" className="size-3" /> Member
                    </>
                  )}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-12 border border-border/60">
                  <AvatarImage src={selectedMember.user?.image ?? undefined} />
                  <AvatarFallback className="bg-primary/10 font-bold">
                    {selectedMember.user?.name?.slice(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{selectedMember.user?.name || 'Anonymous User'}</p>
                  <p className="text-muted-foreground truncate text-xs">@{selectedMember.user?.username || 'unknown'}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="secondary" className="capitalize">{selectedMember.role}</Badge>
                </div>
              </div>

              <div className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border border-border/60 p-2">
                  <p className="font-medium text-foreground">Level</p>
                  <p>{selectedMember.user?.level || 1}</p>
                </div>
                <div className="rounded-md border border-border/60 p-2">
                  <p className="font-medium text-foreground">Status</p>
                  <p>{selectedMember.user?.isOnline ? 'Online' : 'Offline'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href={`/messages/${selectedMember.userId}`} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
                  Message
                </Link>
                <Link href={`/random/call/${selectedMember.userId}`} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
                  Call
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      await sendFriendRequest({ targetId: selectedMember.userId });
                      toast.success('Friend request sent');
                    } catch (err: unknown) {
                      const message = err instanceof Error ? err.message : 'Could not send request';
                      toast.error(message);
                    }
                  }}
                  disabled={selectedMember.userId === currentUser?._id}
                >
                  Add Friend
                </Button>
                <Link href={`/profile/${selectedMember.userId}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  View Profile
                </Link>
              </div>

              {canManageRanks && selectedMember.userId !== currentUser?._id && selectedMember.role !== 'owner' && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Change Rank</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant={selectedMember.role === 'member' ? 'default' : 'outline'}
                      onClick={async () => {
                        await updateMemberRole({ roomId, memberUserId: selectedMember.userId, role: 'member' });
                        toast.success('Rank updated to member');
                      }}
                    >
                      Member
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedMember.role === 'moderator' ? 'default' : 'outline'}
                      onClick={async () => {
                        await updateMemberRole({ roomId, memberUserId: selectedMember.userId, role: 'moderator' });
                        toast.success('Rank updated to moderator');
                      }}
                    >
                      Moderator
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedMember.role === 'admin' ? 'default' : 'outline'}
                      onClick={async () => {
                        await updateMemberRole({ roomId, memberUserId: selectedMember.userId, role: 'admin' });
                        toast.success('Rank updated to admin');
                      }}
                    >
                      Admin
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
