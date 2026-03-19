import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Community Rules",
  description: "AlloChat Community Rules — the code of conduct that keeps our platform welcoming, safe, and fun.",
};

const rules = [
  {
    number: "01",
    title: "Be Kind & Respectful",
    description:
      "Treat every person you interact with as you would want to be treated. Harassment, bullying, hate speech, threats, or discriminatory language — based on race, gender, sexuality, religion, disability, or any other characteristic — will result in immediate action.",
  },
  {
    number: "02",
    title: "No Explicit or Adult Content",
    description:
      "AlloChat is used by people of all ages. Sharing, requesting, or promoting sexually explicit content in public rooms is strictly forbidden. Rooms designated as 18+ by room owners have separate guidelines, but CSAM (child sexual abuse material) is an absolute zero-tolerance violation reported to law enforcement immediately.",
  },
  {
    number: "03",
    title: "No Spam or Self-Promotion",
    description:
      "Do not flood rooms with repetitive messages, paste walls of text, or post unsolicited links promoting products, services, or other websites. Room owners may allow self-promotion in designated channels — always follow room-specific rules.",
  },
  {
    number: "04",
    title: "Protect Your Own Privacy",
    description:
      "Never share sensitive personal information — including your real name, address, phone number, school, or social media profiles — in public rooms. Be cautious with private messages too. AlloChat moderators will never ask you for your password.",
  },
  {
    number: "05",
    title: "No Impersonation",
    description:
      "Don't pretend to be another user, a moderator, an AlloChat staff member, a celebrity, or any real or fictional person in a misleading way. Your username and profile should represent you authentically.",
  },
  {
    number: "06",
    title: "No Illegal Activity",
    description:
      "Do not use AlloChat to facilitate or promote any illegal activity, including the distribution of pirated content, solicitation, drug sales, or violence. We cooperate fully with law enforcement.",
  },
  {
    number: "07",
    title: "Respect Room Rules",
    description:
      "Every room may have additional rules set by its owner or moderators. Familiarise yourself with those rules when you join a new room. Room moderators have authority to remove users who violate room-specific guidelines.",
  },
  {
    number: "08",
    title: "Use the Report System",
    description:
      "If you see something that violates these rules, use the in-room report button rather than engaging or retaliating. Our moderation team reviews all reports and takes action rapidly. Do not share screenshots of reported content publicly.",
  },
  {
    number: "09",
    title: "No Ban Evasion",
    description:
      "If your account has been suspended or banned, do not create new accounts to circumvent the restriction. Doing so will result in a permanent ban across all accounts and possible IP-level restrictions.",
  },
  {
    number: "10",
    title: "Keep It Fun",
    description:
      "AlloChat is about connection and community. Bring positive energy, be curious, meet new people, and enjoy the experience. We are all here to have a good time.",
  },
];

const enforcement = [
  { level: "Warning", description: "First-time or minor violations may receive a formal warning." },
  { level: "Mute / Timeout", description: "Temporary restriction from sending messages, usually 1–24 hours." },
  { level: "Suspension", description: "Account suspended for 3–30 days for repeated or serious violations." },
  { level: "Permanent Ban", description: "Permanent removal for severe violations such as CSAM, threats of violence, or repeated circumvention." },
];

export default function CommunityRulesPage() {
  return (
    <main className="bg-background min-h-svh">
      <Navbar />

      <div className="relative pt-36 pb-8 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[30rem] w-[60rem] rounded-full bg-primary/6 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/25 mb-6">
            Community
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4">Community Rules</h1>
          <p className="text-base text-muted-foreground">Last updated: March 19, 2026</p>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            These rules exist to make AlloChat welcoming, safe, and enjoyable for everyone. By using the platform, you agree to follow them.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 sm:px-8 py-12 pb-24 flex flex-col gap-5">
        {rules.map((rule) => (
          <section
            key={rule.number}
            className="flex gap-5 rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-md shadow-sm"
          >
            <div className="shrink-0 text-4xl font-black text-border/40 leading-none select-none pt-1">{rule.number}</div>
            <div>
              <h2 className="text-base font-bold text-foreground mb-2">{rule.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{rule.description}</p>
            </div>
          </section>
        ))}

        {/* Enforcement */}
        <section className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm mt-4">
          <h2 className="text-lg font-bold text-foreground mb-5">Enforcement Actions</h2>
          <div className="flex flex-col gap-3">
            {enforcement.map((e) => (
              <div key={e.level} className="flex items-start gap-4 rounded-xl border border-border/30 bg-background/40 p-4">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full ring-1 ring-primary/20 shrink-0 mt-0.5">{e.level}</span>
                <p className="text-sm leading-relaxed text-muted-foreground">{e.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Appeals */}
        <section className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">Appeals</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            If you believe an enforcement action was applied in error, you can appeal within 14 days by emailing{" "}
            <a href="mailto:appeals@allochat.app" className="text-primary underline underline-offset-4">appeals@allochat.app</a>.
            {" "}Include your username, the date of the action, and why you believe it was incorrect. We aim to respond within 5 business days. Decisions on permanent bans are final.
          </p>
        </section>

        <p className="text-center text-sm text-muted-foreground pt-2">
          Questions? Visit our{" "}
          <Link href="/contact" className="text-primary underline underline-offset-4">Contact page</Link>{" "}
          or review our{" "}
          <Link href="/terms" className="text-primary underline underline-offset-4">Terms of Service</Link>.
        </p>
      </div>

      <Footer />
    </main>
  );
}
