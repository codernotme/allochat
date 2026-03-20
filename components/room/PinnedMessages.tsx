'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Props = { roomId: Id<'rooms'>; onClose: () => void };

export function PinnedMessages({ roomId, onClose }: Props) {
  const pinned = useQuery(api.messages.getPinnedMessages, { roomId });
  const unpin = useMutation(api.messages.unpinMessage);
  const user = useQuery(api.users.getCurrentUser);

  const canModerate = user?.role === 'owner' || user?.role === 'admin' || user?.role === 'moderator';

  return (
    <div className="flex flex-col h-full border-l border-border bg-card/30 w-72 shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon icon="solar:pin-bold" className="size-4 text-primary" />
          <span className="font-semibold text-sm">Pinned Messages</span>
        </div>
        <Button variant="ghost" size="icon" className="size-7 rounded" onClick={onClose}>
          <Icon icon="solar:close-square-linear" className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {pinned === undefined && (
          <div className="flex justify-center py-8">
            <div className="border-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}

        {pinned?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <Icon icon="solar:pin-linear" className="size-8 text-muted-foreground/50" />
            <p className="text-muted-foreground text-xs">No pinned messages yet</p>
          </div>
        )}

        {pinned?.map((msg: any) => (
          <div key={msg._id} className="rounded-lg border border-border bg-background p-3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground truncate">
                {msg.sender?.name || 'Unknown'}
              </span>
              <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{msg.content}</p>
            {canModerate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 self-end text-xs text-muted-foreground hover:text-destructive"
                onClick={async () => {
                  try {
                    await unpin({ messageId: msg._id });
                    toast.success('Message unpinned');
                  } catch {
                    toast.error('Failed to unpin');
                  }
                }}
              >
                <Icon icon="solar:unpin-linear" className="size-3 mr-1" />
                Unpin
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
