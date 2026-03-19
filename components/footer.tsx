import Link from "next/link";
import { Icon } from "@iconify/react";
import { footer, siteConfig } from "@/app/data/home";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-16">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-all group-hover:scale-110">
                <Icon icon="solar:chat-round-bold-duotone" className="size-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              {footer.tagline}
            </p>
            <div className="flex items-center gap-3">
              <a href={siteConfig.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-110">
                <Icon icon="solar:twitter-bold-duotone" className="size-4" />
              </a>
              <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-110">
                <Icon icon="solar:github-bold-duotone" className="size-4" />
              </a>
              <a href={siteConfig.socials.discord} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground hover:scale-110">
                <Icon icon="solar:chat-round-like-bold-duotone" className="size-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footer.links.map((group) => (
            <div key={group.heading}>
              <h4 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">{group.heading}</h4>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-sm text-muted-foreground sm:flex-row">
          <span>{footer.bottom}</span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
