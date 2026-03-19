import { Cursor } from "@/components/cursor";
import { AnimatedHero } from "@/components/animated-hero";
import { FeatureCard } from "@/components/feature-card";
import { homeData } from "@/app/data/home";

export default function Page() {
  return (
    <main className="bg-background relative min-h-svh overflow-hidden selection:bg-primary/20 selection:text-primary">
      <Cursor />
      
      {/* Dynamic Backgrounds */}
      <div className="absolute top-0 -left-64 h-[40rem] w-[40rem] rounded-full bg-primary/10 blur-[130px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-64 -right-64 h-[40rem] w-[40rem] rounded-full bg-secondary/10 blur-[130px] pointer-events-none mix-blend-screen" />
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-20 pb-12 sm:px-8 md:gap-24 md:py-32 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <AnimatedHero />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative z-10 w-full [perspective:1000px]">
            {homeData.features.map((feature, index) => (
              <FeatureCard
                key={index}
                index={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-medium text-muted-foreground z-10 w-full">
          <span className="flex items-center gap-2 backdrop-blur-md bg-background/50 px-4 py-2 rounded-full border border-border/40 shadow-sm transition-colors hover:bg-background/80">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            {homeData.footer.left} Systems Operational
          </span>
          <span className="bg-secondary/10 text-secondary-foreground border border-secondary/20 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm backdrop-blur-md transition-all hover:bg-secondary/20">
            {homeData.footer.right}
          </span>
        </div>
      </section>
    </main>
  );
}
