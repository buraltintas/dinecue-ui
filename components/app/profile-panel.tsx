"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getDiningProfile, getProfile, getTasteProfile, updateProfile } from "@/lib/api/profile";
import type { ProfileDto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/providers/i18n-provider";
import { countryOptions, getCountryLabel, sanitizeProfileForUpdate } from "@/lib/profile-values";
import { ApiClientError } from "@/lib/api/http";
import { DEFAULT_DISTANCE_METERS, DEFAULT_SPICE_TOLERANCE, cleanList, formatDistance, hasIncompletePreferences } from "@/lib/profile-preferences";

type PreferenceItem = {
  label: string;
  value: string;
  source?: "default" | "unset";
};

export function ProfilePanel() {
  const { language, t } = useI18n();
  const [showPreferenceNote, setShowPreferenceNote] = useState(false);
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

  useEffect(() => {
    if (profile.data) setForm(profile.data);
  }, [profile.data]);

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

  const favoriteCuisines = cleanList(taste.data?.favoriteCuisines);
  const dietaryRestrictions = cleanList(taste.data?.dietaryRestrictions);
  const tasteItems: PreferenceItem[] = [
    {
      label: t.profile.cuisines,
      value: favoriteCuisines.length ? favoriteCuisines.join(", ") : t.common.notSet,
      source: favoriteCuisines.length ? undefined : "unset"
    },
    {
      label: t.profile.spice,
      value: taste.data && taste.data.spiceTolerance !== DEFAULT_SPICE_TOLERANCE ? `${taste.data.spiceTolerance}/5` : t.common.notSet,
      source: taste.data && taste.data.spiceTolerance !== DEFAULT_SPICE_TOLERANCE ? undefined : "unset"
    },
    {
      label: t.profile.dietary,
      value: dietaryRestrictions.length ? dietaryRestrictions.join(", ") : t.common.notSet,
      source: dietaryRestrictions.length ? undefined : "unset"
    }
  ];
  const diningItems: PreferenceItem[] = [
    {
      label: t.profile.usuallyWithKids,
      value: dining.data?.usuallyWithKids ? t.common.yes : t.common.flexible,
      source: dining.data?.usuallyWithKids ? undefined : "unset"
    },
    {
      label: t.profile.quietPlaces,
      value: dining.data?.prefersQuietPlaces ? t.common.preferred : t.common.notSet,
      source: dining.data?.prefersQuietPlaces ? undefined : "unset"
    },
    {
      label: t.profile.outdoor,
      value: dining.data?.prefersOutdoor ? t.common.preferred : t.common.notSet,
      source: dining.data?.prefersOutdoor ? undefined : "unset"
    },
    {
      label: t.profile.distance,
      value: dining.data ? formatDistance(dining.data.defaultDistanceMeters, form.distanceUnit) : t.common.notSet,
      source: dining.data?.defaultDistanceMeters === DEFAULT_DISTANCE_METERS ? "default" : dining.data ? undefined : "unset"
    }
  ];
  const preferencesIncomplete = hasIncompletePreferences(taste.data, dining.data);

  if (profile.isLoading || profile.isFetching) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="glass h-80 animate-pulse rounded-[2rem]" aria-label={t.common.loading} />
        <div className="space-y-4">
          <div className="glass h-36 animate-pulse rounded-[1.5rem]" aria-label={t.common.loading} />
          <div className="glass h-36 animate-pulse rounded-[1.5rem]" aria-label={t.common.loading} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
      <form onSubmit={submit} className="glass rounded-[2rem] p-6">
        <h2 className="font-display text-3xl text-ivory">{t.profile.account}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-sm text-muted">{t.profile.displayName}</span>
            <Input className="mt-2" value={form.displayName || ""} onChange={(event) => setForm({ ...form, displayName: event.target.value })} />
          </label>
          <label>
            <span className="text-sm text-muted">{t.profile.preferredLanguage}</span>
            <select
              className="mt-2 min-h-12 w-full rounded-2xl border border-ivory/12 bg-black/25 px-4 text-ivory"
              value={form.preferredLanguage}
              onChange={(event) => setForm({ ...form, preferredLanguage: event.target.value as "en" | "tr" | "de" })}
            >
              <option value="en">en</option>
              <option value="tr">tr</option>
              <option value="de">de</option>
            </select>
          </label>
          <label>
            <span className="text-sm text-muted">{t.profile.country}</span>
            <select
              className="mt-2 min-h-12 w-full rounded-2xl border border-ivory/12 bg-black/25 px-4 text-ivory"
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
            <Input className="mt-2" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value.toUpperCase() })} />
          </label>
          <label>
            <span className="text-sm text-muted">{t.profile.distanceUnit}</span>
            <select
              className="mt-2 min-h-12 w-full rounded-2xl border border-ivory/12 bg-black/25 px-4 text-ivory"
              value={form.distanceUnit || "km"}
              onChange={(event) => setForm({ ...form, distanceUnit: event.target.value })}
            >
              <option value="km">{t.profile.kilometers}</option>
              <option value="mi">{t.profile.miles}</option>
            </select>
          </label>
        </div>
        {saveError ? <p className="mt-5 rounded-2xl border border-wine/40 bg-wine/20 px-4 py-3 text-sm text-ivory">{saveError}</p> : null}
        <Button className="mt-6" disabled={mutation.isPending}>
          {mutation.isPending ? t.profile.saving : t.profile.save}
        </Button>
      </form>

      <div className="space-y-4">
        <section className="glass rounded-[1.5rem] p-5">
          <p className="text-sm tracking-[0.22em] text-amber">{t.profile.planEyebrow}</p>
          <h2 className="mt-3 text-xl font-semibold text-ivory">{t.profile.freePlan}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{t.profile.freePlanBody}</p>
          <p className="mt-4 text-sm leading-6 text-muted">{t.profile.proSoon}</p>
        </section>
        <section className="glass rounded-[1.5rem] p-5">
          <p className="text-sm tracking-[0.22em] text-amber">{t.profile.preferencesEyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold text-ivory">{t.profile.preferencesTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{t.profile.preferencesBody}</p>
          {preferencesIncomplete ? (
            <div className="mt-5 rounded-2xl border border-amber/20 bg-amber/10 p-4">
              <p className="text-sm text-ivory">{t.profile.preferencesIncomplete}</p>
              <Button className="mt-4" variant="secondary" type="button" onClick={() => setShowPreferenceNote(true)}>
                {t.profile.completePreferences}
              </Button>
              {showPreferenceNote ? <p className="mt-3 text-sm leading-6 text-muted">{t.profile.preferencesComingSoon}</p> : null}
            </div>
          ) : null}
        </section>
        <ProfileSummary title={t.profile.taste} loading={taste.isLoading || taste.isFetching} items={tasteItems} />
        <ProfileSummary title={t.profile.dining} loading={dining.isLoading || dining.isFetching} items={diningItems} />
      </div>
    </div>
  );
}

function ProfileSummary({ title, loading, items }: { title: string; loading: boolean; items: PreferenceItem[] }) {
  const { t } = useI18n();

  return (
    <section className="glass rounded-[1.5rem] p-5">
      <h2 className="text-xl font-semibold text-ivory">{title}</h2>
      {loading ? <div className="mt-4 h-20 animate-pulse rounded-2xl bg-ivory/7" /> : (
        <dl className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-4 text-sm">
              <dt className="text-muted">{item.label}</dt>
              <dd className="text-right text-ivory">
                <span>{item.value}</span>
                {item.source === "default" ? <span className="ml-2 rounded-full bg-ivory/7 px-2 py-0.5 text-xs text-muted">{t.profile.defaultBadge}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
