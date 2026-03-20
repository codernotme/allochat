'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

type Props = { roomId: Id<'rooms'> };

type RoomMember = {
  _id: Id<'roomMembers'>;
  roomId: Id<'rooms'>;
  userId: Id<'users'>;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  joinedAt: number;
  mutedUntil?: number;
  user?: {
    name?: string;
    username?: string;
    image?: string | null;
    level?: number;
    isOnline?: boolean;
  } | null;
};

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  moderator: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  member: '',
};

export function RoomMembersView({ roomId }: Props) {
  const members = useQuery(api.rooms.getRoomMembers, { roomId }) as RoomMember[] | undefined;
  const room = useQuery(api.rooms.getRoom, { roomId });
  const currentUser = useQuery(api.users.getCurrentUser);
  const sendFriendRequest = useMutation(api.users.sendFriendRequest);
  const updateMemberRole = useMutation(api.rooms.updateMemberRole);

  const [selectedMember, setSelectedMember] = useState<RoomMember | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const isOwnerOrAdmin =
    currentUser?._id === room?.ownerId || currentUser?.role === 'admin' || currentUser?.role === 'owner';

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  if (members === undefined) return <div className="p-8 text-center">Loading members...</div>;

  return (
    <>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
        <div className="flex items-center gap-3">
          <Link href={`/room/${roomId}`} className="hover:bg-muted rounded-lg p-1.5">
            <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Members</h1>
            <p className="text-muted-foreground text-sm">{members.length} members in {room?.name}</p>
          </div>
        </div>

        <div className="border-border overflow-hidden rounded-xl border">
          {members.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Icon icon="solar:users-group-rounded-linear" className="text-muted-foreground size-10" />
              <p className="text-muted-foreground text-sm">No members yet.</p>
            </div>
          )}

          <div className="divide-border divide-y">
            {members.map((m) => (
              <button
                key={m._id}
                type="button"
                className="hover:bg-muted/50 flex w-full items-center gap-3 px-4 py-3 text-left"
                onClick={() => setSelectedMember(m)}
              >
                <div className="relative">
                  <Avatar className="size-10 border border-border/50">
                    <AvatarImage src={m.user?.image ?? undefined} />
                    <AvatarFallback className="bg-primary/10">
                      <Icon icon="solar:user-circle-linear" className="size-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  {m.user?.isOnline && (
                    <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-green-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{m.user?.name || `User ${m.userId.slice(-6)}`}</p>
                    {m.role !== 'member' && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[m.role] || ''}`}>{m.role}</span>
                    )}
                    {m.mutedUntil && m.mutedUntil > now && (
                      <Badge variant="secondary" className="text-xs">Muted</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">Lv. {m.user?.level || 1} - Joined {new Date(m.joinedAt).toLocaleDateString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Member Profile</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src={selectedMember.user?.image ?? undefined} />
                  <AvatarFallback>{selectedMember.user?.name?.slice(0, 2).toUpperCase() || '??'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{selectedMember.user?.name || 'Unknown User'}</p>
                  <p className="text-muted-foreground text-xs">@{selectedMember.user?.username || 'unknown'}</p>
                </div>
                <Badge variant="secondary" className="ml-auto capitalize">{selectedMember.role}</Badge>
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
                  Open Full Profile
                </Link>
              </div>

              {isOwnerOrAdmin && selectedMember.userId !== currentUser?._id && selectedMember.role !== 'owner' && (
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
