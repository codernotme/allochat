'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button';
import { NotificationBell } from './notification-bell';
import { UserMenu } from './user-menu';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { AppSidebar } from './app-sidebar';

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Generate simple breadcrumbs (e.g., /admin/users -> Admin / Users)
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((s, i) => {
    const label = s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');
    const href = '/' + segments.slice(0, i + 1).join('/');
    return { label, href };
  });

  return (
    <header className="border-border bg-background/80 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger className="flex items-center justify-center size-9 rounded-md hover:bg-accent hover:text-accent-foreground text-foreground">
              <Icon icon="solar:hamburger-menu-linear" className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px] border-none bg-transparent shadow-none" showCloseButton={false}>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="h-full w-full rounded-r-xl overflow-hidden shadow-2xl origin-left">
                <AppSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Breadcrumbs */}
        <div className="text-muted-foreground text-sm font-medium hidden sm:flex items-center gap-2">
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.href}>
                {idx > 0 && <span className="opacity-50">/</span>}
                <Link
                  href={crumb.href}
                  className={cn(
                    "hover:text-foreground transition-colors",
                    idx === breadcrumbs.length - 1 && "text-foreground font-semibold"
                  )}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))
          ) : (
            <span className="text-foreground font-semibold">Lobby</span>
          )}
        </div>
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
