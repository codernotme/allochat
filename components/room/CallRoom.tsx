'use client';

import { useEffect, useState } from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

type Props = {
  roomId: Id<'rooms'>;
  roomName: string;
  onLeave: () => void;
};

export function CallRoom({ roomId, roomName, onLeave }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrapMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        setLocalStream(stream);
        setLoading(false);
      } catch {
        if (mounted) {
          setError('Camera/Microphone permission is required for calls.');
          setLoading(false);
        }
      }
    }

    bootstrapMedia();

    return () => {
      mounted = false;
      setLocalStream((prev) => {
        prev?.getTracks().forEach((t) => t.stop());
        return null;
      });
    };
  }, [roomId, roomName]);

  useEffect(() => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = micOn;
    });
  }, [localStream, micOn]);

  useEffect(() => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => {
      track.enabled = cameraOn;
    });
  }, [localStream, cameraOn]);

  if (loading) {
    return (
      <div className="bg-muted flex h-full flex-col items-center justify-center gap-4 rounded-xl border">
        <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
        <p className="text-muted-foreground text-sm font-medium">Preparing call session…</p>
      </div>
    );
  }

  if (error || !localStream) {
    return (
      <div className="bg-muted flex h-full flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center">
        <p className="text-sm font-semibold">Call unavailable</p>
        <p className="text-muted-foreground text-xs">{error ?? 'Could not start call media session.'}</p>
        <Button variant="outline" size="sm" onClick={onLeave}>Back to chat</Button>
      </div>
    );
  }

  return (
    <div className="border-border bg-card relative flex h-full flex-col overflow-hidden rounded-xl border shadow-2xl">
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold">{roomName}</p>
          <p className="text-muted-foreground text-xs">WebRTC beta call</p>
        </div>
        <span className="bg-emerald-500/10 text-emerald-600 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Connected
        </span>
      </div>

      <div className="relative flex-1 bg-black">
        <video
          autoPlay
          muted
          playsInline
          ref={(el) => {
            if (el && localStream && el.srcObject !== localStream) {
              el.srcObject = localStream;
            }
          }}
          className="h-full w-full object-cover"
        />
        <div className="bg-black/50 absolute right-3 bottom-3 rounded-lg px-2 py-1 text-xs text-white">
          You
        </div>
      </div>

      <div className="border-border flex items-center justify-center gap-2 border-t px-4 py-3">
        <Button
          variant={micOn ? 'secondary' : 'destructive'}
          size="sm"
          className="h-9"
          onClick={() => setMicOn((v) => !v)}
        >
          <Icon icon={micOn ? 'solar:microphone-3-linear' : 'solar:microphone-slash-linear'} className="mr-1 size-4" />
          {micOn ? 'Mute' : 'Unmute'}
        </Button>
        <Button
          variant={cameraOn ? 'secondary' : 'destructive'}
          size="sm"
          className="h-9"
          onClick={() => setCameraOn((v) => !v)}
        >
          <Icon icon={cameraOn ? 'solar:videocamera-record-linear' : 'solar:videocamera-slash-linear'} className="mr-1 size-4" />
          {cameraOn ? 'Camera On' : 'Camera Off'}
        </Button>
        <Button variant="destructive" size="sm" className="h-9" onClick={onLeave}>
          Leave
        </Button>
      </div>
    </div>
  );
}
