import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How AlloChat uses cookies and similar tracking technologies.",
};

const cookieTypes = [
  {
    name: "Strictly Necessary Cookies",
    required: true,
    description:
      "These cookies are essential for the platform to function correctly. They keep you logged in, maintain your session state, and remember your security preferences. These cannot be disabled.",
    examples: "Session token, CSRF token, theme preference",
  },
  {
    name: "Performance & Analytics Cookies",
    required: false,
    description:
      "These cookies help us understand how users interact with AlloChat — for example, which rooms are most popular, where users spend the most time, and what errors occur. We use this data to improve the platform.",
    examples: "Page views, session duration, feature usage events",
  },
  {
    name: "Functional Cookies",
    required: false,
    description:
      "These cookies remember your preferences and personalise your experience, such as language settings, notification configurations, and sidebar layout.",
    examples: "Language preference, notification settings, UI layout",
  },
  {
    name: "Marketing Cookies",
    required: false,
    description:
      "If you opt in, these cookies help us understand the effectiveness of our advertising campaigns and show you relevant content. We do not share this data with advertisers for third-party advertising.",
    examples: "Campaign source tracking, referral attribution",
  },
];

export default function CookiesPage() {
  return (
    <main className="bg-background min-h-svh">
      <Navbar />

      <div className="relative pt-36 pb-8 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[30rem] w-[60rem] rounded-full bg-primary/6 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/25 mb-6">
            Legal
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4">Cookie Policy</h1>
          <p className="text-base text-muted-foreground">Last updated: March 19, 2026</p>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            This policy explains what cookies are, what we use them for, and how you can control them.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 sm:px-8 py-12 pb-24 flex flex-col gap-8">
        {/* What are cookies */}
        <section className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">What Are Cookies?</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Cookies are small text files that websites store on your device when you visit them. They are widely used to make websites work efficiently, to remember your preferences, and to provide information to site owners. Cookies set by AlloChat are first-party cookies. We may also use third-party cookies from trusted partners for analytics purposes.
          </p>
        </section>

        {/* Cookie types */}
        <section className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-6">Types of Cookies We Use</h2>
          <div className="flex flex-col gap-5">
            {cookieTypes.map((ct) => (
              <div key={ct.name} className="rounded-xl border border-border/30 bg-background/50 p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="text-sm font-bold text-foreground">{ct.name}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ct.required ? "bg-primary/10 text-primary ring-1 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                    {ct.required ? "Required" : "Optional"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground mb-2">{ct.description}</p>
                <p className="text-xs text-muted-foreground/70"><span className="font-medium">Examples:</span> {ct.examples}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Control */}
        <section className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">Controlling Cookies</h2>
          <div className="text-sm leading-relaxed text-muted-foreground space-y-3">
            <p>You can control and manage cookies in several ways:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li><strong className="text-foreground">Browser Settings</strong> — most browsers let you view, block, or delete cookies through their settings menus.</li>
              <li><strong className="text-foreground">Platform Settings</strong> — once logged in, visit your account settings to manage optional cookie preferences.</li>
              <li><strong className="text-foreground">Opt-out Links</strong> — for third-party analytics tools we use, you can opt out via their own opt-out mechanisms.</li>
            </ul>
            <p>Note: disabling strictly necessary cookies will affect the functionality of AlloChat. You may not be able to stay logged in or use core chat features.</p>
          </div>
        </section>

        {/* Updates */}
        <section className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">Changes to This Policy</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of AlloChat after changes constitutes your acceptance of this updated policy.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">Contact Us</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Questions about this Cookie Policy? Contact us at{" "}
            <a href="mailto:privacy@allochat.app" className="text-primary underline underline-offset-4">privacy@allochat.app</a>
          </p>
        </section>

        <p className="text-center text-sm text-muted-foreground pt-2">
          Also see our{" "}
          <Link href="/privacy" className="text-primary underline underline-offset-4">Privacy Policy</Link>{" "}
          and{" "}
          <Link href="/terms" className="text-primary underline underline-offset-4">Terms of Service</Link>.
        </p>
      </div>

      <Footer />
    </main>
  );
}
