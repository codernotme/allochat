'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { MemberPanel } from '@/components/room/MemberPanel';
import { CallRoom } from '@/components/room/CallRoom';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

type Props = { roomId: Id<'rooms'> };

export function RoomView({ roomId }: Props) {
  const room = useQuery(api.rooms.getRoom, { roomId });
  const activeCall = useQuery(api.calls.getActiveCall, { roomId });
  const startCall = useMutation(api.calls.startCall);
  
  const [showMembers, setShowMembers] = useState(true);
  const [inCall, setInCall] = useState(false);

  if (room === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading room…</p>
        </div>
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <span className="text-5xl">🏚️</span>
        <h2 className="text-xl font-bold">Room not found</h2>
        <p className="text-muted-foreground text-sm">This room might have been deleted.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main chat column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Room Header */}
        <div className="border-border bg-card/50 flex items-center gap-3 border-b px-6 py-4 backdrop-blur-md">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl text-2xl shadow-inner">
            {room.icon || '💬'}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-bold tracking-tight">{room.name}</h2>
              {room.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Icon icon="solar:verified-check-linear" className="size-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent>Verified Room</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {room.topic && (
              <p className="text-muted-foreground truncate text-xs font-medium opacity-80">{room.topic}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!inCall && (
              <Button
                variant={activeCall ? "default" : "secondary"}
                size="sm"
                className={cn(
                  "h-9 gap-2 rounded-lg px-4 font-semibold transition-all",
                  activeCall && "bg-green-600 hover:bg-green-700 animate-pulse shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                )}
                onClick={async () => {
                  if (!activeCall) await startCall({ roomId, type: 'audio' });
                  setInCall(true);
                }}
              >
                <Icon icon="solar:phone-calling-rounded-linear" className="size-4" />
                {activeCall ? 'Join Call' : 'Start Call'}
              </Button>
            )}
            <div className="bg-accent/50 hidden items-center gap-2 rounded-full px-3 py-1.5 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                {room.onlineCount} online
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent h-9 w-9 rounded-lg"
              onClick={() => setShowMembers(!showMembers)}
              aria-label="Toggle member panel"
            >
              <Icon icon="solar:users-group-rounded-linear" className="size-4" />
            </Button>
          </div>
        </div>

        {/* Messages / Call */}
        <div className="relative flex min-h-0 flex-1 flex-col">
          {inCall ? (
            <div className="flex-1 p-4">
              <CallRoom 
                roomId={roomId} 
                roomName={room.name} 
                onLeave={() => setInCall(false)} 
              />
            </div>
          ) : (
            <MessageList roomId={roomId} />
          )}
        </div>

        {/* Input */}
        {!inCall && <MessageInput roomId={roomId} />}
      </div>

      {/* Member Panel */}
      {showMembers && (
        <MemberPanel roomId={roomId} />
      )}
    </div>
  );
}
