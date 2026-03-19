'use client';

import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

export default function MagicLinkPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await signIn('resend', { email: data.email, flow: 'signIn' });
      setSent(true);
      toast.success('Magic link and code sent to your email!');
    } catch {
      toast.error('Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="mx-auto bg-green-500/10 p-3 rounded-full text-green-600">
          <Icon icon="lucide:mail-check" className="size-8" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">Check your inbox</h2>
          <p className="text-muted-foreground text-sm">We've sent a magic link to your email.</p>
        </div>
        <Button onClick={() => router.push('/sign-in')} variant="outline" className="mt-2">
          Return to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold">Sign in with Magic Link</h2>
        <p className="text-muted-foreground text-sm">We'll email you a secure sign in link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="h-11 w-full font-semibold" disabled={loading}>
          {loading ? 'Sending link…' : 'Send Magic Link'}
        </Button>
      </form>

      <div className="flex flex-col gap-3 text-center text-sm">
        <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
