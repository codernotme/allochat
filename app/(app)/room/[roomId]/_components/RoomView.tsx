'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { MemberPanel } from '@/components/room/MemberPanel';
import { CallRoom } from '@/components/room/CallRoom';
import { PinnedMessages } from '@/components/room/PinnedMessages';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

type Props = { roomId: Id<'rooms'> };

export function RoomView({ roomId }: Props) {
  const room = useQuery(api.rooms.getRoom, { roomId });
  const activeCall = useQuery(api.calls.getActiveCall, { roomId });
  const startCall = useMutation(api.calls.startCall);
  
  const [showMembers, setShowMembers] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [joining, setJoining] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const joinRoom = useMutation(api.rooms.joinRoom);
  useQuery(api.rooms.getRoomMembership, { roomId });

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
        <Icon icon="solar:danger-triangle-linear" className="text-muted-foreground size-10" />
        <h2 className="text-xl font-bold">Room not found</h2>
        <p className="text-muted-foreground text-sm">This room might have been deleted.</p>
      </div>
    );
  }

  return (
    <div className="from-background via-background to-muted/20 flex h-full overflow-hidden bg-linear-to-b">
      {/* Main chat column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Room Header */}
        <div className="border-border/70 bg-card/70 flex items-center gap-3 border-b px-4 py-3 backdrop-blur-md md:px-6 md:py-4">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl text-2xl shadow-inner ring-1 ring-border/40">
            {room.icon || <Icon icon="solar:chat-round-line-linear" className="size-5 text-primary" />}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-lg font-black tracking-tight">{room.name}</h2>
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
            {room.topic && <p className="text-muted-foreground truncate text-xs opacity-80">{room.topic}</p>}
          </div>
          <div className="flex items-center gap-2">
            {!inCall && room.allowCalls !== false && (
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
            <div className="bg-accent/50 hidden items-center gap-2 rounded-full border border-border/60 px-3 py-1.5 md:flex">
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
              className={cn("hover:bg-accent h-9 w-9 rounded-lg", showPinned && "bg-accent")}
              onClick={() => setShowPinned(!showPinned)}
              aria-label="Toggle pinned messages"
            >
              <Icon icon="solar:pin-linear" className="size-4" />
            </Button>
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
            <div className="flex-1 p-3 md:p-4">
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

      {/* Pinned Messages Panel */}
      {showPinned && (
        <PinnedMessages roomId={roomId} onClose={() => setShowPinned(false)} />
      )}

      {/* Member Panel */}
      {showMembers && (
        <MemberPanel roomId={roomId} />
      )}

      {/* Join Room Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Room — Password Required</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Label htmlFor="room-pw">Enter Room Password</Label>
            <Input
              id="room-pw"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Room password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // handled by button
                }
              }}
            />
            <Button
              onClick={async () => {
                setJoining(true);
                try {
                  await joinRoom({ roomId, password: passwordInput });
                  setShowJoinDialog(false);
                } catch (err: unknown) {
                  const errorMessage = err instanceof Error ? err.message : 'Wrong password';
                  import('sonner').then(({ toast }) => toast.error(errorMessage));
                } finally {
                  setJoining(false);
                }
              }}
              disabled={joining}
            >
              {joining ? 'Joining…' : 'Join Room'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
