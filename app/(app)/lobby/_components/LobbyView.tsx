'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ROOM_CATEGORIES } from '@/lib/data/room-categories';
import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function LobbyView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Query rooms from Convex (will work once schema is deployed)
  const rooms = useQuery((api as any).rooms.listPublicRooms, {
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const featured = useQuery((api as any).rooms.getFeaturedRooms);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Lobby</h1>
        <p className="text-muted-foreground">Discover rooms and connect with communities</p>
      </div>

      {/* Search + Create */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">🔍</span>
          <Input
            placeholder="Search rooms…"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href="/rooms/create" className={cn(buttonVariants({ variant: 'default' }))}>
          + Create Room
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`bg-muted hover:bg-accent shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
        >
          🏠 All
        </button>
        {ROOM_CATEGORIES.slice(0, 10).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-accent'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Rooms */}
      {featured && featured.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">⭐ Featured</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((room: any) => (
              <RoomCard key={room._id} room={room} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Rooms */}
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold">
          {selectedCategory === 'all' ? '🌐 All Rooms' : `${ROOM_CATEGORIES.find(c => c.id === selectedCategory)?.emoji} ${ROOM_CATEGORIES.find(c => c.id === selectedCategory)?.label}`}
        </h2>

        {rooms === undefined && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-xl p-5 h-28" />
            ))}
          </div>
        )}

        {rooms?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <span className="text-4xl">🏜️</span>
            <p className="text-muted-foreground">No rooms found. Be the first to create one!</p>
            <Link href="/rooms/create" className={cn(buttonVariants({ variant: 'default' }), "mt-2")}>
              Create Room
            </Link>
          </div>
        )}

        {rooms && rooms.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rooms
              .filter((r: any) => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((room: any) => (
                <RoomCard key={room._id} room={room} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RoomCard({ room, featured }: { room: any; featured?: boolean }) {
  return (
    <Link href={`/room/${room._id}`}>
      <div className={`border-border hover:border-primary bg-card group flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all hover:shadow-md ${featured ? 'ring-primary/20 ring-1' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-xl text-xl">
            {room.icon || '💬'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-semibold">{room.name}</p>
              {room.isVerified && <span title="Verified">✅</span>}
            </div>
            {room.topic && (
              <p className="text-muted-foreground truncate text-xs">{room.topic}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <span>🟢</span>
            {room.onlineCount} online
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{room.memberCount} members</span>
          <span className="text-muted-foreground ml-auto">
            {room.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
