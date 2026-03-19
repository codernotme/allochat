import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn the story behind AlloChat — who we are, why we built it, and what we stand for.",
};

const values = [
  {
    icon: "solar:heart-bold-duotone",
    title: "Human Connection First",
    description:
      "Every feature we build starts with one question: does this bring people closer together? Technology should serve relationships, not the other way around.",
  },
  {
    icon: "solar:shield-check-bold-duotone",
    title: "Safety By Design",
    description:
      "We build safety measures directly into the platform — not as an afterthought. Our moderation tools, reporting systems, and community guidelines exist to protect everyone.",
  },
  {
    icon: "solar:transparent-bold-duotone",
    title: "Radical Transparency",
    description:
      "We believe you deserve to know how our platform works, what we do with your data, and how decisions affecting you are made.",
  },
  {
    icon: "solar:rocket-bold-duotone",
    title: "Always Improving",
    description:
      "AlloChat is never \"done\". We ship improvements constantly, guided by community feedback and our mission to build the best chat platform in the world.",
  },
];

const team = [
  {
    initials: "AK",
    name: "Aryan K.",
    role: "Founder & CEO",
    bio: "Full-stack engineer with a passion for building real-time systems. Started AlloChat because he wanted a better place for genuine online conversations.",
  },
  {
    initials: "PL",
    name: "Priya L.",
    role: "Head of Community",
    bio: "Community builder with 8+ years running online spaces. Ensures AlloChat stays welcoming, safe, and genuinely fun for everyone.",
  },
  {
    initials: "JM",
    name: "Jake M.",
    role: "Lead Engineer",
    bio: "Backend systems architect obsessed with low latency. The reason AlloChat messages arrive in milliseconds, not seconds.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background min-h-svh overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[40rem] w-[80rem] rounded-full bg-primary/6 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="relative mx-auto max-w-4xl px-6 sm:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/25 mb-6">
            Our Story
          </span>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl mb-6">
            Built for real<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-muted-foreground">
              connections.
            </span>
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl max-w-2xl mx-auto">
            AlloChat was born out of frustration with chat platforms that feel cold, cluttered, or unsafe. We set out to build something different — a home for genuine conversation, everywhere you are.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28 border-y border-border/40 bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12 grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Our Mission</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-5">
              Make online conversation feel human again.
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base mb-4">
              Social media showed us how to broadcast ourselves. AlloChat is about something different: real-time togetherness. We believe that the best conversations happen in rooms — spaces shared with people who care about the same things you do.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              Whether you&apos;re looking for a study partner, a gaming crew, or just someone to talk to at 2am — AlloChat is built for that moment.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "10K+", label: "Active users" },
              { value: "500+", label: "Active rooms" },
              { value: "150+", label: "Countries" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/40 bg-card/60 p-6 text-center shadow-sm backdrop-blur-md">
                <p className="text-3xl font-extrabold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">What drives us</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our values</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="group flex flex-col gap-5 rounded-3xl border border-border/40 bg-card/40 p-7 shadow-sm backdrop-blur-md transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all group-hover:scale-110 group-hover:rotate-6">
                  <Icon icon={v.icon} className="size-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32 bg-muted/30 border-t border-border/40">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">The people behind it</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Meet the team</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-card/60 p-7 shadow-sm backdrop-blur-md">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-bold ring-2 ring-primary/20">
                  {member.initials}
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">{member.name}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{member.role}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8" />
        <div className="relative mx-auto max-w-2xl px-6">
          <h2 className="text-4xl font-extrabold tracking-tight mb-5">Join us on the journey</h2>
          <p className="text-muted-foreground mb-8 text-lg">AlloChat is just getting started. Help us build the future of online community.</p>
          <Link href="/sign-up" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-10 text-base font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95">
            Create Your Free Account
            <Icon icon="solar:arrow-right-bold" className="size-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
