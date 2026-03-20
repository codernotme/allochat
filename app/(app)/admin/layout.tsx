'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (user === null || (user && user.role !== 'admin' && user.role !== 'owner')) {
      router.replace('/lobby');
    }
  }, [router, user]);

  if (user === undefined) return <div className="h-screen flex items-center justify-center">Loading…</div>;
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    return null;
  }

  return (
    <div className="from-background via-background to-muted/20 flex min-h-screen bg-linear-to-br text-foreground">
      {/* Admin Sidebar */}
      <aside className="w-72 border-r border-border/70 bg-card/60 sticky top-0 flex h-screen flex-col gap-6 overflow-y-auto p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary size-9 rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
            <Icon icon="solar:shield-keyhole-bold" className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight">Admin Panel</span>
            <span className="text-muted-foreground text-[11px]">Management console</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          <AdminNavLink href="/admin" icon="solar:widget-2-linear" label="Overview" />
          <AdminNavLink href="/admin/users" icon="solar:users-group-rounded-linear" label="Users" />
          <AdminNavLink href="/admin/rooms" icon="solar:chat-round-dots-linear" label="Rooms" />
          <AdminNavLink href="/admin/reports" icon="solar:flag-linear" label="Reports" />
          <AdminNavLink href="/admin/content-filter" icon="solar:shield-warning-linear" label="Word Filter" />
          <AdminNavLink href="/admin/gifts" icon="solar:gift-linear" label="Gifts" />
          <AdminNavLink href="/admin/badges" icon="solar:medal-star-linear" label="Badges" />
          <AdminNavLink href="/admin/addons" icon="solar:blocks-group-solid" label="Addons" />
          <AdminNavLink href="/admin/audit" icon="solar:clipboard-list-linear" label="Audit Logs" />
          <AdminNavLink href="/admin/settings" icon="solar:settings-linear" label="Site Settings" />
          <div className="mt-4 border-t border-border/70 pt-4">
            <AdminNavLink href="/lobby" icon="solar:alt-arrow-left-linear" label="Back to App" />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="hover:bg-accent/70 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors"
    >
      <Icon icon={icon} className="size-4" />
      {label}
    </Link>
  );
}
