"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { stats } from "@/app/data/home";

// Component to handle number counting animation
function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  // Separate numbers and strings, assuming structure like "50,000+"
  const isNumeric = /[0-9]/.test(value);
  const numberPart = value.replace(/[^0-9.]/g, "");
  const suffixPart = value.replace(/[0-9.]/g, "");

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView && isNumeric) {
      const target = parseFloat(numberPart);
      let startTime: number;
      const duration = 1500; // 1.5s duration

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        setCount(target * easeProgress);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [inView, isNumeric, numberPart]);

  const displayValue = isNumeric
    ? (numberPart.includes(".") ? count.toFixed(1) : Math.floor(count).toLocaleString()) + suffixPart
    : value;

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="text-4xl font-black tabular-nums tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60 md:text-5xl font-mono">
          {displayValue}
        </span>
        <span className="mt-2 block text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
      </motion.div>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative w-full overflow-hidden border-y border-border/40 bg-card/40 backdrop-blur-md">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-border/30 md:grid-cols-5 md:divide-y-0 divide-y">
          {stats.map((stat, i) => (
             <Counter key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
}
