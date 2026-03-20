'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { CommandPalette } from '@/components/layout/command-palette';

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname === '/onboarding';

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Sidebar — desktop only */}
      {!isOnboarding && (
        <div className="hidden md:flex">
          <AppSidebar />
        </div>
      )}

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {!isOnboarding && <TopBar />}
        <main className="min-h-0 flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {!isOnboarding && <CommandPalette />}
    </div>
  );
}
