'use client';

import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexReactClient } from 'convex/react';
import type { ReactNode } from 'react';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const hasConvexUrl = typeof convexUrl === 'string' && convexUrl.length > 0;
const convex = hasConvexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) {
    return (
      <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
        <div className="border-border bg-card w-full max-w-xl rounded-xl border p-6 text-sm">
          <p className="font-semibold">Missing Convex client configuration</p>
          <p className="text-muted-foreground mt-2">
            Add NEXT_PUBLIC_CONVEX_URL to your environment and restart the Next.js server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConvexAuthProvider client={convex}>
      {children}
    </ConvexAuthProvider>
  );
}
