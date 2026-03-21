import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { EmoticonText } from './EmoticonText';
import { Icon } from '@iconify/react';
import { MessageActions } from './MessageActions';

const EMOJI_QUICK = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

// Simple check for messages that only contain emojis or custom emoticons
const isOnlyEmojis = (text: string) => {
  // Check if it's less than 20 chars and doesn't contain regular words
  // Custom emoticons are wrapped with : or are unicode emojis
  if (!text || text.length > 30) return false;
  const stripped = text.replace(/(:[a-zA-Z0-9_]+:|\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu, '').trim();
  return stripped.length === 0;
};

type Props = { message: any; grouped?: boolean };

export function MessageBubble({ message, grouped }: Props) {
  const user = useQuery(api.users.getCurrentUser);
  const addReaction = useMutation(api.messages.addReaction);
  const removeReaction = useMutation(api.messages.removeReaction);
  const deleteMsg = useMutation(api.messages.deleteMessage);
  const editMessage = useMutation(api.messages.editMessage);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  async function handleReaction(emoji: string) {
    const alreadyReacted = message.reactions
      ?.find((r: any) => r.emoji === emoji)
      ?.userIds?.length > 0;
    try {
      if (alreadyReacted) {
        await removeReaction({ messageId: message._id, emoji });
      } else {
        await addReaction({ messageId: message._id, emoji });
      }
    } catch {
      toast.error('Failed to add reaction');
    }
  }

  async function handleSaveEdit() {
    if (editContent.trim() === message.content) { setIsEditing(false); return; }
    try {
      await editMessage({ messageId: message._id, newContent: editContent.trim() });
      setIsEditing(false);
    } catch {
      toast.error('Failed to edit message');
    }
  }

  const isOwn = user?._id === message.senderId;
  const canDelete = isOwn || user?.role === 'admin' || user?.role === 'owner' || user?.role === 'moderator';

  if (message.isDeleted) {
    return (
      <div className="py-0.5 px-12">
        <p className="text-muted-foreground/60 text-xs italic bg-accent/20 w-fit px-2 py-0.5 rounded-full">[Message deleted]</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex gap-3 px-4 py-1 transition-all hover:bg-accent/40",
        !grouped && "mt-3",
        message.whisperTo && "bg-purple-500/5 hover:bg-purple-500/10 border-l-2 border-purple-500",
        isEditing && "bg-muted/50"
      )}
    >
      {/* Avatar */}
      {!grouped ? (
        <Avatar className="mt-1 size-9 border border-border/50 shadow-sm transition-transform hover:scale-105">
          <AvatarImage src={message.sender?.image} />
          <AvatarFallback className="bg-primary/10 text-[10px] font-bold">
            {message.sender?.name?.slice(0, 2).toUpperCase() || '??'}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-9 shrink-0 flex justify-end pr-2">
          <span className="text-[9px] text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-opacity font-medium mt-1">
            {time.split(':')[1].split(' ')[0]}
          </span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        {/* Header */}
        {!grouped && (
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold tracking-tight hover:underline cursor-pointer">
              {message.sender?.name || 'Anonymous'}
            </span>
            <LevelBadge level={message.sender?.level || 1} />
            <span className="text-muted-foreground text-[10px] font-medium opacity-70 ml-1">{time}</span>
            {message.whisperTo && (
              <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 ml-1">
                <Icon icon="solar:lock-keyhole-minimalistic-bold" className="size-3" /> Whisper
              </span>
            )}
            {message.editedAt && (
              <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest opacity-40 ml-1">(edited)</span>
            )}
          </div>
        )}

        {/* Reply reference */}
        {message.replyToMsg && (
          <div className="border-primary/50 bg-muted/40 mb-1 rounded-r-lg border-l-4 px-3 py-1.5 text-xs text-muted-foreground w-fit max-w-sm flex items-center gap-1.5 cursor-pointer hover:bg-muted/60 transition-colors">
            <Icon icon="solar:reply-line-duotone" className="size-3" />
            <span className="font-semibold">{message.replyToMsg.senderName}:</span>
            <span className="truncate italic">
               {message.replyToMsg.type === 'media' ? 'Shared media' : message.replyToMsg.content}
            </span>
          </div>
        )}

        {/* Content */}
        {message.type === 'voice' ? (
          <div className="mt-1">
            <audio src={message.content} controls className="h-10 w-64 max-w-full" />
          </div>
        ) : message.type === 'media' ? (
          <div className="mt-1">
            {getYouTubeId(message.content) ? (
              <iframe
                width="100%"
                height="auto"
                className="max-w-md w-full aspect-video rounded-xl border border-border/50 shadow-sm"
                src={`https://www.youtube.com/embed/${getYouTubeId(message.content)}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={message.content}
                alt="Shared media"
                className="max-h-80 max-w-full rounded-xl border border-border/50 object-contain shadow-sm"
                loading="lazy"
              />
            )}
          </div>
        ) : message.type === 'sketch' ? (
          <div className="mt-1 flex justify-center bg-white rounded-lg p-1 border">
            <img src={message.content} alt="Sketch" className="max-w-xs md:max-w-sm rounded object-contain max-h-64" />
          </div>
        ) : isEditing ? (
          <div className="mt-1 flex flex-col gap-2 max-w-sm w-full">
            <textarea
              className="bg-background border-primary/50 text-foreground resize-none rounded-lg border p-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full"
              value={editContent}
              aria-label="Edit message"
              onChange={(e) => {
                setEditContent(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsEditing(false);
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveEdit(); }
              }}
              autoFocus
              rows={1}
            />
            <div className="flex gap-1 justify-end">
              <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button size="sm" className="h-6 text-xs px-3" onClick={handleSaveEdit}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="relative group/content max-w-[85%]">
             <p className={cn(
               "leading-relaxed whitespace-pre-wrap break-words",
               isOnlyEmojis(message.content) ? "text-5xl" : "text-sm"
             )}>
               <EmoticonText content={message.content} largeEmoticons={isOnlyEmojis(message.content)} />
             </p>
             {grouped && (
               <div className="text-[10px] text-muted-foreground/0 group-hover/content:text-muted-foreground/60 transition-opacity absolute -left-12 bottom-0 select-none pointer-events-none text-right w-10">
                 {time}
               </div>
             )}
          </div>
        )}

        {/* System message */}
        {message.type === 'system' && (
          <p className="text-muted-foreground text-center text-xs italic">{message.content}</p>
        )}

        {/* Reactions */}
        {message.reactions?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {message.reactions.map((r: any) => (
              <button
                key={r.emoji}
                onClick={() => handleReaction(r.emoji)}
                className="border-border hover:border-primary flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors"
              >
                {r.emoji} {r.userIds.length}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover actions */}
      {!isEditing && (
        <MessageActions 
          isOwn={isOwn}
          canDelete={canDelete}
          onReact={handleReaction}
          onReply={() => window.dispatchEvent(new CustomEvent('reply-to', { detail: message }))}
          onEdit={() => { setIsEditing(true); setEditContent(message.content); }}
          onDelete={async () => {
            try { await deleteMsg({ messageId: message._id }); }
            catch { toast.error('Cannot delete message'); }
          }}
        />
      )}
    </div>
  );
}
