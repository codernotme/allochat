'use client';

import { useState, useRef, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { RichTextEditor } from './RichTextEditor';
import { VoiceRecorder } from './VoiceRecorder';
import { CanvasDraw } from './CanvasDraw';

type Props = { roomId: Id<'rooms'> };

export function MessageInput({ roomId }: Props) {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const sendMessage = useMutation(api.messages.sendMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(async () => {
    const text = content.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      await sendMessage({ roomId, content: text });
      setContent('');
      textareaRef.current?.focus();
    } catch (err: any) {
      if (err.message?.includes('FLOOD_LIMIT_REACHED')) {
        toast.error('Slow down! You\'re sending messages too fast.');
      } else if (err.message?.includes('muted')) {
        toast.error('You are muted in this room.');
      } else {
        toast.error('Failed to send message.');
      }
    } finally {
      setSending(false);
    }
  }, [content, sending, sendMessage, roomId]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  // Auto-resize textarea is handled by RichTextEditor

  if (isRecording) {
    return (
      <div className="border-border bg-background border-t p-3">
        <VoiceRecorder 
          roomId={roomId} 
          onCancel={() => setIsRecording(false)} 
          onSendComplete={() => setIsRecording(false)} 
        />
      </div>
    );
  }

  if (isDrawing) {
    return (
      <div className="border-border bg-background border-t p-3">
        <CanvasDraw 
          roomId={roomId} 
          onCancel={() => setIsDrawing(false)} 
          onSendComplete={() => setIsDrawing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="border-border bg-background border-t p-3 relative">
      <div className="flex gap-2 items-end w-full">
        {/* Attach file */}
        <div className="flex flex-col gap-1 pb-1.5 shrink-0">
          <button
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-8 items-center justify-center rounded-lg transition-colors"
            aria-label="Attach file"
            title="Attach file (coming soon)"
          >
            <Icon icon="solar:paperclip-linear" className="size-5" />
          </button>
        </div>

        {/* Rich Text Editor */}
        <div className="flex-1 min-w-0">
          <RichTextEditor
            value={content}
            onChange={setContent}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={sending}
            className="w-full shadow-sm"
          />
        </div>

        {/* Right Tools */}
        <div className="flex gap-1 pb-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground transition-all hover:bg-accent hover:text-foreground rounded-lg"
            onClick={() => setIsRecording(true)}
            disabled={sending}
            aria-label="Record voice message"
            title="Voice message"
          >
            <Icon icon="solar:microphone-2-linear" className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground transition-all hover:bg-accent hover:text-foreground rounded-lg"
            onClick={() => setIsDrawing(true)}
            disabled={sending}
            aria-label="Draw sketch"
            title="Sketch"
          >
            <Icon icon="solar:pen-new-square-linear" className="size-4" />
          </Button>

          <Button
            size="icon"
            className="size-8 ml-1 rounded-lg"
            onClick={handleSend}
            disabled={!content.trim() || sending}
            aria-label="Send message"
            title="Send (Ctrl+Enter)"
          >
            {sending ? '…' : <Icon icon="solar:arrow-right-linear" className="size-4" />}
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground mt-1 text-center text-xs">
        Ctrl+Enter to send
      </p>
    </div>
  );
}
