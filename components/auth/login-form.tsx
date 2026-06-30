"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, ShieldCheck } from "lucide-react";
import { startEmailLogin, verifyEmailLogin } from "@/lib/api/auth";
import { updatePreferredLanguage } from "@/lib/api/profile";
import { ApiClientError } from "@/lib/api/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/providers/i18n-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { resolvePostLoginLanguage } from "@/lib/i18n";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { language, setLanguage, applyAuthenticatedLanguage, t } = useI18n();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (step === "email") {
        const response = await startEmailLogin({ email, preferredLanguage: language });
        setDevOtp(process.env.NODE_ENV === "development" ? response.devOtp || null : null);
        setStep("code");
      } else {
        const response = await verifyEmailLogin({ email, code, preferredLanguage: language });
        const nextLanguage = resolvePostLoginLanguage({
          isNewUser: response.isNewUser,
          selectedLanguage: language,
          authenticatedLanguage: response.user.preferredLanguage
        });
        if (response.isNewUser) {
          setLanguage(nextLanguage);
          if (response.user.preferredLanguage !== nextLanguage) {
            await updatePreferredLanguage(nextLanguage).catch(() => null);
          }
        } else {
          applyAuthenticatedLanguage(nextLanguage);
        }
        queryClient.setQueryData(["me"], response.user);
        router.push("/app/find");
      }
    } catch (caught) {
      setError(caught instanceof ApiClientError && caught.status === 401 ? t.errors.signInAgain : t.errors.generic);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass w-full max-w-md rounded-[2rem] p-6 sm:p-8">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm tracking-[0.24em] text-amber">{t.auth.secureSignIn}</p>
          <h1 className="mt-2 font-display text-3xl text-ivory">{t.auth.enterByEmail}</h1>
        </div>
        <LanguageSwitcher compact />
      </div>

      <AnimatePresence mode="wait">
        {step === "email" ? (
          <motion.div key="email" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <label className="text-sm text-muted" htmlFor="email">
              {t.auth.email}
            </label>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} aria-hidden />
              <Input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="pl-11" />
            </div>
          </motion.div>
        ) : (
          <motion.div key="code" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <p className="mb-4 rounded-2xl border border-sage/20 bg-sage/10 px-4 py-3 text-sm text-sage">{t.auth.sent}</p>
            {process.env.NODE_ENV === "development" && devOtp ? (
              <p className="mb-4 rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
                {t.auth.developmentOtp}: {devOtp}
              </p>
            ) : null}
            <label className="text-sm text-muted" htmlFor="code">
              {t.auth.code}
            </label>
            <div className="relative mt-2">
              <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} aria-hidden />
              <Input id="code" inputMode="numeric" required value={code} onChange={(event) => setCode(event.target.value)} className="pl-11 tracking-[0.4em]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error ? <p className="mt-4 rounded-2xl border border-wine/40 bg-wine/20 px-4 py-3 text-sm text-ivory">{error}</p> : null}
      <Button className="mt-6 w-full" disabled={loading}>
        {loading ? t.common.working : step === "email" ? t.auth.start : t.auth.verify}
      </Button>
      <Button className="mt-3 w-full" variant="secondary" type="button" disabled>
        {t.auth.googleSoon}
      </Button>
    </form>
  );
}
