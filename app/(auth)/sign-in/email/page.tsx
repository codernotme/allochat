'use client';

import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react';

const schema = z.object({
  identifier: z.string().min(3, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function SignInEmailPage() {
  const { signIn } = useAuthActions();
  const convex = useConvex();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectParam = searchParams.get('redirect');
  const redirectTarget =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : '/lobby';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      let email = data.identifier.trim();
      
      // If it looks like a username (no @), resolve it to an email
      if (!email.includes('@')) {
        const user = await convex.query(api.users.getUserByUsername, { username: email });
        if (user && user.email) {
          email = user.email;
        } else {
          toast.error('User not found with this username');
          setLoading(false);
          return;
        }
      }

      await signIn('password', { email, password: data.password, flow: 'signIn' });
      window.location.assign(redirectTarget);
    } catch (err) {
      toast.error('Invalid email/username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold">Sign in</h2>
        <p className="text-muted-foreground text-sm">Enter your email or username to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="identifier">Email or Username</Label>
          <Input
            id="identifier"
            type="text"
            placeholder="you@example.com or your_username"
            autoComplete="username"
            {...register('identifier')}
            aria-invalid={!!errors.identifier}
          />
          {errors.identifier && <p className="text-destructive text-xs">{errors.identifier.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href={`/forgot-password?redirect=${encodeURIComponent(redirectTarget)}`}
              className="text-primary text-xs hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              aria-invalid={!!errors.password}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon icon={showPassword ? 'solar:eye-closed-bold-duotone' : 'solar:eye-bold-duotone'} className="size-5" />
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full font-semibold" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <div className="flex flex-col gap-3 text-center text-sm">
        <Link href={`/sign-in?redirect=${encodeURIComponent(redirectTarget)}`} className="text-muted-foreground hover:text-foreground">
          ← Other sign in methods
        </Link>
        <p className="text-muted-foreground">
          No account?{' '}
          <Link href={`/sign-up?redirect=${encodeURIComponent(redirectTarget)}`} className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
