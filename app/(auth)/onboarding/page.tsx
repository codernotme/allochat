'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@iconify/react';

const STEPS = ['Profile', 'Age', 'Interests', 'Social', 'Room', 'Done'] as const;
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

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [step, setStep] = useState<Step>('Profile');
  
  // Profile State
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarStorageId, setAvatarStorageId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Age State
  const [age, setAge] = useState<string>('');
  
  // Interests State
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Social State
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasInit, setHasInit] = useState(false);

  const redirectParam = searchParams.get('redirect');
  const redirectTarget =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : '/chat/lobby';

  // Auto-fill from current user data
  useEffect(() => {
    if (currentUser && !hasInit) {
      if (currentUser.displayName && currentUser.displayName !== 'User') {
        setDisplayName(currentUser.displayName);
      }
      if (currentUser.username && !currentUser.username.startsWith('user')) {
        setUsername(currentUser.username);
      }
      if ((currentUser as any).avatarUrl) {
        setAvatarUrl((currentUser as any).avatarUrl);
      }
      setHasInit(true);
    }
  }, [currentUser, hasInit]);

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateProfile = useMutation(api.users.updateProfile);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const { storageId } = await result.json();
      setAvatarStorageId(storageId);
      setAvatarUrl(URL.createObjectURL(file));
      toast.success('Avatar uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  async function handleFinish() {
    setLoading(true);
    try {
      const socialLinks = [];
      if (twitter) socialLinks.push({ platform: 'twitter', url: twitter });
      if (github) socialLinks.push({ platform: 'github', url: github });

      await updateProfile({
        displayName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatar: avatarStorageId || undefined,
        interests: selectedInterests,
        age: age ? parseInt(age) : undefined,
        socialLinks: socialLinks.length > 0 ? socialLinks : undefined,
        onboardingCompleted: true,
      });
      toast.success('Welcome to AlloChat!');
      router.push(redirectTarget);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto py-10 px-4">
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
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`text-[10px] uppercase tracking-wider font-bold transition-colors whitespace-nowrap ${i <= stepIndex ? 'text-primary' : 'text-muted-foreground'}`}
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
            <div className="relative">
              <div className="bg-muted flex size-24 items-center justify-center rounded-full overflow-hidden border-2 border-border shadow-md">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <Icon icon="solar:user-circle-linear" className="size-12 text-muted-foreground" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Icon icon="solar:refresh-linear" className="animate-spin text-white size-6" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground size-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-all">
                <Icon icon="solar:camera-linear" className="size-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
              </label>
            </div>
            <p className="text-muted-foreground text-xs">{uploading ? 'Uploading…' : 'Update your avatar'}</p>
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
            onClick={() => setStep('Age')}
          >
            Continue →
          </Button>
        </div>
      )}

      {/* Step: Age */}
      {step === 'Age' && (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-center mb-4">
                <Icon icon="solar:calendar-bold-duotone" className="size-12 text-primary mx-auto" />
                <h3 className="text-lg font-bold">How old are you?</h3>
                <p className="text-muted-foreground text-sm">We use this to customize your experience and ensure safety.</p>
            </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="age">Your Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={13}
              max={120}
            />
            <p className="text-muted-foreground text-[10px]">You must be at least 13 to use AlloChat.</p>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('Profile')}>← Back</Button>
            <Button
                className="flex-1"
                disabled={!age || parseInt(age) < 13}
                onClick={() => setStep('Interests')}
            >
                Continue →
            </Button>
          </div>
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
            <Button variant="outline" className="flex-1" onClick={() => setStep('Age')}>← Back</Button>
            <Button
              className="flex-1"
              disabled={selectedInterests.length < 3}
              onClick={() => setStep('Social')}
            >
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step: Social */}
      {step === 'Social' && (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-center mb-4">
                <Icon icon="solar:link-bold-duotone" className="size-12 text-primary mx-auto" />
                <h3 className="text-lg font-bold">Social Handles</h3>
                <p className="text-muted-foreground text-sm">Connect your other profiles (optional).</p>
            </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="twitter">Twitter / X</Label>
                <div className="relative">
                    <Icon icon="brandico:twitter-bird" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        id="twitter"
                        placeholder="https://x.com/username"
                        className="pl-10"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="github">GitHub</Label>
                <div className="relative">
                    <Icon icon="brandico:github" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        id="github"
                        placeholder="https://github.com/username"
                        className="pl-10"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                    />
                </div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('Interests')}>← Back</Button>
            <Button
                className="flex-1"
                onClick={() => setStep('Room')}
            >
                {(!twitter && !github) ? 'Skip' : 'Continue'} →
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
            <Button variant="outline" className="flex-1" onClick={() => setStep('Social')}>← Back</Button>
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

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-55 items-center justify-center">
          <Icon icon="lucide:loader-2" className="size-4 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
