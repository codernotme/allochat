'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Icon } from '@iconify/react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function MessagesView() {
  const conversations = useQuery(api.messages.getConversations);
  const [search, setSearch] = useState('');

  const filtered = conversations?.filter((c: any) =>
    !search || c.lastMessagePreview?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Direct Messages</h1>
        <p className="text-muted-foreground text-sm">Your private conversations</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Icon icon="solar:magnifer-linear" className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search conversations…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Conversations */}
      <div className="border-border overflow-hidden rounded-xl border">
        {conversations === undefined && (
          <div className="flex flex-col gap-3 p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="bg-muted size-10 animate-pulse rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="bg-muted h-3 w-24 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-40 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {conversations?.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Icon icon="solar:chat-round-dots-linear" className="text-muted-foreground size-12" />
            <p className="font-medium">No conversations yet</p>
            <p className="text-muted-foreground text-sm">Find friends in the lobby and start chatting!</p>
            <Link
              href="/lobby"
              className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'mt-2')}
            >
              Browse Lobby
            </Link>
          </div>
        )}

        {filtered && filtered.length > 0 && (
          <div className="divide-border divide-y">
            {filtered.map((conv: any) => {
              const otherId = conv.participantIds[0];
              return (
                <Link
                  key={conv._id}
                  href={`/messages/${otherId}`}
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/40"
                >
                  {/* Avatar */}
                  <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
                    <Icon icon="solar:user-circle-linear" className="size-5 text-primary" />
                  </div>

                  {/* Preview */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">
                        User {otherId?.slice(-6)}
                      </p>
                      <span className="text-muted-foreground shrink-0 text-xs">
                        {conv.lastMessageAt
                          ? formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })
                          : ''}
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      {conv.lastMessagePreview || 'No messages yet'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
