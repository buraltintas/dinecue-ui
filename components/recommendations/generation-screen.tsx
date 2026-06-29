"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/components/providers/i18n-provider";

export function GenerationScreen({ currentStep }: { currentStep?: string | null }) {
  const { t } = useI18n();
  const steps = [t.status.understanding, t.status.searching, t.status.comparing, t.status.preparing];
  const normalized = currentStep?.toLowerCase() || "";
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => normalized.includes(step.toLowerCase().slice(0, 8)))
  );

  return (
    <section className="glass overflow-hidden rounded-[2rem] p-8 text-center">
      <div className="relative mx-auto h-64 w-64">
        <div className="absolute inset-0 rounded-full bg-amber/10 blur-3xl" aria-hidden />
        <motion.div className="absolute inset-8 rounded-full plate-ring" animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
        <motion.div
          className="absolute left-1/2 top-1/2 h-4 w-4 rounded-full bg-amber shadow-glow"
          animate={{ x: [-70, 70, -70], y: [-18, 18, -18] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <h1 className="font-display text-4xl text-ivory">{t.status.title}</h1>
      <p className="mx-auto mt-3 max-w-xl text-muted">{t.status.body}</p>
      <div className="mx-auto mt-8 max-w-xl space-y-3 text-left">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${index <= activeIndex ? "bg-amber" : "bg-ivory/20"}`} />
            <span className={index <= activeIndex ? "text-ivory" : "text-muted"}>{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
