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
import { GifSearchDialog } from './GifSearchDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = { roomId: Id<'rooms'> };

export function MessageInput({ roomId }: Props) {
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [showGifDialog, setShowGifDialog] = useState(false);
  const [mediaMenuOpen, setMediaMenuOpen] = useState(false);

  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const getStorageUrl = useMutation(api.storage.getStorageUrl);
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
      toast.success('Message sent!');
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
        toast.error('Only image uploads are supported (PNG, JPEG, GIF, WebP).');
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
        
        // Get the resolved URL from backend
        try {
          const fileUrl = await getStorageUrl({ storageId });
          if (fileUrl) {
            await sendMessage({ roomId, content: fileUrl, type: 'media' });
            toast.success('Image sent!');
          }
        } catch {
          // Fallback to direct storage endpoint if resolution fails
          const fileUrl = `/api/storage/${storageId}`;
          await sendMessage({ roomId, content: fileUrl, type: 'media' });
          toast.success('Image sent!');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to upload image';
        toast.error(message);
      } finally {
        setIsUploadingFile(false);
        setMediaMenuOpen(false);
      }
    },
    [generateUploadUrl, getStorageUrl, roomId, sendMessage]
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
    <div className="border-border bg-background relative border-t p-2 sm:p-3">
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

      <GifSearchDialog open={showGifDialog} onOpenChange={setShowGifDialog} onSelectGif={async (gifUrl) => {
        try {
          await sendMessage({ roomId, content: gifUrl, type: 'media' });
          toast.success('GIF sent!');
        } catch {
          toast.error('Failed to send GIF');
        }
      }} />

      <div className="flex w-full items-end gap-2">
        {/* Media Menu Button */}
        <Popover open={mediaMenuOpen} onOpenChange={setMediaMenuOpen}>
          <PopoverTrigger className="text-muted-foreground hover:bg-accent hover:text-foreground shrink-0 size-8 sm:size-9 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" title="Add media (+ icon)" disabled={sending || isUploadingFile || isRecording || isDrawing}>
            <Icon icon="solar:plus-circle-linear" className="size-5 sm:size-6" />
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" side="top" align="start">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFile}
              >
                <Icon icon="solar:gallery-linear" className="size-5" />
                <span className="text-xs">Upload Image</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => {
                  setShowGifDialog(true);
                  setMediaMenuOpen(false);
                }}
              >
                <Icon icon="solar:gif-linear" className="size-5" />
                <span className="text-xs">GIF/Sticker</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => {
                  setIsRecording(true);
                  setMediaMenuOpen(false);
                }}
              >
                <Icon icon="solar:microphone-2-linear" className="size-5" />
                <span className="text-xs">Voice</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => {
                  setIsDrawing(true);
                  setMediaMenuOpen(false);
                }}
              >
                <Icon icon="solar:pen-new-square-linear" className="size-5" />
                <span className="text-xs">Draw</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="min-w-0 flex-1">
          <RichTextEditor
            value={content}
            onChange={setContent}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={sending || isUploadingFile || isRecording || isDrawing}
            className="w-full text-sm"
          />
        </div>

        <Button
          size="icon"
          className="shrink-0 size-8 sm:size-9 rounded-lg"
          onClick={() => void handleSend()}
          disabled={!content.trim() || sending || isUploadingFile || isRecording || isDrawing}
          aria-label="Send message"
          title="Send (Ctrl+Enter)"
        >
          {sending ? <Icon icon="solar:refresh-linear" className="size-4 sm:size-5 animate-spin" /> : <Icon icon="solar:arrow-right-linear" className="size-4 sm:size-5" />}
        </Button>
      </div>
      <p className="text-muted-foreground mt-1 text-center text-xs">Ctrl+Enter to send</p>
    </div>
  );
}
