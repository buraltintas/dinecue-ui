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
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-amber/70 bg-amber/18 text-ivory shadow-[0_0_30px_rgba(240,179,92,.15)]"
          : "border-ivory/12 bg-ivory/6 text-muted hover:border-ivory/25 hover:text-ivory"
      )}
    >
      {children}
    </motion.button>
  );
}
