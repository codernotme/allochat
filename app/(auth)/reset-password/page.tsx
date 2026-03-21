'use client';

import { useState, Suspense } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
  confirmPassword: z.string(),
  code: z.string().min(8, 'Reset code is required'),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetCode = searchParams?.get('code') || '';
  const redirectParam = searchParams?.get('redirect') || '';
  const redirectTarget =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : '/chat/lobby';
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    defaultValues: { code: resetCode },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      // Assuming convex resend uses the code as part of resetting
      // Note: Actual implementation depends on custom reset flow 
      await signIn('password', { resetPasswordCode: data.code, newPassword: data.password, flow: 'reset' });
      toast.success('Password reset successfully!');
      router.push(`/auth/sign-in?redirect=${encodeURIComponent(redirectTarget)}`);
    } catch {
      toast.error('Failed to reset password. The link might be expired.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <p className="text-muted-foreground text-sm">Create a new password for your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input type="hidden" {...register('code')} />
        
        {!resetCode && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="code">Reset Code</Label>
            <Input id="code" placeholder="Enter the code sent to your email" {...register('code')} aria-invalid={!!errors.code} />
            {errors.code && <p className="text-destructive text-xs">{errors.code.message}</p>}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              aria-invalid={!!errors.password}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-sm"
              aria-label="Toggle password"
            >
              <Icon icon={showPassword ? 'solar:eye-closed-bold-duotone' : 'solar:eye-bold-duotone'} className="size-5" />
            </button>
          </div>
          {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="h-11 w-full font-semibold" disabled={loading}>
          {loading ? 'Resetting…' : 'Reset Password'}
        </Button>
      </form>

      <div className="flex flex-col gap-3 text-center text-sm">
        <Link href={`/auth/sign-in?redirect=${encodeURIComponent(redirectTarget)}`} className="text-muted-foreground hover:text-foreground">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
