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
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useDebounce } from '@/hooks/use-debounce'; // Assuming this exists or I'll add it
import { Icon } from '@iconify/react';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username too long')
      .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((v) => v, 'You must agree to the terms'),
    ageVerification: z.boolean().refine((v) => v, 'You must be 13 or older'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ chars', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Symbol', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : 'bg-muted'}`}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">{score > 0 ? labels[score - 1] : ''}</p>
    </div>
  );
}

export default function SignUpEmailPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUsername = useMutation(api.users.generateUniqueUsername);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
    }
  });

  const password = watch('password', '');
  const username = watch('username', '');
  const name = watch('name', '');
  const debouncedUsername = useDebounce(username, 500);
  
  const isAvailable = useQuery(api.users.checkUsernameAvailability, 
    debouncedUsername && debouncedUsername.length >= 3 ? { username: debouncedUsername } : 'skip'
  );

  const handleGenerateUsername = async () => {
    if (!name && !watch('email')) {
      toast.error('Enter your name or email first to generate a username');
      return;
    }
    setIsGenerating(true);
    try {
      const base = name || watch('email').split('@')[0];
      const result = await generateUsername({ base });
      setValue('username', result);
      trigger('username');
      toast.success('Generated a cool username for you!');
    } catch {
      toast.error('Failed to generate username');
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(data: FormData) {
    if (isAvailable === false) {
      toast.error('This username is already taken');
      return;
    }
    setLoading(true);
    try {
      await signIn('password', {
        email: data.email,
        password: data.password,
        name: data.name,
        username: data.username,
        flow: 'signUp',
      });

      // Generate and send an OTP immediately after signup so verification has a valid code row.
      await signIn('resend', {
        email: data.email,
        flow: 'signIn',
      });

      router.push(`/verify-email?email=${encodeURIComponent(data.email)}&sent=1`);
    } catch {
      toast.error('Could not create account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="text-muted-foreground text-sm">Free forever. No credit card required.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Your name" {...register('name')} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="username">Username</Label>
            <button 
              type="button" 
              onClick={handleGenerateUsername}
              disabled={isGenerating}
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium"
            >
              {isGenerating ? (
                <Icon icon="lucide:loader-2" className="animate-spin" />
              ) : (
                <Icon icon="lucide:wand-2" />
              )}
              Auto-generate
            </button>
          </div>
          <div className="relative">
            <Input 
              id="username" 
              placeholder="choose_a_unique_id" 
              {...register('username')} 
              aria-invalid={!!errors.username || isAvailable === false}
              className="pr-10"
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              {debouncedUsername.length >= 3 && (
                <>
                  {isAvailable === undefined ? (
                    <Icon icon="lucide:loader-2" className="text-muted-foreground animate-spin" />
                  ) : isAvailable ? (
                    <Icon icon="lucide:check-circle-2" className="text-green-500" />
                  ) : (
                    <Icon icon="lucide:x-circle" className="text-destructive" />
                  )}
                </>
              )}
            </div>
          </div>
          {errors.username && <p className="text-destructive text-xs">{errors.username.message}</p>}
          {debouncedUsername.length >= 3 && isAvailable === false && (
            <p className="text-destructive text-xs">Username is already taken</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
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
          <PasswordStrength password={password} />
          {errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            {...register('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input type="checkbox" {...register('ageVerification')} className="mt-1" />
          <span className="text-muted-foreground">
            I confirm I am 13 years of age or older (COPPA)
          </span>
        </label>
        {errors.ageVerification && (
          <p className="text-destructive -mt-3 text-xs">{errors.ageVerification.message}</p>
        )}

        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input type="checkbox" {...register('agreeToTerms')} className="mt-1" />
          <span className="text-muted-foreground">
            I agree to the{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-destructive -mt-3 text-xs">{errors.agreeToTerms.message}</p>
        )}

        <Button type="submit" className="h-11 w-full font-semibold" disabled={loading || isAvailable === false}>
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
