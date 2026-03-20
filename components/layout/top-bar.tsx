'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { NotificationBell } from './notification-bell';
import { UserMenu } from './user-menu';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

export function TopBar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-border bg-background/80 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-sm">
      {/* Breadcrumb placeholder */}
      <div className="text-muted-foreground text-sm font-medium">
        {/* Will be populated by page-level breadcrumbs */}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Command palette hint */}
        <kbd className="border-border bg-muted text-muted-foreground hidden rounded border px-2 py-1 text-xs md:flex">
          ⌘K
        </kbd>

        {/* Notifications */}
        <NotificationBell />

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          <Icon
            icon={theme === 'dark' ? 'solar:sun-2-linear' : 'solar:moon-stars-linear'}
            className="size-5"
          />
        </Button>

        {/* User menu dropdown */}
        <UserMenu />
      </div>
    </header>
  );
}
