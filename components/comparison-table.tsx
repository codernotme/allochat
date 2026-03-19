"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { comparison } from "@/app/data/home";
import { cn } from "@/lib/utils";

export function ComparisonTable() {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Why AlloChat over the rest?
          </h2>
        </div>

        <div className="relative overflow-x-auto rounded-3xl border border-border/40 bg-card/40 shadow-sm backdrop-blur-md">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="bg-muted/50 text-xs uppercase text-foreground">
              <tr>
                <th scope="col" className="px-6 py-5 font-bold">Feature</th>
                <th scope="col" className="px-6 py-5 font-bold text-center bg-primary/10 text-primary border-x border-primary/20">AlloChat</th>
                <th scope="col" className="px-6 py-5 font-bold text-center">Discord</th>
                <th scope="col" className="px-6 py-5 font-bold text-center">Slack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {comparison.map((item, index) => (
                <motion.tr
                  key={item.feature}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                    {item.feature}
                  </td>
                  <td className="px-6 py-4 text-center bg-primary/5 border-x border-primary/10">
                    {item.allochat === true ? (
                      <Icon icon="solar:check-circle-bold" className="size-6 text-primary mx-auto" />
                    ) : (
                      <span className="font-semibold">{item.allochat}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.discord === true ? (
                      <Icon icon="solar:check-circle-bold" className="size-5 text-foreground/50 mx-auto" />
                    ) : item.discord === false ? (
                      <Icon icon="solar:close-circle-bold" className="size-5 text-red-500/50 mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-1.5 text-yellow-500/80 font-medium">
                        <Icon icon="solar:danger-circle-bold" className="size-5" />
                        {item.discord}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.slack === true ? (
                      <Icon icon="solar:check-circle-bold" className="size-5 text-foreground/50 mx-auto" />
                    ) : item.slack === false ? (
                      <Icon icon="solar:close-circle-bold" className="size-5 text-red-500/50 mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-1.5 text-yellow-500/80 font-medium">
                        <Icon icon="solar:danger-circle-bold" className="size-5" />
                        {item.slack}
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
