import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AlloChat Terms of Service — the rules and guidelines for using our platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using AlloChat ("the Service"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the Service.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 13 years old to use AlloChat. If you are between 13 and 18 years old, you must have parental or guardian consent. By using AlloChat you represent and warrant that you meet these age requirements.`,
  },
  {
    title: "3. Account Registration",
    content: `You must provide accurate, current, and complete information when creating an account. You are responsible for maintaining the security of your account credentials. Do not share your password. Notify us immediately at security@allochat.app if you suspect unauthorised access to your account.`,
  },
  {
    id: "rules",
    title: "4. Community Rules & Acceptable Use",
    content: `You agree NOT to:
• Post, share, or transmit any content that is illegal, harmful, threatening, abusive, harassing, defamatory, obscene, or invasive of another's privacy
• Impersonate any person or entity or misrepresent your affiliation with a person or entity
• Harass, bully, or intimidate other users
• Spam or post unsolicited promotional content
• Distribute malware, viruses, or any other malicious code
• Share content that sexually exploits minors (CSAM) — this is reported to NCMEC and law enforcement immediately
• Attempt to hack, exploit, or disrupt the platform
• Circumvent bans or other enforcement actions

Violation of these rules will result in immediate account suspension or termination, and may be reported to law enforcement.`,
  },
  {
    title: "5. User Content",
    content: `You retain ownership of any content you post on AlloChat. By posting content, you grant AlloChat a worldwide, non-exclusive, royalty-free licence to use, display, reproduce, and distribute that content solely for the purpose of operating and improving the Service.

You are solely responsible for the content you post. AlloChat reserves the right to remove content that violates these Terms.`,
  },
  {
    title: "6. Privacy",
    content: `Our collection and use of your personal data is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please read it carefully.`,
  },
  {
    title: "7. Moderation & Enforcement",
    content: `AlloChat reserves the right to moderate content and user behaviour at its sole discretion. Actions we may take include: content removal, warnings, temporary suspension, or permanent account termination.

Appeals for enforcement actions may be submitted to support@allochat.app within 14 days.`,
  },
  {
    title: "8. Intellectual Property",
    content: `AlloChat and its underlying technology, design, trademarks, and content are owned by AlloChat Inc. and protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    title: "9. Disclaimers & Limitation of Liability",
    content: `AlloChat is provided "as is" without warranty of any kind. To the fullest extent permitted by law, AlloChat Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.`,
  },
  {
    title: "10. Changes to Terms",
    content: `We may update these Terms at any time. If we make material changes, we will notify you at least 7 days in advance via the platform or by email. Continued use of the Service after changes take effect constitutes your acceptance of the revised Terms.`,
  },
  {
    title: "11. Contact",
    content: `For questions about these Terms, contact us at:
Email: legal@allochat.app`,
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background min-h-svh">
      <Navbar />

      <div className="relative pt-36 pb-8 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[30rem] w-[60rem] rounded-full bg-primary/6 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/25 mb-6">
            Legal
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4">Terms of Service</h1>
          <p className="text-base text-muted-foreground">Last updated: March 19, 2026</p>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            These Terms govern your use of AlloChat. By using our platform, you agree to these rules. Please read them carefully.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 sm:px-8 py-12 pb-24">
        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <section
              key={s.title}
              id={s.id}
              className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm"
            >
              <h2 className="text-lg font-bold text-foreground mb-4">{s.title}</h2>
              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{s.content}</div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Questions? Email us at{" "}
          <a href="mailto:legal@allochat.app" className="text-primary underline underline-offset-4 hover:text-primary/80">
            legal@allochat.app
          </a>{" "}
          or visit our{" "}
          <Link href="/about" className="text-primary underline underline-offset-4 hover:text-primary/80">
            About page
          </Link>
          .
        </p>
      </div>

      <Footer />
    </main>
  );
}
