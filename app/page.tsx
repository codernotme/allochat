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
      redirect('/onboarding');
    }
    if (user.role === 'owner') {
      redirect('/admin');
    }
    redirect('/lobby');
  }

  return <HomeContent />;
}
