'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

type Props = {
  peerId: Id<'users'>;
};

const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function PeerVideoCall({ peerId }: Props) {
  const currentUser = useQuery(api.users.getCurrentUser);
  const peer = useQuery(api.users.getUserProfile, { userId: peerId });

  const session = useQuery(api.webrtc.getSessionWithPeer, currentUser ? { peerId } : 'skip');
  const createSession = useMutation(api.webrtc.createSession);
  const setOffer = useMutation(api.webrtc.setOffer);
  const setAnswer = useMutation(api.webrtc.setAnswer);
  const addIceCandidate = useMutation(api.webrtc.addIceCandidate);
  const endSession = useMutation(api.webrtc.endSession);
  const heartbeat = useMutation(api.webrtc.heartbeat);

  const candidates = useQuery(api.webrtc.listIceCandidates, session?._id ? { callId: session._id } : 'skip');

  const [loadingMedia, setLoadingMedia] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const offerCreatedRef = useRef(false);
  const answerCreatedRef = useRef(false);
  const processedCandidateIdsRef = useRef<Set<string>>(new Set());

  const isCaller = useMemo(() => {
    if (!session || !currentUser) return false;
    return session.callerId === currentUser._id;
  }, [session, currentUser]);

  useEffect(() => {
    let mounted = true;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setLoadingMedia(false);
      } catch {
        if (mounted) {
          setError('Please allow camera/microphone to start the call.');
          setLoadingMedia(false);
        }
      }
    }

    initMedia();

    return () => {
      mounted = false;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      remoteStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
      pcRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!localStreamRef.current || !currentUser || session) return;

    (async () => {
      try {
        await createSession({ peerId });
      } catch {
        setError('Could not create call session.');
      }
    })();
  }, [createSession, currentUser, peerId, session]);

  useEffect(() => {
    if (!session || !localStreamRef.current) return;
    if (pcRef.current) return;

    const pc = new RTCPeerConnection(rtcConfig);
    pcRef.current = pc;

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current as MediaStream);
    });

    remoteStreamRef.current = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }

    pc.ontrack = (event) => {
      event.streams[0]?.getTracks().forEach((track) => {
        if (!remoteStreamRef.current) return;
        if (!remoteStreamRef.current.getTracks().some((t) => t.id === track.id)) {
          remoteStreamRef.current.addTrack(track);
        }
      });
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate || !session?._id) return;
      const c = event.candidate;
      void addIceCandidate({
        callId: session._id,
        candidate: c.candidate,
        sdpMid: c.sdpMid ?? undefined,
        sdpMLineIndex: c.sdpMLineIndex ?? undefined,
      });
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
      if (pc.connectionState === 'failed') {
        setError('Connection failed. Please retry the call.');
      }
    };
  }, [addIceCandidate, session]);

  useEffect(() => {
    if (!session || !currentUser || !pcRef.current) return;

    const pc = pcRef.current;

    async function runNegotiation() {
      try {
        if (isCaller && !session.offerSdp && !offerCreatedRef.current) {
          offerCreatedRef.current = true;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          await setOffer({ callId: session._id, sdp: offer.sdp ?? '' });
        }

        if (!isCaller && session.offerSdp && !pc.currentRemoteDescription && !answerCreatedRef.current) {
          answerCreatedRef.current = true;
          await pc.setRemoteDescription({ type: 'offer', sdp: session.offerSdp });
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await setAnswer({ callId: session._id, sdp: answer.sdp ?? '' });
        }

        if (isCaller && session.answerSdp && !pc.currentRemoteDescription) {
          await pc.setRemoteDescription({ type: 'answer', sdp: session.answerSdp });
        }
      } catch {
        setError('Negotiation failed. Try ending and starting again.');
      }
    }

    void runNegotiation();
  }, [currentUser, isCaller, session, setAnswer, setOffer]);

  useEffect(() => {
    if (!pcRef.current || !candidates || !currentUser) return;

    const pc = pcRef.current;

    for (const candidate of candidates) {
      if (candidate.senderId === currentUser._id) continue;
      if (processedCandidateIdsRef.current.has(candidate._id)) continue;

      if (!pc.currentRemoteDescription) continue;

      void pc
        .addIceCandidate(
          new RTCIceCandidate({
            candidate: candidate.candidate,
            sdpMid: candidate.sdpMid ?? null,
            sdpMLineIndex: candidate.sdpMLineIndex ?? null,
          })
        )
        .then(() => {
          processedCandidateIdsRef.current.add(candidate._id);
        })
        .catch(() => {
          // Keep candidate unprocessed; it can be retried on next update.
        });
    }
  }, [candidates, currentUser]);

  useEffect(() => {
    if (!session?._id) return;
    const interval = setInterval(() => {
      void heartbeat({ callId: session._id });
    }, 8000);
    return () => clearInterval(interval);
  }, [heartbeat, session?._id]);

  useEffect(() => {
    const local = localStreamRef.current;
    if (!local) return;
    local.getAudioTracks().forEach((t) => {
      t.enabled = micOn;
    });
  }, [micOn]);

  useEffect(() => {
    const local = localStreamRef.current;
    if (!local) return;
    local.getVideoTracks().forEach((t) => {
      t.enabled = camOn;
    });
  }, [camOn]);

  async function handleEndCall() {
    try {
      if (session?._id) {
        await endSession({ callId: session._id, reason: 'manual_end' });
      }
    } catch {
      toast.error('Failed to end call session cleanly.');
    }
  }

  if (loadingMedia) {
    return (
      <Card className="border-border/60 bg-card/70">
        <CardContent className="flex min-h-130 items-center justify-center">
          <div className="text-muted-foreground text-sm">Preparing camera and microphone...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border/60 bg-card/70">
        <CardContent className="flex min-h-130 flex-col items-center justify-center gap-3 text-center">
          <Icon icon="solar:danger-triangle-linear" className="text-destructive size-8" />
          <p className="text-sm font-semibold">Call unavailable</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/70 overflow-hidden">
      <CardHeader className="border-b border-border/60 py-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="truncate">Video chat with {peer?.displayName || peer?.username || 'User'}</span>
          <span className="text-muted-foreground text-xs">{connectionState}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-black relative aspect-video overflow-hidden rounded-lg border border-border/70">
            <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            <span className="bg-black/60 absolute right-2 bottom-2 rounded px-2 py-1 text-[11px] text-white">You</span>
          </div>
          <div className="bg-black relative aspect-video overflow-hidden rounded-lg border border-border/70">
            <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
            <span className="bg-black/60 absolute right-2 bottom-2 rounded px-2 py-1 text-[11px] text-white">Peer</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={micOn ? 'secondary' : 'destructive'} onClick={() => setMicOn((v) => !v)}>
            <Icon icon={micOn ? 'solar:microphone-3-linear' : 'solar:microphone-slash-linear'} className="mr-2 size-4" />
            {micOn ? 'Mute' : 'Unmute'}
          </Button>
          <Button variant={camOn ? 'secondary' : 'destructive'} onClick={() => setCamOn((v) => !v)}>
            <Icon icon={camOn ? 'solar:videocamera-record-linear' : 'solar:videocamera-slash-linear'} className="mr-2 size-4" />
            {camOn ? 'Camera On' : 'Camera Off'}
          </Button>
          <Button variant="destructive" onClick={handleEndCall}>
            <Icon icon="solar:phone-calling-rounded-bold" className="mr-2 size-4" />
            End Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
