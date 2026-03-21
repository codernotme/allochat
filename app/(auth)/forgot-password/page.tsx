'use client';

import { Suspense, useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react';

const schema = z.object({ email: z.string().email('Invalid email address') });
type FormData = z.infer<typeof schema>;

function ForgotPasswordContent() {
  const { signIn } = useAuthActions();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const redirectParam = searchParams.get('redirect');
  const redirectTarget =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : '/chat/lobby';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await signIn('password', { email: data.email, flow: 'reset' });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-3xl dark:bg-green-900">
          <Icon icon="solar:check-circle-linear" className="size-8 text-green-700 dark:text-green-200" />
        </div>
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-muted-foreground text-sm">
          If that email exists, we&apos;ve sent a password reset link. Check your inbox and spam folder.
        </p>
        <Link href={`/auth/sign-in?redirect=${encodeURIComponent(redirectTarget)}`} className="text-primary text-sm hover:underline">Back to sign in</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold">Forgot your password?</h2>
        <p className="text-muted-foreground text-sm">Enter your email and we&apos;ll send a reset link.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>
        <Button className="h-11 w-full font-semibold" disabled={loading}>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </Button>
      </form>
      <Link href={`/auth/sign-in?redirect=${encodeURIComponent(redirectTarget)}`} className="text-muted-foreground hover:text-foreground text-center text-sm">← Back to sign in</Link>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-55 items-center justify-center">
          <Icon icon="lucide:loader-2" className="size-4 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
