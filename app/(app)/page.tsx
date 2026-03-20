import { redirect } from 'next/navigation';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function AppPage() {
  const token = await convexAuthNextjsToken();
  if (!token) redirect('/sign-in');

  const user = await fetchQuery(api.users.getCurrentUser, {}, { token });
  if (user?.role === 'owner') {
    redirect('/admin');
  }
  redirect('/lobby');
}
