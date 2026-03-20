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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Props = { roomId: Id<'rooms'> };

export function MessageInput({ roomId }: Props) {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [showGifDialog, setShowGifDialog] = useState(false);
  const [gifUrl, setGifUrl] = useState('');

  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(async () => {
    const text = content.trim();
    if (!text || sending) return;

    const isMediaUrl =
      /^https?:\/\/.+/i.test(text) &&
      /(\.gif($|\?)|\.png($|\?)|\.jpe?g($|\?)|\.webp($|\?)|giphy\.com|tenor\.com)/i.test(text);

    setSending(true);
    try {
      await sendMessage({ roomId, content: text, type: isMediaUrl ? 'media' : 'text' });
      setContent('');
      textareaRef.current?.focus();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('FLOOD_LIMIT_REACHED')) {
        toast.error('Slow down! You\'re sending messages too fast.');
      } else if (message.includes('muted')) {
        toast.error('You are muted in this room.');
      } else {
        toast.error('Failed to send message.');
      }
    } finally {
      setSending(false);
    }
  }, [content, sending, sendMessage, roomId]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image uploads are supported for now (including GIF/webp stickers).');
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        toast.error('File too large. Max upload size is 12MB.');
        return;
      }

      setIsUploadingFile(true);
      try {
        const postUrl = await generateUploadUrl();
        const uploadResult = await fetch(postUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!uploadResult.ok) {
          throw new Error('Upload failed');
        }

        const { storageId } = (await uploadResult.json()) as { storageId: string };
        const fileUrl = `/api/storage/${storageId}`;

        await sendMessage({ roomId, content: fileUrl, type: 'media' });
        toast.success('Image sent');
      } catch {
        toast.error('Failed to upload image');
      } finally {
        setIsUploadingFile(false);
      }
    },
    [generateUploadUrl, roomId, sendMessage]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void handleSend();
    }
  }

  if (isRecording) {
    return (
      <div className="border-border bg-background border-t p-3">
        <VoiceRecorder roomId={roomId} onCancel={() => setIsRecording(false)} onSendComplete={() => setIsRecording(false)} />
      </div>
    );
  }

  if (isDrawing) {
    return (
      <div className="border-border bg-background border-t p-3">
        <CanvasDraw roomId={roomId} onCancel={() => setIsDrawing(false)} onSendComplete={() => setIsDrawing(false)} />
      </div>
    );
  }

  return (
    <div className="border-border bg-background relative border-t p-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            void handleFileUpload(file);
          }
          e.currentTarget.value = '';
        }}
      />

      <Dialog open={showGifDialog} onOpenChange={setShowGifDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send GIF or Sticker URL</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Input
              value={gifUrl}
              onChange={(e) => setGifUrl(e.target.value)}
              placeholder="https://media.giphy.com/..."
            />
            <Button
              onClick={async () => {
                const url = gifUrl.trim();
                if (!/^https?:\/\/.+/i.test(url)) {
                  toast.error('Enter a valid URL');
                  return;
                }
                try {
                  await sendMessage({ roomId, content: url, type: 'media' });
                  setGifUrl('');
                  setShowGifDialog(false);
                } catch {
                  toast.error('Failed to send GIF');
                }
              }}
              disabled={!gifUrl.trim()}
            >
              Send GIF
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex w-full items-end gap-2">
        <div className="flex shrink-0 flex-col gap-1 pb-1.5">
          <button
            type="button"
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex size-8 items-center justify-center rounded-lg transition-colors"
            aria-label="Attach image"
            title="Upload image/sticker"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingFile || sending}
          >
            {isUploadingFile ? (
              <Icon icon="solar:refresh-linear" className="size-5 animate-spin" />
            ) : (
              <Icon icon="solar:paperclip-linear" className="size-5" />
            )}
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <RichTextEditor
            value={content}
            onChange={setContent}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={sending || isUploadingFile}
            className="w-full shadow-sm"
          />
        </div>

        <div className="flex shrink-0 gap-1 pb-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-accent hover:text-foreground size-8 rounded-lg"
            onClick={() => setShowGifDialog(true)}
            disabled={sending || isUploadingFile}
            aria-label="Send GIF"
            title="GIF"
          >
            <Icon icon="solar:gif-linear" className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-accent hover:text-foreground size-8 rounded-lg"
            onClick={() => setIsRecording(true)}
            disabled={sending || isUploadingFile}
            aria-label="Record voice message"
            title="Voice message"
          >
            <Icon icon="solar:microphone-2-linear" className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-accent hover:text-foreground size-8 rounded-lg"
            onClick={() => setIsDrawing(true)}
            disabled={sending || isUploadingFile}
            aria-label="Draw sketch"
            title="Sketch"
          >
            <Icon icon="solar:pen-new-square-linear" className="size-4" />
          </Button>

          <Button
            size="icon"
            className="ml-1 size-8 rounded-lg"
            onClick={() => void handleSend()}
            disabled={!content.trim() || sending || isUploadingFile}
            aria-label="Send message"
            title="Send (Ctrl+Enter)"
          >
            {sending ? '...' : <Icon icon="solar:arrow-right-linear" className="size-4" />}
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground mt-1 text-center text-xs">Ctrl+Enter to send</p>
    </div>
  );
}
