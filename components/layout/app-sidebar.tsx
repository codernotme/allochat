'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getLevelFromXP } from '@/lib/data/xp-actions';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, getNavItemsForUser } from '@/lib/data/nav-items';
import type { Role } from '@/lib/data/roles';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

export function AppSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuthActions(); // Keep original signOut from useAuthActions
  const user = useQuery(api.users.getCurrentUser);
  const { xpInCurrentLevel, xpToNextLevel } = getLevelFromXP(user?.xp || 0);
  const [collapsed, setCollapsed] = useState(false);

  const role: Role = user?.role || 'user';
  const allowedItems = getNavItemsForUser(role);

  const mainItems = allowedItems.filter((i) => i.section === 'main');
  const socialItems = allowedItems.filter((i) => i.section === 'social');
  const discoverItems = allowedItems.filter((i) => i.section === 'discover');
  const adminItems = allowedItems.filter((i) => i.section === 'admin');

  return (
    <aside
      className={cn(
        'border-border bg-card flex h-screen flex-col border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 border-b p-4', collapsed && 'justify-center')}>
        <div className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-lg text-lg">
          <Icon icon="solar:chat-round-dots-bold" className="size-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-foreground text-lg font-bold tracking-tight">AlloChat</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        <NavSection label="Main" items={mainItems} collapsed={collapsed} pathname={pathname} />
        <NavSection label="Social" items={socialItems} collapsed={collapsed} pathname={pathname} />
        <NavSection label="Discover" items={discoverItems} collapsed={collapsed} pathname={pathname} />
        {adminItems.length > 0 && (
          <NavSection label="Admin" items={adminItems} collapsed={collapsed} pathname={pathname} />
        )}
      </nav>

      {/* Bottom: collapse toggle + sign out */}
      <div className="border-border flex flex-col gap-1 border-t p-2">
        {/* User Progress */}
        {user && (
          <div className="flex flex-col gap-2 px-2 pt-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight">
              <span className="text-muted-foreground">Level {user.level}</span>
              <span className="text-primary">{Math.floor(xpInCurrentLevel)} / {xpToNextLevel + xpInCurrentLevel} XP</span>
            </div>
            <Progress
              value={(xpInCurrentLevel / (xpToNextLevel + xpInCurrentLevel)) * 100}
              className="h-1.5 overflow-hidden rounded-full transition-all"
            />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
            collapsed && 'justify-center'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon
            icon={collapsed ? 'solar:alt-arrow-right-linear' : 'solar:alt-arrow-left-linear'}
            className="size-4"
          />
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={() => signOut()}
          className={cn(
            'text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
            collapsed && 'justify-center'
          )}
          aria-label="Sign out"
        >
          <Icon icon="solar:logout-2-linear" className="size-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

function NavSection({
  label,
  items,
  collapsed,
  pathname,
}: {
  label: string;
  items: typeof NAV_ITEMS;
  collapsed: boolean;
  pathname: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      {!collapsed && (
        <p className="text-muted-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          {label}
        </p>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              collapsed && 'justify-center px-2'
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon icon={item.icon} className="size-4" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </div>
  );
}
