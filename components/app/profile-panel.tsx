"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDiningProfile, getProfile, getTasteProfile, updateProfile } from "@/lib/api/profile";
import type { ProfileDto } from "@/lib/types";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSignOut } from "@/components/providers/use-sign-out";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/providers/i18n-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { countryOptions, currencyOptions, getCountryLabel, sanitizeProfileForUpdate } from "@/lib/profile-values";
import { ApiClientError } from "@/lib/api/http";
import { hasIncompletePreferences } from "@/lib/profile-preferences";
import { DiningProfileForm, TasteProfileForm } from "@/components/app/preference-forms";
import type { ProfileQuotaDto } from "@/lib/types";


export function ProfilePanel() {
  const { language, t } = useI18n();
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 0,
    refetchOnMount: "always"
  });
  const taste = useQuery({
    queryKey: ["taste-profile"],
    queryFn: getTasteProfile,
    staleTime: 0,
    refetchOnMount: "always"
  });
  const dining = useQuery({
    queryKey: ["dining-profile"],
    queryFn: getDiningProfile,
    staleTime: 0,
    refetchOnMount: "always"
  });
  const [form, setForm] = useState<ProfileDto>({
    displayName: "",
    preferredLanguage: "en",
    country: "",
    currency: "USD",
    distanceUnit: "km"
  });
  const [saveError, setSaveError] = useState("");
  const { signOut, signingOut } = useSignOut();

  useEffect(() => {
    if (profile.data) setForm(profile.data);
  }, [profile.data]);

  useEffect(() => {
    setForm((current) => (
      current.preferredLanguage === language ? current : { ...current, preferredLanguage: language }
    ));
  }, [language]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      setSaveError("");
      setForm(profile);
    },
    onError: (error) => {
      setSaveError(error instanceof ApiClientError && error.status === 401 ? t.errors.signInAgain : t.profile.saveError);
    }
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate(sanitizeProfileForUpdate(form));
  }

  const preferencesIncomplete = hasIncompletePreferences(taste.data, dining.data);
  const quota = profile.data?.quota;

  if (profile.isLoading || profile.isFetching) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="glass h-80 animate-pulse rounded-panel" aria-label={t.common.loading} />
        <div className="space-y-4">
          <div className="glass h-36 animate-pulse rounded-card" aria-label={t.common.loading} />
          <div className="glass h-36 animate-pulse rounded-card" aria-label={t.common.loading} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
      <form onSubmit={submit} className="glass rounded-panel p-6 sm:p-7">
        <h2 className="font-display text-3xl text-ivory">{t.profile.account}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm text-muted">{t.profile.displayName}</span>
            <Input className="mt-2" value={form.displayName || ""} onChange={(event) => setForm({ ...form, displayName: event.target.value })} />
          </label>
          <label>
            <span className="text-sm text-muted">{t.profile.preferredLanguage}</span>
            <div className="mt-2">
              <LanguageSwitcher compact />
            </div>
          </label>
          <label>
            <span className="text-sm text-muted">{t.profile.country}</span>
            <select
              className="mt-2 min-h-12 w-full rounded-card border border-ivory/12 bg-black/25 px-4 text-ivory"
              value={form.country || ""}
              onChange={(event) => setForm({ ...form, country: event.target.value || null })}
            >
              {countryOptions.map((code) => (
                <option key={code || "empty"} value={code}>
                  {code ? getCountryLabel(code, language) : t.profile.countryNone}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm text-muted">{t.profile.currency}</span>
            {/* The backend only accepts a 3-letter code, so a typed "TL" would fail for an invisible reason. */}
            <select
              className="mt-2 min-h-12 w-full rounded-card border border-ivory/12 bg-black/25 px-4 text-ivory"
              value={currencyOptions.includes(form.currency as (typeof currencyOptions)[number]) ? form.currency : currencyOptions[0]}
              onChange={(event) => setForm({ ...form, currency: event.target.value })}
            >
              {currencyOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-sm text-muted">{t.profile.distanceUnit}</span>
            <select
              className="mt-2 min-h-12 w-full rounded-card border border-ivory/12 bg-black/25 px-4 text-ivory"
              value={form.distanceUnit || "km"}
              onChange={(event) => setForm({ ...form, distanceUnit: event.target.value })}
            >
              <option value="km">{t.profile.kilometers}</option>
              <option value="mi">{t.profile.miles}</option>
            </select>
          </label>
        </div>
        {saveError ? <p className="mt-5 rounded-card border border-wine/40 bg-wine/20 px-4 py-3 text-sm text-ivory">{saveError}</p> : null}
        <Button className="mt-6" disabled={mutation.isPending}>
          {mutation.isPending ? t.profile.saving : t.profile.save}
        </Button>

        {/* Signing out lived only in the desktop sidebar, so on a phone there was no way to do it. */}
        <div className="mt-8 border-t border-ivory/10 pt-6">
          <Button type="button" variant="secondary" disabled={signingOut} onClick={() => void signOut()}>
            {signingOut ? t.common.working : t.common.signOut}
            <LogOut size={16} aria-hidden />
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {quota ? <QuotaCard quota={quota} /> : null}
        <section className="rounded-card border border-ivory/10 bg-ivory/[0.035] p-5">
          <p className="eyebrow text-copper">{t.profile.preferencesEyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold text-ivory">{t.profile.preferencesTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{t.profile.preferencesBody}</p>
          {preferencesIncomplete ? (
            <div className="mt-5 rounded-card border border-amber/20 bg-amber/10 p-4">
              <p className="text-sm text-ivory">{t.profile.preferencesIncomplete}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{t.profile.preferencesHint}</p>
            </div>
          ) : null}
        </section>
        {taste.data ? (
          <TasteProfileForm value={taste.data} />
        ) : (
          <div className="glass h-56 animate-pulse rounded-card" aria-label={t.common.loading} />
        )}
        {dining.data ? (
          <DiningProfileForm value={dining.data} distanceUnit={form.distanceUnit} />
        ) : (
          <div className="glass h-56 animate-pulse rounded-card" aria-label={t.common.loading} />
        )}
      </div>
    </div>
  );
}

function QuotaCard({ quota }: { quota: ProfileQuotaDto }) {
  const { t } = useI18n();
  const isPro = quota.plan === "pro";
  const limit = Math.max(0, quota.monthlyLimit);
  const used = Math.max(0, quota.usedThisPeriod);
  const remaining = Math.max(0, quota.remainingThisPeriod);
  const progress = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const planLabel = isPro ? t.profile.proPlanStatus : t.profile.freePlanStatus;
  const badge = isPro ? t.profile.proPlanBadge : t.profile.freePlanBadge;
  const remainingText = t.profile.quotaRemaining.replace("{remaining}", String(remaining));
  const usedText = t.profile.quotaUsed.replace("{used}", String(used)).replace("{limit}", String(limit));

  return (
    <section className="rounded-card border border-ivory/10 bg-ivory/[0.035] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow text-copper">{t.profile.planEyebrow}</p>
          <h2 className="mt-3 text-xl font-semibold text-ivory">{planLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{remainingText}</p>
        </div>
        <span className="w-fit rounded-pill border border-amber/25 bg-amber/10 px-3 py-1.5 font-mono text-xs text-amber">{badge}</span>
      </div>
      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-ivory/10" aria-hidden>
          <div className="h-full rounded-full bg-amber transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>{usedText}</span>
          {quota.proAvailable && quota.proStatus === "coming_soon" ? <span>{t.profile.proComingSoonShort}</span> : null}
        </div>
      </div>
    </section>
  );
}

