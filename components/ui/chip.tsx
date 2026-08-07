"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Chip({
  active,
  children,
  onClick
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center rounded-pill border px-4 text-sm transition",
        active
          ? "border-amber/60 bg-amber/[0.16] text-ivory"
          : "border-ivory/12 bg-ivory/[0.05] text-muted hover:border-ivory/25 hover:text-ivory"
      )}
    >
      {children}
    </motion.button>
  );
}
