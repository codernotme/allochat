'use client';

import { usePaginatedQuery, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type Props = { userId: Id<'users'> };

export function DMConversationView({ userId }: Props) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendDM = useMutation(api.messages.sendDirectMessage);
  const recipient = useQuery(api.users.getUserProfile, { userId });
  const currentUser = useQuery(api.users.getCurrentUser);

  // Get conversation - we'll search through all conversations
  const conversations = useQuery(api.messages.getConversations);
  const conversation = conversations?.find(
    (c: any) => c.participantIds.includes(userId) && c.participantIds.includes(currentUser?._id)
  );

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getDirectMessages,
    conversation ? { conversationId: conversation._id } : 'skip',
    { initialNumItems: 50 }
  );

  const messages = conversation ? [...results].reverse() : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [results.length]);

  async function handleSend() {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      await sendDM({ recipientId: userId, content: message.trim() });
      setMessage('');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border bg-card/50 flex items-center gap-3 border-b px-4 py-3 backdrop-blur">
        <Link href="/messages" className="hover:bg-muted rounded-lg p-1.5">
          <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
        </Link>
        <div className="bg-primary/10 flex size-9 items-center justify-center rounded-full">
          {recipient?.avatar ? (
            <img src={recipient.avatar} className="size-9 rounded-full object-cover" alt="" />
          ) : (
            <Icon icon="solar:user-circle-linear" className="size-5 text-primary" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold">{recipient?.displayName || recipient?.username || 'User'}</p>
          <p className="text-muted-foreground text-xs">
            {recipient?.presenceStatus === 'online' ? (
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-green-500" />
                Online
              </span>
            ) : 'Offline'}
          </p>
        </div>
        <div className="ml-auto">
          <Link href={`/profile/${userId}`} className="hover:bg-muted rounded-lg p-1.5 text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <Icon icon="solar:user-circle-linear" className="size-4" />
            Profile
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col overflow-y-auto p-4 gap-2">
        {status === 'LoadingFirstPage' && (
          <div className="flex flex-1 items-center justify-center">
            <div className="border-primary size-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}

        {!conversation && status !== 'LoadingFirstPage' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <Icon icon="solar:chat-round-dots-linear" className="text-muted-foreground size-12" />
            <p className="font-medium">Start a conversation</p>
            <p className="text-muted-foreground text-sm">Send your first message to {recipient?.displayName || 'this user'}.</p>
          </div>
        )}

        {status === 'CanLoadMore' && (
          <button onClick={() => loadMore(50)} className="text-primary hover:underline mb-2 self-center text-sm">
            Load older messages
          </button>
        )}

        {messages.map((msg: any) => {
          const isOwn = msg.senderId === currentUser?._id;
          return (
            <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                isOwn
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted rounded-bl-sm'
              }`}>
                <p className="leading-relaxed">{msg.content}</p>
                <p className={`mt-0.5 text-[10px] ${isOwn ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-border bg-background flex gap-2 border-t px-4 py-3">
        <Input
          placeholder={`Message ${recipient?.displayName || 'user'}…`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={sending}
          className="flex-1 rounded-xl"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="rounded-xl"
        >
          <Icon icon="solar:plain-3-bold" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
