import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "AlloChat's refund and cancellation policy for any paid features or subscriptions.",
};

export default function RefundPage() {
  return (
    <main className="bg-background min-h-svh">
      <Navbar />

      <div className="relative pt-36 pb-8 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[30rem] w-[60rem] rounded-full bg-primary/6 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/25 mb-6">
            Legal
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4">Refund & Cancellation Policy</h1>
          <p className="text-base text-muted-foreground">Last updated: March 19, 2026</p>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            We want you to be completely satisfied with AlloChat. This policy explains our approach to refunds and cancellations.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 sm:px-8 py-12 pb-24 flex flex-col gap-6">
        {[
          {
            title: "1. Free Tier",
            content: `AlloChat's core features — including messaging, room joining, and voice/video calls — are completely free. There is nothing to refund for the free tier.`,
          },
          {
            title: "2. Premium Subscriptions (Future)",
            content: `AlloChat may offer optional premium subscriptions in the future for enhanced features such as custom badges, extended call durations, and advanced room management tools.

When premium features are available:
• Monthly subscriptions may be cancelled at any time. You will retain access until the end of your current billing period.
• Annual subscriptions may be cancelled at any time. Unused full months remaining will be refunded on a pro-rata basis.
• Free trials, where offered, may be cancelled at any time before the trial ends with no charge.`,
          },
          {
            title: "3. Eligibility for Refunds",
            content: `A full refund may be issued if:
• You are charged due to a technical error on our platform
• You cancel within 48 hours of your first paid charge and have not made substantial use of the premium features
• A feature you paid for is permanently removed from the platform with less than 30 days notice

Refunds will not be issued for:
• Change of mind after 48 hours of first charge
• Violation of our Terms of Service leading to account suspension or termination
• Forgotten subscription — we send reminder emails before renewal`,
          },
          {
            title: "4. How to Request a Refund",
            content: `To request a refund, please contact our support team at refunds@allochat.app with the following information:
• Your registered email address
• The date of the charge
• A brief explanation of your reason for requesting a refund

We aim to respond to refund requests within 3 business days. Approved refunds are processed within 5–10 business days depending on your payment method and bank.`,
          },
          {
            title: "5. Chargebacks",
            content: `We strongly encourage you to contact us before initiating a chargeback with your bank. Chargebacks can result in your account being suspended while the dispute is resolved. We are committed to resolving issues fairly and promptly.`,
          },
          {
            title: "6. Changes to This Policy",
            content: `We may update this Refund Policy at any time. Changes will be communicated via email and posted on this page with an updated date.`,
          },
          {
            title: "7. Contact",
            content: `For refund-related questions:\nEmail: refunds@allochat.app\nOr visit our Contact page for other enquiries.`,
          },
        ].map((s) => (
          <section key={s.title} className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">{s.title}</h2>
            <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{s.content}</div>
          </section>
        ))}

        <p className="text-center text-sm text-muted-foreground pt-2">
          Also see our{" "}
          <Link href="/terms" className="text-primary underline underline-offset-4">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/contact" className="text-primary underline underline-offset-4">Contact Us</Link>.
        </p>
      </div>

      <Footer />
    </main>
  );
}
