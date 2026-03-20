'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ROOM_CATEGORIES } from '@/lib/data/room-categories';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

export function LobbyView() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (currentUser && currentUser.onboardingCompleted === false) {
      router.replace('/onboarding');
    }
  }, [currentUser, router]);

  // Query rooms from Convex (will work once schema is deployed)
  const rooms = useQuery((api as any).rooms.listPublicRooms, {
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  const featured = useQuery((api as any).rooms.getFeaturedRooms);

  if (currentUser === undefined) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <Icon icon="solar:round-alt-fill-line-duotone" className="animate-spin text-primary size-10" />
      </div>
    );
  }

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
          <Icon icon="solar:magnifer-linear" className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
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
          className={`bg-muted hover:bg-accent inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <Icon icon="solar:home-smile-angle-linear" className="size-4" />
          All
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
          <h2 className="flex items-center gap-1.5 font-semibold">
            <Icon icon="solar:star-linear" className="size-4" />
            Featured
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((room: any) => (
              <RoomCard key={room._id} room={room} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Rooms */}
      <div className="flex flex-col gap-3">
        <h2 className="flex items-center gap-1.5 font-semibold">
          {selectedCategory === 'all' ? (
            <>
              <Icon icon="solar:global-linear" className="size-4" />
              All Rooms
            </>
          ) : (
            `${ROOM_CATEGORIES.find(c => c.id === selectedCategory)?.emoji} ${ROOM_CATEGORIES.find(c => c.id === selectedCategory)?.label}`
          )}
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
            <Icon icon="solar:chat-round-dots-linear" className="text-muted-foreground size-10" />
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
            {room.icon || <Icon icon="solar:chat-round-line-linear" className="size-5 text-primary" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-semibold">{room.name}</p>
              {room.isVerified && (
                <span title="Verified">
                  <Icon icon="solar:verified-check-bold" className="size-4 text-primary" />
                </span>
              )}
            </div>
            {room.topic && (
              <p className="text-muted-foreground truncate text-xs">{room.topic}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Icon icon="solar:record-circle-bold" className="size-3 text-green-500" />
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
