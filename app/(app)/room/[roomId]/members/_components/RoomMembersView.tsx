'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

type Props = { roomId: Id<'rooms'> };

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  moderator: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  member: '',
};

export function RoomMembersView({ roomId }: Props) {
  const members = useQuery(api.rooms.getRoomMembers, { roomId });
  const room = useQuery(api.rooms.getRoom, { roomId });
  const currentUser = useQuery(api.users.getCurrentUser);

  const isOwnerOrAdmin =
    currentUser?._id === room?.ownerId ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'owner';

  if (members === undefined) return <div className="p-8 text-center">Loading members…</div>;

  return (
    <div className="mx-auto max-w-2xl p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/room/${roomId}`} className="hover:bg-muted rounded-lg p-1.5">
          <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-muted-foreground text-sm">{members.length} members in {room?.name}</p>
        </div>
      </div>

      {/* Member list */}
      <div className="border-border overflow-hidden rounded-xl border">
        {members.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Icon icon="solar:users-group-rounded-linear" className="text-muted-foreground size-10" />
            <p className="text-muted-foreground text-sm">No members yet.</p>
          </div>
        )}

        <div className="divide-border divide-y">
          {members.map((m: any) => (
            <div key={m._id} className="flex items-center gap-3 px-4 py-3">
              {/* Avatar */}
              <div className="relative">
                <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                  {m.user?.image ? (
                    <img src={m.user.image} className="size-10 rounded-full object-cover" alt="" />
                  ) : (
                    <Icon icon="solar:user-circle-linear" className="size-5 text-primary" />
                  )}
                </div>
                {m.user?.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-green-500" />
                )}
              </div>

              {/* Name + Role */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{m.user?.name || `User ${m.userId.slice(-6)}`}</p>
                  {m.role !== 'member' && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[m.role] || ''}`}>
                      {m.role}
                    </span>
                  )}
                  {m.mutedUntil && m.mutedUntil > Date.now() && (
                    <Badge variant="secondary" className="text-xs">Muted</Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  Lv. {m.user?.level || 1} · Joined {new Date(m.joinedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions (owner/admin only) */}
              {isOwnerOrAdmin && m.userId !== currentUser?._id && (
                <div className="flex gap-1">
                  <Link
                    href={`/profile/${m.userId}`}
                    className="hover:bg-muted rounded-lg p-1.5"
                    title="View profile"
                  >
                    <Icon icon="solar:user-circle-linear" className="size-4" />
                  </Link>
                  <button
                    className="hover:bg-destructive/10 hover:text-destructive rounded-lg p-1.5"
                    title="Kick member"
                    onClick={() => toast.info('Kick functionality coming soon')}
                  >
                    <Icon icon="solar:logout-2-linear" className="size-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
