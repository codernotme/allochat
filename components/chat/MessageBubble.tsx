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

type Props = { message: any; grouped?: boolean };

const EMOJI_QUICK = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

export function MessageBubble({ message, grouped }: Props) {
  const addReaction = useMutation(api.messages.addReaction);
  const removeReaction = useMutation(api.messages.removeReaction);
  const deleteMsg = useMutation(api.messages.deleteMessage);
  const [showActions, setShowActions] = useState(false);

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
        !grouped && "mt-3"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
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
            {message.editedAt && (
              <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest opacity-40 ml-1">(edited)</span>
            )}
          </div>
        )}

        {/* Reply reference */}
        {message.replyTo && (
          <div className="border-primary/50 bg-muted/50 mb-1 rounded border-l-2 px-2 py-1 text-xs">
            Replying to a message
          </div>
        )}

        {/* Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          <EmoticonText content={message.content} />
        </p>

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
      {showActions && (
        <div className="border-border bg-background absolute -top-3 right-2 flex items-center gap-1 rounded-lg border p-1 shadow-md">
          {EMOJI_QUICK.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="hover:bg-accent rounded p-1 text-sm transition-colors"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={async () => {
              try { await deleteMsg({ messageId: message._id }); }
              catch { toast.error('Cannot delete this message'); }
            }}
          >
            🗑️
          </Button>
        </div>
      )}
    </div>
  );
}
