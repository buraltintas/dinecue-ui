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
        </div>
        {saveError ? <p className="mt-5 rounded-2xl border border-wine/40 bg-wine/20 px-4 py-3 text-sm text-ivory">{saveError}</p> : null}
        <Button className="mt-6" disabled={mutation.isPending}>
          {mutation.isPending ? t.profile.saving : t.profile.save}
        </Button>
      </form>

      <div className="space-y-4">
        <ProfileSummary title={t.profile.taste} loading={taste.isLoading || taste.isFetching} items={[
          [t.profile.cuisines, taste.data?.favoriteCuisines?.join(", ") || t.common.notSet],
          [t.profile.spice, taste.data ? `${taste.data.spiceTolerance}/10` : t.common.notSet],
          [t.profile.dietary, taste.data?.dietaryRestrictions?.join(", ") || t.common.notSet]
        ]} />
        <ProfileSummary title={t.profile.dining} loading={dining.isLoading || dining.isFetching} items={[
          [t.profile.usuallyWithKids, dining.data?.usuallyWithKids ? t.common.yes : t.common.no],
          [t.profile.quietPlaces, dining.data?.prefersQuietPlaces ? t.common.preferred : t.common.flexible],
          [t.profile.outdoor, dining.data?.prefersOutdoor ? t.common.preferred : t.common.flexible],
          [t.profile.distance, dining.data ? `${dining.data.defaultDistanceMeters}m` : t.common.notSet]
        ]} />
      </div>
    </div>
  );
}

function ProfileSummary({ title, loading, items }: { title: string; loading: boolean; items: string[][] }) {
  return (
    <section className="glass rounded-[1.5rem] p-5">
      <h2 className="text-xl font-semibold text-ivory">{title}</h2>
      {loading ? <div className="mt-4 h-20 animate-pulse rounded-2xl bg-ivory/7" /> : (
        <dl className="mt-4 space-y-3">
          {items.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 text-sm">
              <dt className="text-muted">{label}</dt>
              <dd className="text-right text-ivory">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
