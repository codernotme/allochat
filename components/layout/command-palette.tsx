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
  const { setTheme } = useTheme();

  const user = useQuery(api.users.getCurrentUser);
  const role: Role = user?.role || 'user';
  const tier: SubscriptionTier = user?.subscriptionTier || 'free';

  // Toggle the menu when ⌘K is pressed
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
    command();
  }, []);

  const navItems = getNavItemsForUser(role, tier);

  return (
    <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={true} title="Search App" description="Find rooms, users, or jump to a page">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
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

      </CommandList>
    </CommandDialog>
  );
}
