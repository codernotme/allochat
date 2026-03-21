import { redirect } from 'next/navigation';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { HomeContent } from './HomeContent';

export default async function Page() {
  const token = await convexAuthNextjsToken();
  const user = token ? await fetchQuery(api.users.getCurrentUser, {}, { token }) : null;

  if (user) {
    if (user.onboardingCompleted === false) {
      redirect('/auth/onboarding');
    }
    if (user.role === 'owner') {
      redirect('/platform/admin');
    }
    redirect('/chat/lobby');
  }

  return <HomeContent />;
}
