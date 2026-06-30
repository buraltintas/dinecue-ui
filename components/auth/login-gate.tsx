"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getMe } from "@/lib/api/auth";
import { useI18n } from "@/components/providers/i18n-provider";

export function LoginGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useI18n();
  const me = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false });

  useEffect(() => {
    if (me.data) {
      router.replace("/app/find");
    }
  }, [me.data, router]);

  if (me.isLoading || me.data) {
    return (
      <div className="glass w-full max-w-md rounded-[2rem] p-6 sm:p-8" role="status" aria-live="polite">
        <p className="text-sm tracking-[0.24em] text-amber">{t.common.loading}</p>
        <div className="mt-7 space-y-4" aria-hidden>
          <motion.div className="h-14 rounded-2xl bg-ivory/10" animate={{ opacity: [0.45, 0.85, 0.45] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <motion.div
            className="h-14 rounded-2xl bg-ivory/7"
            animate={{ opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.12 }}
          />
          <motion.div
            className="h-12 rounded-full bg-amber/20"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.24 }}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
