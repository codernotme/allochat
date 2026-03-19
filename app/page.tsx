import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function Page() {
  return (
    <main className="bg-background min-h-svh">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">AlloChat v2.0</p>
            <h1 className="text-foreground text-4xl font-bold leading-tight md:text-6xl">
              Real-time chat, rooms, and calls in one place.
            </h1>
            <p className="text-muted-foreground max-w-xl text-base md:text-lg">
              Build communities with instant messaging, voice/video calls, profiles, and gamification powered by Next.js + Convex.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/sign-up" className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-4xl px-4 text-sm font-medium transition-colors">
                Get Started
              </Link>
              <Link href="/sign-in" className="border-border bg-background hover:bg-muted inline-flex h-10 items-center justify-center rounded-4xl border px-4 text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/lobby" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex h-10 items-center justify-center rounded-4xl px-4 text-sm font-medium transition-colors">
                Explore Lobby
              </Link>
            </div>
          </div>

          <div className="from-primary/10 via-background to-secondary/10 border-border grid gap-4 rounded-3xl border bg-gradient-to-br p-5 shadow-sm">
            <FeatureRow icon="solar:chat-round-dots-linear" title="Realtime Messaging" text="Low-latency room chat with reactions and mentions." />
            <FeatureRow icon="solar:phone-calling-rounded-linear" title="Voice & Video" text="Join room calls with reliable signaling and quality controls." />
            <FeatureRow icon="solar:users-group-rounded-linear" title="Community Rooms" text="Create public or private spaces with moderation controls." />
            <FeatureRow icon="solar:medal-ribbons-star-linear" title="Gamification" text="Levels, badges, streaks, and leaderboards to boost engagement." />
          </div>
        </div>

        <div className="text-muted-foreground border-border flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm">
          <span>AlloChat v2.0</span>
          <span>Next.js + Convex + Base UI</span>
        </div>
      </section>
    </main>
  )
}

function FeatureRow({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="bg-card/70 border-border flex items-start gap-3 rounded-2xl border p-4">
      <div className="bg-primary/10 text-primary rounded-xl p-2">
        <Icon icon={icon} className="size-5" />
      </div>
      <div>
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground mt-1 text-sm">{text}</p>
      </div>
    </div>
  );
}
