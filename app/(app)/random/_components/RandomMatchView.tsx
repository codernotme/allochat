'use client';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

export function RandomMatchView() {
  const router = useRouter();
  const findRandomMatch = useMutation(api.users.findRandomMatch);
  const [matching, setMatching] = useState(false);

  async function handleFindMatch() {
    setMatching(true);
    try {
      const userId = await findRandomMatch({});
      if (!userId) {
        toast.info('No online match right now. Please try again in a moment.');
        return;
      }
      router.push(`/messages/${userId}`);
    } catch {
      toast.error('Could not find a random match right now.');
    } finally {
      setMatching(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6 md:p-10">
      <Card className="border-border/60 bg-card/70 overflow-hidden">
        <CardHeader className="space-y-3">
          <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl">
            <Icon icon="solar:shuffle-bold" className="size-6" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight">Random Match</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Omegle-style discovery: connect with a random online person, chat instantly, and make new friends.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="text-muted-foreground flex items-start gap-2 text-sm">
            <Icon icon="solar:shield-check-linear" className="mt-0.5 size-4 shrink-0" />
            Community rules still apply. Use block/report if someone is abusive.
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="lg"
              className="h-11 rounded-xl px-5"
              disabled={matching}
              onClick={handleFindMatch}
            >
              {matching ? (
                <>
                  <Icon icon="solar:refresh-linear" className="mr-2 size-4 animate-spin" />
                  Finding match...
                </>
              ) : (
                <>
                  <Icon icon="solar:users-group-rounded-linear" className="mr-2 size-4" />
                  Start Random Chat
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
