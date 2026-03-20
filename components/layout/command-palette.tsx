'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Icon } from '@iconify/react';
import { getNavItemsForUser } from '@/lib/data/nav-items';
import type { Role } from '@/lib/data/roles';
import type { SubscriptionTier } from '@/lib/data/subscription-plans';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useTheme } from 'next-themes';

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const { setTheme } = useTheme();

  const user = useQuery(api.users.getCurrentUser);
  const role: Role = user?.role || 'user';
  const tier: SubscriptionTier = user?.subscriptionTier || 'free';

  // Live room search
  const rooms = useQuery(
    api.rooms.searchRooms,
    query.length >= 1 ? { query } : 'skip'
  );

  // Live user search
  const users = useQuery(
    api.users.searchUsers,
    query.length >= 1 ? { query } : 'skip'
  );

  // Toggle the menu when ⌘K or Ctrl+K is pressed
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    setQuery('');
    command();
  }, []);

  const navItems = getNavItemsForUser(role, tier);

  return (
    <CommandDialog
      open={open}
      onOpenChange={(v) => { setOpen(v); if (!v) setQuery(''); }}
      showCloseButton={true}
      title="Global Search"
      description="Find rooms, users, or jump to a page"
    >
      <CommandInput
        placeholder="Search rooms, users, or jump to..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Room search results */}
        {rooms && rooms.length > 0 && (
          <>
            <CommandGroup heading="Rooms">
              {rooms.map((room: any) => (
                <CommandItem
                  key={room._id}
                  value={`room-${room._id}`}
                  onSelect={() => runCommand(() => router.push(`/room/${room._id}`))}
                >
                  <span className="mr-2 text-base">{room.icon || '💬'}</span>
                  <span>{room.name}</span>
                  {room.onlineCount > 0 && (
                    <span className="ml-auto text-xs text-muted-foreground">{room.onlineCount} online</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* User search results */}
        {users && users.length > 0 && (
          <>
            <CommandGroup heading="Users">
              {users.map((u: any) => (
                <CommandItem
                  key={u._id}
                  value={`user-${u._id}`}
                  onSelect={() => runCommand(() => router.push(`/profile/${u._id}`))}
                >
                  <Icon icon="solar:user-linear" className="mr-2 size-4 text-muted-foreground" />
                  <span>{u.displayName || u.username}</span>
                  <span className="ml-2 text-xs text-muted-foreground">@{u.username}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Static nav items */}
        {!query && (
          <CommandGroup heading="Navigation">
            {navItems.map((item) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                <Icon icon={item.icon} className="mr-2 size-4 text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!query && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Theme">
              <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                <Icon icon="solar:sun-2-linear" className="mr-2 size-4 text-muted-foreground" />
                <span>Light Theme</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                <Icon icon="solar:moon-stars-linear" className="mr-2 size-4 text-muted-foreground" />
                <span>Dark Theme</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
                <Icon icon="solar:monitor-linear" className="mr-2 size-4 text-muted-foreground" />
                <span>System Theme</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
