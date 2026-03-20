'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

type Props = {
  roomId: Id<'rooms'>;
  onCancel: () => void;
  onSendComplete: () => void;
};

export function VoiceRecorder({ roomId, onCancel, onSendComplete }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const sendMessage = useMutation(api.messages.sendMessage);

  useEffect(() => {
    startRecording();
    return () => stopRecording(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      audioChunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.start();
      setIsRecording(true);

      timerInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error('Microphone permission denied.');
      onCancel();
    }
  };

  const stopRecording = (shouldSend: boolean) => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.onstop = async () => {
        mediaRecorder.current?.stream.getTracks().forEach((track) => track.stop());
        if (timerInterval.current) clearInterval(timerInterval.current);
        setIsRecording(false);

        if (shouldSend) {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          await handleSend(audioBlob);
        }
      };
      mediaRecorder.current.stop();
    }
  };

  const handleSend = async (blob: Blob) => {
    setIsUploading(true);
    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();

      // 2. Upload file
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': blob.type },
        body: blob,
      });
      const { storageId } = await result.json();

      // 3. Send message with storageId link
      const url = `/api/storage/${storageId}`;
      await sendMessage({ roomId, content: url, type: 'voice' });
      
      onSendComplete();
    } catch (error) {
      toast.error('Failed to send voice message');
      onCancel();
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center gap-3 w-full bg-accent/20 rounded-xl p-2 border border-primary/20 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center gap-2 flex-1 px-2">
        <div className="size-2.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-medium tabular-nums">{formatTime(recordingTime)}</span>
        <span className="text-muted-foreground text-xs ml-2">Recording...</span>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-destructive hover:bg-destructive/10 hover:text-destructive size-8"
        onClick={() => stopRecording(false)}
        disabled={isUploading}
      >
        <Icon icon="solar:trash-bin-trash-linear" className="size-4" />
      </Button>
      
      <Button 
        size="sm" 
        className="gap-2 h-8"
        onClick={() => stopRecording(true)}
        disabled={isUploading}
      >
        {isUploading ? (
          <Icon icon="solar:spinner-linear" className="size-4 animate-spin" />
        ) : (
          <Icon icon="solar:plain-2-linear" className="size-4" />
        )}
      </Button>
    </div>
  );
}
