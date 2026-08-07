"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getMe } from "@/lib/api/auth";
import { useI18n } from "@/components/providers/i18n-provider";
import { useSessionHint } from "@/components/providers/session-hint-provider";

export function LoginGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useI18n();
  const { hasAuthSessionHint, setAuthSessionHint } = useSessionHint();
  const me = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false, enabled: hasAuthSessionHint });

  useEffect(() => {
    if (me.data) {
      router.replace("/app/find");
    }
  }, [me.data, router]);

  useEffect(() => {
    if (me.isError) setAuthSessionHint(false);
  }, [me.isError, setAuthSessionHint]);

  if (me.isLoading || me.data) {
    return (
      <div className="glass w-full rounded-panel p-6 sm:p-8 lg:w-[26rem]" role="status" aria-live="polite">
        <p className="eyebrow text-copper">{t.common.loading}</p>
        <div className="mt-7 space-y-4" aria-hidden>
          <motion.div className="h-14 rounded-card bg-ivory/10" animate={{ opacity: [0.45, 0.85, 0.45] }} transition={{ duration: 1.4, repeat: Infinity }} />
          <motion.div
            className="h-14 rounded-card bg-ivory/[0.06]"
            animate={{ opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.12 }}
          />
          <motion.div
            className="h-12 rounded-pill bg-amber/20"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.24 }}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
