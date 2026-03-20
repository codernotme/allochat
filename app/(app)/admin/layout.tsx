'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);

  if (user === undefined) return <div className="h-screen flex items-center justify-center">Loading…</div>;
  if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
    redirect('/lobby');
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-muted/30 flex flex-col p-4 gap-6 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-primary-foreground">
            <Icon icon="solar:shield-keyhole-bold" className="size-5" />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="flex flex-col gap-1">
          <AdminNavLink href="/admin" icon="solar:widget-2-linear" label="Overview" />
          <AdminNavLink href="/admin/users" icon="solar:users-group-rounded-linear" label="Users" />
          <AdminNavLink href="/admin/rooms" icon="solar:chat-round-dots-linear" label="Rooms" />
          <AdminNavLink href="/admin/reports" icon="solar:flag-linear" label="Reports" />
          <AdminNavLink href="/admin/content-filter" icon="solar:shield-warning-linear" label="Word Filter" />
          <AdminNavLink href="/admin/gifts" icon="solar:gift-linear" label="Gifts" />
          <AdminNavLink href="/admin/badges" icon="solar:medal-star-linear" label="Badges" />
          <AdminNavLink href="/admin/audit" icon="solar:clipboard-list-linear" label="Audit Logs" />
          <AdminNavLink href="/admin/settings" icon="solar:settings-linear" label="Site Settings" />
          <div className="mt-4 pt-4 border-t border-border">
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
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
    >
      <Icon icon={icon} className="size-4" />
      {label}
    </Link>
  );
}
