'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as Id<'users'>;
  const user = useQuery(api.users.getUserProfile, { userId });
  const currentUser = useQuery(api.users.getCurrentUser);
  const isOwnProfile = currentUser?._id === userId;

  if (user === undefined) return <div className="p-8 text-center">Loading profile…</div>;
  if (!user) return <div className="p-8 text-center">User not found</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Banner / Header */}
      <div className="relative mb-20">
        <div className="bg-primary/10 h-48 w-full rounded-2xl border-b" />
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <Avatar className="size-32 border-4 border-background shadow-lg">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-4xl text-foreground">😊</AvatarFallback>
          </Avatar>
          <div className="mb-4 flex flex-col gap-1">
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground text-sm font-medium italic">@{user.username}</p>
          </div>
        </div>
        <div className="absolute -bottom-14 right-8 flex gap-2">
          {isOwnProfile ? (
            <Link href="/settings/profile" className={cn(buttonVariants({ variant: 'default' }))}>
              Edit Profile
            </Link>
          ) : (
            <>
              <Button>Add Friend</Button>
              <Button variant="secondary">Message</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Bio & Info */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-bold">About</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-foreground leading-relaxed italic whitespace-pre-wrap">
                {user.bio || "No bio yet. This user is a mystery! 🕵️"}
              </p>
              
              <Separator className="bg-border/30" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Pronouns</span>
                  <span className="text-sm font-medium">{user.pronouns || 'Not set'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Language</span>
                  <span className="text-sm font-medium">{user.language || 'English'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Joined</span>
                  <span className="text-sm font-medium">{new Date(user._creationTime).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Status</span>
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    <div className={`size-2 rounded-full ${user.presenceStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {user.presenceStatus || 'offline'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity / Stats placeholder */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-bold">Interests</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests?.map((i: string) => (
                  <Badge key={i} variant="secondary" className="px-3 py-1 text-sm italic">
                    {i}
                  </Badge>
                )) || <p className="text-muted-foreground text-sm italic">No interests listed.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Gamification & Badges */}
        <div className="flex flex-col gap-6">
          <Card className="border-border/50 bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-bold">Experience</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Level {user.level || 1}</span>
                <span className="text-muted-foreground text-xs font-medium italic">{user.xp || 0} XP</span>
              </div>
              <div className="bg-muted h-3 w-full overflow-hidden rounded-full border shadow-inner">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-1000" 
                  style={{ width: '45%' }} 
                />
              </div>
              <p className="text-muted-foreground text-center text-xs italic">
                {/* Math for XP to next level here */}
                🚀 240 XP to next level
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <h2 className="text-lg font-bold">Badges</h2>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {/* Badge placeholder */}
              <div className="bg-muted flex size-12 items-center justify-center rounded-xl text-2xl grayscale transition-all hover:grayscale-0" title="AlloChat Veteran">🌟</div>
              <div className="bg-muted flex size-12 items-center justify-center rounded-xl text-2xl grayscale transition-all hover:grayscale-0" title="Early Adopter">🚀</div>
              <div className="bg-muted flex size-12 items-center justify-center rounded-xl text-2xl grayscale transition-all hover:grayscale-0" title="Top Chatter">🔥</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
