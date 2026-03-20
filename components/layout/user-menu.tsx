'use client';

import { useQuery } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icon } from '@iconify/react';

export function UserMenu() {
  const user = useQuery(api.users.getCurrentUser);
  const { signOut } = useAuthActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          className="hover:bg-muted relative flex items-center gap-2 rounded-full p-1 transition-colors"
          aria-label="User menu"
        >
          <Avatar className="size-8 ring-2 ring-border">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {user?.displayName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || (
                <Icon icon="solar:user-circle-linear" className="size-4" />
              )}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <p className="font-semibold">{user?.displayName || user?.username || 'User'}</p>
          <p className="text-muted-foreground text-xs font-normal">
            @{user?.username} · Lv. {user?.level || 1}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0">
          <Link href={`/profile/${user?._id}`} className="flex w-full items-center gap-2 px-3 py-2">
            <Icon icon="solar:user-circle-linear" className="size-4" />
            View Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0">
          <Link href="/settings/profile" className="flex w-full items-center gap-2 px-3 py-2">
            <Icon icon="solar:settings-linear" className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0">
          <Link href="/settings/appearance" className="flex w-full items-center gap-2 px-3 py-2">
            <Icon icon="solar:pallete-2-linear" className="size-4" />
            Appearance
          </Link>
        </DropdownMenuItem>

        {(user?.role === 'admin' || user?.role === 'owner') && (
          <DropdownMenuItem className="p-0">
            <Link href="/admin" className="flex w-full items-center gap-2 px-3 py-2 text-primary">
              <Icon icon="solar:shield-check-linear" className="size-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0">
          <Link href="/notifications" className="flex w-full items-center gap-2 px-3 py-2">
            <Icon icon="solar:bell-linear" className="size-4" />
            Notifications
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
          onClick={() => signOut()}
        >
          <Icon icon="solar:logout-2-linear" className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
