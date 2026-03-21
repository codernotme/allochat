import type { Metadata } from 'next';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@iconify/react';

export const metadata: Metadata = { title: 'Sign Up' };

type SignUpPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

const getRedirectSuffix = (redirect?: string) => {
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return '';
  }
  return `?redirect=${encodeURIComponent(redirect)}`;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { redirect } = await searchParams;
  const redirectSuffix = getRedirectSuffix(redirect);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="text-muted-foreground text-sm">
          Join AlloChat — it&apos;s free forever
        </p>
      </div>

      {/* OAuth */}
      <div className="flex flex-col gap-3">
        <Link href={`/auth/sign-in/oauth?provider=google${redirectSuffix ? `&${redirectSuffix.slice(1)}` : ''}`} className="border-border bg-input/30 hover:bg-input/50 hover:text-foreground inline-flex h-11 w-full items-center justify-center gap-3 rounded-4xl border px-3 text-sm font-medium transition-colors">
            <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-muted-foreground text-xs">or</span>
        <Separator className="flex-1" />
      </div>

      <div className="flex flex-col gap-3">
        <Link href={`/auth/sign-up/email${redirectSuffix}`} className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 w-full items-center justify-center gap-2 rounded-4xl px-3 text-sm font-medium transition-colors">
          <Icon icon="solar:letter-linear" className="size-4" />
          Sign up with Email
        </Link>
      </div>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
        <Link href={`/auth/sign-in${redirectSuffix}`} className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
