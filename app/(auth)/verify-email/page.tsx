'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function VerifyEmailContent() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const wasSentFromSignup = searchParams.get('sent') === '1';
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const autoSentRef = useRef(false);

  useEffect(() => {
    // Fallback: if user lands directly on this page without an existing OTP send,
    // trigger one automatically so authVerificationCodes is populated.
    if (autoSentRef.current || !email || wasSentFromSignup) {
      return;
    }

    autoSentRef.current = true;

    void (async () => {
      try {
        await signIn('resend', { email, flow: 'signIn' });
        toast.success('Verification code sent.');
        setResendCooldown(60);
      } catch {
        toast.error('Could not send verification code. Please use resend.');
      }
    })();
  }, [email, signIn, wasSentFromSignup]);

  async function handleVerify(code: string) {
    setLoading(true);
    try {
      await signIn('resend', { code, email, flow: 'signIn' });
      router.push('/onboarding');
    } catch {
      toast.error('Invalid or expired code. Please try again.');
      setValue("");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    if (!email) {
      toast.error('Missing email in verification link. Please sign up again.');
      return;
    }

    try {
      // Convex Auth Email provider sends a new code when we trigger the email flow again.
      await signIn('resend', { email, flow: 'signIn' });
      toast.success('A new code has been sent to your email.');
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) { clearInterval(interval); return 0; }
          return c - 1;
        });
      }, 1000);
    } catch {
      toast.error('Could not resend. Please try again.');
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 text-3xl dark:bg-blue-900 border-4 border-white dark:border-slate-800 shadow-xl">
          <Icon icon="solar:letter-unread-bold-duotone" className="size-8 text-blue-600 dark:text-blue-300" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Check your inbox</h2>
        <p className="text-muted-foreground max-w-70 text-sm">
          We&apos;ve sent a 6-digit code to <span className="text-foreground font-medium">{email || 'your email'}</span>.
        </p>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(v) => setValue(v)}
          onComplete={handleVerify}
          disabled={loading}
        >
          <InputOTPGroup className="gap-2">
            <InputOTPSlot index={0} className="rounded-md border-2 size-12 text-lg font-bold" />
            <InputOTPSlot index={1} className="rounded-md border-2 size-12 text-lg font-bold" />
            <InputOTPSlot index={2} className="rounded-md border-2 size-12 text-lg font-bold" />
            <InputOTPSlot index={3} className="rounded-md border-2 size-12 text-lg font-bold" />
            <InputOTPSlot index={4} className="rounded-md border-2 size-12 text-lg font-bold" />
            <InputOTPSlot index={5} className="rounded-md border-2 size-12 text-lg font-bold" />
          </InputOTPGroup>
        </InputOTP>

        <Button
          className="h-11 w-full font-semibold shadow-lg shadow-primary/20"
          disabled={loading || value.length < 6}
          onClick={() => handleVerify(value)}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Icon icon="lucide:loader-2" className="animate-spin" />
              Verifying...
            </div>
          ) : 'Verify Email'}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="text-muted-foreground hover:text-foreground text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Didn't get the code? Resend"}
        </button>
        <button 
          onClick={() => router.push('/sign-up/email')}
          className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
        >
          Use a different email address
        </button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex h-40 items-center justify-center"><Icon icon="lucide:loader-2" className="size-8 animate-spin text-muted-foreground" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
