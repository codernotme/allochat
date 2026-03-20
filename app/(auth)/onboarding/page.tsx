'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuthActions } from '@convex-dev/auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react';

const STEPS = ['Profile', 'Interests', 'Room', 'Done'] as const;
type Step = (typeof STEPS)[number];

const INTERESTS = [
  'Gaming', 'Music', 'Coding', 'Art', 'Sports', 'Anime',
  'Movies', 'Travel', 'Food', 'Tech', 'Science', 'Fashion',
  'Reading', 'Fitness', 'Photography', 'Crypto',
];

const SUGGESTED_ROOMS = [
  { label: 'Gaming', icon: 'solar:gamepad-linear' },
  { label: 'Music', icon: 'solar:music-note-linear' },
  { label: 'Coding', icon: 'solar:code-linear' },
  { label: 'Language', icon: 'solar:global-linear' },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('Profile');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  const updateProfile = useMutation(api.users.updateProfile);

  async function handleFinish() {
    setLoading(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        interests: selectedInterests,
      });
      toast.success('Welcome to AlloChat!');
      router.push('/lobby');
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Setup your profile</h2>
          <span className="text-muted-foreground text-sm">{stepIndex + 1} / {STEPS.length}</span>
        </div>
        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-2">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`text-xs font-medium transition-colors ${i <= stepIndex ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Step: Profile */}
      {step === 'Profile' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-muted flex size-24 cursor-pointer items-center justify-center rounded-full text-4xl hover:opacity-80">
              <Icon icon="solar:user-circle-linear" className="size-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-xs">Click to upload avatar (coming soon)</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="How should we call you?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">@</span>
              <Input
                id="username"
                placeholder="your_username"
                className="pl-7"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bio">Bio <span className="text-muted-foreground">(optional)</span></Label>
            <Input
              id="bio"
              placeholder="Tell us a bit about yourself…"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
            />
          </div>
          <Button
            className="h-11 w-full"
            disabled={!displayName.trim() || !username.trim()}
            onClick={() => setStep('Interests')}
          >
            Continue →
          </Button>
        </div>
      )}

      {/* Step: Interests */}
      {step === 'Interests' && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-medium">What are you into?</p>
            <p className="text-muted-foreground text-sm">Pick at least 3 interests to personalize your experience.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const selected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary text-foreground'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('Profile')}>← Back</Button>
            <Button
              className="flex-1"
              disabled={selectedInterests.length < 3}
              onClick={() => setStep('Room')}
            >
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step: Room */}
      {step === 'Room' && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-medium">Find your community</p>
            <p className="text-muted-foreground text-sm">
              You can explore rooms after setup. We&apos;ll take you to the lobby.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SUGGESTED_ROOMS.map((cat) => (
              <div key={cat.label} className="border-border flex items-center gap-2 rounded-xl border p-3 text-sm font-medium">
                <Icon icon={cat.icon} className="size-4 text-muted-foreground" />
                {cat.label}
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('Interests')}>← Back</Button>
            <Button className="flex-1" onClick={() => setStep('Done')}>Continue →</Button>
          </div>
        </div>
      )}

      {/* Step: Done */}
      {step === 'Done' && (
        <div className="flex flex-col items-center gap-5 text-center">
          <Icon icon="solar:check-circle-linear" className="animate-bounce size-14 text-primary" />
          <div>
            <h3 className="text-xl font-bold">You&apos;re all set!</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome to AlloChat, {displayName || 'there'}! Your profile is ready.
            </p>
          </div>
          <Button className="h-11 w-full font-semibold" onClick={handleFinish} disabled={loading}>
            {loading ? 'Loading…' : 'Enter AlloChat'}
          </Button>
        </div>
      )}
    </div>
  );
}
