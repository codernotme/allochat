import type { Metadata } from "next";
import { Icon } from "@iconify/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the AlloChat team — support, partnerships, press, and more.",
};

const contactMethods = [
  {
    icon: "solar:letter-bold",
    title: "General Support",
    description: "Questions about your account, room issues, or anything else?",
    link: "mailto:support@allochat.app",
    linkLabel: "support@allochat.app",
  },
  {
    icon: "solar:shield-bold",
    title: "Trust & Safety",
    description: "Report a serious violation, CSAM, or urgent safety concern.",
    link: "mailto:safety@allochat.app",
    linkLabel: "safety@allochat.app",
  },
  {
    icon: "solar:lock-bold",
    title: "Privacy & Data",
    description: "Requests related to your personal data, GDPR, or our privacy practices.",
    link: "mailto:privacy@allochat.app",
    linkLabel: "privacy@allochat.app",
  },
  {
    icon: "solar:handshake-bold",
    title: "Partnerships",
    description: "Interested in partnering with AlloChat or exploring business opportunities?",
    link: "mailto:partnerships@allochat.app",
    linkLabel: "partnerships@allochat.app",
  },
  {
    icon: "solar:tv-bold",
    title: "Press & Media",
    description: "Press inquiries, media kits, and interview requests.",
    link: "mailto:press@allochat.app",
    linkLabel: "press@allochat.app",
  },
  {
    icon: "solar:danger-triangle-bold",
    title: "Legal",
    description: "For legal notices, subpoenas, and copyright / IP concerns.",
    link: "mailto:legal@allochat.app",
    linkLabel: "legal@allochat.app",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-background min-h-svh">
      <Navbar />

      <div className="relative pt-36 pb-8 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[30rem] w-[60rem] rounded-full bg-primary/6 blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="relative mx-auto max-w-3xl px-6 sm:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary ring-1 ring-primary/25 mb-6">
            Get in Touch
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-4">Contact Us</h1>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            We&apos;re a small team but we read every message. Choose the right channel below and we&apos;ll get back to you as quickly as we can.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 sm:px-8 py-12 pb-24">
        {/* Contact Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {contactMethods.map((method) => (
            <a
              key={method.title}
              href={method.link}
              className="group flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-1 hover:bg-card/80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all group-hover:scale-110 group-hover:rotate-3">
                <Icon icon={method.icon} className="size-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground mb-1">{method.title}</h2>
                <p className="text-xs leading-relaxed text-muted-foreground mb-3">{method.description}</p>
                <span className="text-xs font-semibold text-primary underline underline-offset-4 decoration-primary/40 group-hover:decoration-primary/80 transition-colors">
                  {method.linkLabel}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Response Time Banner */}
        <div className="rounded-2xl border border-border/40 bg-muted/40 p-6 text-center backdrop-blur-md mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-sm font-semibold text-foreground">Support is Active</span>
          </div>
          <p className="text-sm text-muted-foreground">
            We typically respond within <strong className="text-foreground">1–2 business days</strong>. Safety reports are reviewed within <strong className="text-foreground">24 hours</strong>.
          </p>
        </div>

        {/* Social / Community */}
        <div className="rounded-2xl border border-border/40 bg-card/50 p-7 backdrop-blur-md shadow-sm text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">Also find us on</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Have a quick question? Our community on Discord is often the fastest place to get help.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://twitter.com/allochat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-muted hover:scale-105"
            >
              <Icon icon="solar:twitter-bold" className="size-4" />
              Twitter / X
            </a>
            <a
              href="https://discord.gg/allochat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-muted hover:scale-105"
            >
              <Icon icon="solar:chat-round-bold" className="size-4" />
              Discord Community
            </a>
            <a
              href="https://github.com/allochat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-muted hover:scale-105"
            >
              <Icon icon="solar:code-bold" className="size-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
