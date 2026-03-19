import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how AlloChat collects, uses, and protects your personal data.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: `When you create an AlloChat account, we collect your email address, chosen username, and password (stored as a secure hash — we never store plain-text passwords). You may optionally provide a profile picture, display name, and bio.

During normal use of the platform we automatically collect device and browser information, IP address (used for moderation and fraud prevention), pages and features you interact with, and the timing of those interactions. We do not sell this data to third parties.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:
• Operate, maintain, and improve AlloChat
• Deliver messages and manage your real-time sessions
• Personalise your experience (e.g., suggested rooms)
• Enforce our community guidelines and Terms of Service
• Respond to support requests
• Send you important service notifications (not marketing, unless you opt in)`,
  },
  {
    title: "3. Data Sharing",
    content: `We do not sell, rent, or trade your personal information. We may share limited data with:

• Service providers who operate infrastructure on our behalf (e.g., hosting, email delivery). These providers are contractually bound to protect your data.
• Law enforcement or regulatory authorities when required by law or to protect the safety of our users.
• Other users only what you choose to make public on your profile.`,
  },
  {
    title: "4. Cookies",
    content: `AlloChat uses cookies and similar technologies to keep you logged in, remember your theme preference, and measure platform performance. You can control cookie behaviour in your browser settings. Disabling cookies may affect certain features of the platform.`,
    id: "cookies",
  },
  {
    title: "5. Data Retention",
    content: `We retain your account data for as long as your account remains active. If you delete your account, we remove your personal data within 30 days, except where retention is required for legal compliance or fraud prevention.

Chat messages in public rooms are stored with an automatic expiry and are regularly purged. Private messages are end-to-end accessible only to the participants.`,
  },
  {
    title: "6. Your Rights",
    content: `Depending on your location, you may have the right to:
• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your data ("right to be forgotten")
• Object to or restrict processing of your data
• Data portability

To exercise any of these rights, contact us at privacy@allochat.app.`,
  },
  {
    title: "7. Children's Privacy",
    content: `AlloChat is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has created an account, please contact us immediately at safety@allochat.app and we will promptly remove the account.`,
  },
  {
    title: "8. Security",
    content: `We employ industry-standard security measures including TLS encryption for data in transit, bcrypt password hashing, regular security audits, and strict access controls for our engineering team. No method of transmission over the internet is 100% secure, but we take every reasonable precaution.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. If we make material changes, we will notify you via the platform or by email at least 7 days before the changes take effect. Continued use of AlloChat after changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about this Privacy Policy or your data, please contact our Data Protection team at:

Email: privacy@allochat.app
Address: AlloChat Inc., [Your Office Address]`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-background min-h-svh">
      <Navbar />

      <div className="relative pt-36 pb-8 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[30rem] w-[60rem] rounded-full bg-primary/6 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/25 mb-6">
            Legal
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4">Privacy Policy</h1>
          <p className="text-base text-muted-foreground">Last updated: March 19, 2026</p>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            Your privacy matters to us. This policy explains what data AlloChat collects, how we use it, and your rights in plain, honest language.
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
      </div>

      <Footer />
    </main>
  );
}
