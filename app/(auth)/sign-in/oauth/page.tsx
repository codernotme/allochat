'use client';

import { useEffect, useMemo, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icon } from '@iconify/react';

const SUPPORTED_PROVIDERS = new Set(['google']);

const resolveRedirectTarget = (value: string | null) => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/lobby';
  }
  return value;
};

function OAuthSignInContent() {
  const { signIn } = useAuthActions();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasStartedRef = useRef(false);

  const provider = useMemo(() => {
    const raw = searchParams.get('provider') || '';
    return raw.toLowerCase();
  }, [searchParams]);

  const redirectTarget = useMemo(() => {
    return resolveRedirectTarget(searchParams.get('redirect'));
  }, [searchParams]);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;

    async function run() {
      if (!provider || !SUPPORTED_PROVIDERS.has(provider)) {
        toast.error('Unsupported OAuth provider.');
        router.replace(`/sign-in?redirect=${encodeURIComponent(redirectTarget)}`);
        return;
      }

      try {
        await signIn(provider, { redirectTo: redirectTarget });
      } catch {
        toast.error('OAuth sign-in could not start. Check provider env keys and Convex deployment.');
        router.replace(`/sign-in?redirect=${encodeURIComponent(redirectTarget)}`);
      }
    }

    run();
  }, [provider, redirectTarget, router, signIn]);

  return (
    <div className="flex min-h-55 items-center justify-center">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Icon icon="lucide:loader-2" className="size-4 animate-spin" />
        Redirecting to OAuth provider...
      </div>
    </div>
  );
}

export default function OAuthSignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-55 items-center justify-center"><Icon icon="lucide:loader-2" className="size-4 animate-spin text-muted-foreground" /></div>}>
      <OAuthSignInContent />
    </Suspense>
  );
}
