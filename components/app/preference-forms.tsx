"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Check } from "lucide-react";
import { updateDiningProfile, updateTasteProfile } from "@/lib/api/profile";
import { ApiClientError } from "@/lib/api/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/providers/i18n-provider";
import { cleanList } from "@/lib/profile-preferences";
import { parseCommaList, sameCommaList } from "@/lib/comma-list";
import { distanceOptionsMeters, scaleMax, sweetSaltyOptions } from "@/lib/profile-values";
import { cn } from "@/lib/utils";
import type { DiningProfileDto, ProfileDto, TasteProfileDto } from "@/lib/types";

/**
 * These are the preferences every AI flow personalizes from — recommendations, menu scanning and fit
 * check all read them, which is why a diner never has to retype an allergy. Until now they were only
 * displayed, so there was no way to set them from the product at all.
 */
export function TasteProfileForm({ value }: { value: TasteProfileDto }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(value);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Re-sync when the query refetches, so an external change does not get silently overwritten.
  useEffect(() => setForm(value), [value]);

  const mutation = useMutation({
    mutationFn: updateTasteProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData<TasteProfileDto>(["taste-profile"], updated);
      setForm(updated);
      setError("");
      setSaved(true);
    },
    onError: (caught) => {
      setSaved(false);
      setError(caught instanceof ApiClientError && caught.status === 401 ? t.errors.signInAgain : t.preferences.saveError);
    }
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    mutation.mutate({
      ...form,
      favoriteCuisines: cleanList(form.favoriteCuisines),
      dislikedCuisines: cleanList(form.dislikedCuisines),
      favoriteDishes: cleanList(form.favoriteDishes),
      dislikedIngredients: cleanList(form.dislikedIngredients),
      drinkPreferences: cleanList(form.drinkPreferences),
      dietaryRestrictions: cleanList(form.dietaryRestrictions),
      allergies: cleanList(form.allergies)
    });
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-ivory/10 bg-ivory/[0.035] p-5">
      <h2 className="text-xl font-semibold text-ivory">{t.profile.taste}</h2>

      {/* Allergies and dietary limits drive a hard rule in menu scanning: a dish that conflicts with
          them is removed from suggestions. Grouped and marked so it reads as consequential, not cosmetic. */}
      <div className="mt-5 rounded-card border border-amber/20 bg-amber/[0.06] p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-ivory">
          <AlertTriangle size={15} className="text-amber" aria-hidden />
          {t.preferences.safetyTitle}
        </p>
        <p className="mt-2 text-xs leading-6 text-muted">{t.preferences.safetyBody}</p>
        <div className="mt-4 space-y-4">
          <ListField
            label={t.preferences.allergies}
            value={form.allergies}
            onChange={(allergies) => setForm({ ...form, allergies })}
            placeholder={t.preferences.allergiesPlaceholder}
          />
          <ListField
            label={t.preferences.dietary}
            value={form.dietaryRestrictions}
            onChange={(dietaryRestrictions) => setForm({ ...form, dietaryRestrictions })}
            placeholder={t.preferences.dietaryPlaceholder}
          />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <ListField
          label={t.preferences.favoriteCuisines}
          value={form.favoriteCuisines}
          onChange={(favoriteCuisines) => setForm({ ...form, favoriteCuisines })}
          placeholder={t.preferences.favoriteCuisinesPlaceholder}
        />
        <ListField
          label={t.preferences.dislikedCuisines}
          value={form.dislikedCuisines}
          onChange={(dislikedCuisines) => setForm({ ...form, dislikedCuisines })}
          placeholder={t.preferences.dislikedCuisinesPlaceholder}
        />
        <ListField
          label={t.preferences.favoriteDishes}
          value={form.favoriteDishes}
          onChange={(favoriteDishes) => setForm({ ...form, favoriteDishes })}
          placeholder={t.preferences.favoriteDishesPlaceholder}
        />
        <ListField
          label={t.preferences.dislikedIngredients}
          value={form.dislikedIngredients}
          onChange={(dislikedIngredients) => setForm({ ...form, dislikedIngredients })}
          placeholder={t.preferences.dislikedIngredientsPlaceholder}
        />
        <ListField
          label={t.preferences.drinks}
          value={form.drinkPreferences}
          onChange={(drinkPreferences) => setForm({ ...form, drinkPreferences })}
          placeholder={t.preferences.drinksPlaceholder}
        />
        <ScaleField
          label={t.preferences.spice}
          value={form.spiceTolerance}
          onChange={(spiceTolerance) => setForm({ ...form, spiceTolerance })}
          minLabel={t.preferences.spiceMin}
          maxLabel={t.preferences.spiceMax}
        />
        <Field label={t.preferences.sweetSalty}>
          <Select
            value={sweetSaltyOptions.includes(form.sweetSaltyPreference as (typeof sweetSaltyOptions)[number]) ? form.sweetSaltyPreference : "balanced"}
            onChange={(sweetSaltyPreference) => setForm({ ...form, sweetSaltyPreference })}
            options={sweetSaltyOptions.map((option) => ({ value: option, label: t.preferences.sweetSaltyOptions[option] }))}
          />
        </Field>
      </div>

      <SaveRow busy={mutation.isPending} saved={saved} error={error} />
    </form>
  );
}

export function DiningProfileForm({ value, distanceUnit }: { value: DiningProfileDto; distanceUnit: ProfileDto["distanceUnit"] }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(value);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => setForm(value), [value]);

  const mutation = useMutation({
    mutationFn: updateDiningProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData<DiningProfileDto>(["dining-profile"], updated);
      setForm(updated);
      setError("");
      setSaved(true);
    },
    onError: (caught) => {
      setSaved(false);
      setError(caught instanceof ApiClientError && caught.status === 401 ? t.errors.signInAgain : t.preferences.saveError);
    }
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    mutation.mutate(form);
  }

  const toggles = [
    { key: "usuallyWithKids", label: t.profile.usuallyWithKids },
    { key: "prefersQuietPlaces", label: t.profile.quietPlaces },
    { key: "prefersOutdoor", label: t.profile.outdoor },
    { key: "likesLocalExperiences", label: t.preferences.localExperiences },
    { key: "likesPremiumPlaces", label: t.preferences.premiumPlaces },
    { key: "needsParking", label: t.preferences.parking },
    { key: "needsAccessibility", label: t.preferences.accessibility }
  ] as const;

  return (
    <form onSubmit={submit} className="rounded-card border border-ivory/10 bg-ivory/[0.035] p-5">
      <h2 className="text-xl font-semibold text-ivory">{t.profile.dining}</h2>

      <div className="mt-5 space-y-2">
        {toggles.map((toggle) => (
          <ToggleField
            key={toggle.key}
            label={toggle.label}
            value={form[toggle.key]}
            onChange={(next) => setForm({ ...form, [toggle.key]: next })}
          />
        ))}
      </div>

      <div className="mt-5 space-y-4">
        <ScaleField
          label={t.preferences.budget}
          value={form.budgetSensitivity}
          onChange={(budgetSensitivity) => setForm({ ...form, budgetSensitivity })}
          minLabel={t.preferences.budgetMin}
          maxLabel={t.preferences.budgetMax}
        />
        <Field label={t.preferences.distance} hint={t.preferences.distanceHint}>
          <Select
            value={String(form.defaultDistanceMeters)}
            onChange={(next) => setForm({ ...form, defaultDistanceMeters: Number(next) })}
            options={distanceOptionsMeters.map((meters) => ({
              value: String(meters),
              label: formatPresetDistance(meters, distanceUnit)
            }))}
            // A stored value outside the presets must stay visible instead of silently snapping to one.
            extraOption={
              distanceOptionsMeters.includes(form.defaultDistanceMeters as (typeof distanceOptionsMeters)[number])
                ? undefined
                : { value: String(form.defaultDistanceMeters), label: formatPresetDistance(form.defaultDistanceMeters, distanceUnit) }
            }
          />
        </Field>
      </div>

      <SaveRow busy={mutation.isPending} saved={saved} error={error} />
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <div className="mt-2">{children}</div>
      {hint ? <span className="mt-2 block text-xs leading-5 text-faint">{hint}</span> : null}
    </label>
  );
}

/** Comma-separated entry, which keeps a multi-value field usable on a phone keyboard. */
function ListField({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}) {
  const { t } = useI18n();
  // Held as text while typing, because the parsed list cannot represent a half-typed entry.
  const [text, setText] = useState(() => cleanList(value).join(", "));
  // What this input last sent upward. Comparing against it separates a genuinely external change (a save
  // or a refetch) from the echo of the diner's own keystroke. Without it, typing a comma undid itself:
  // "bira," parses to ["bira", ""], which joins back to "bira" and removed the comma as it was typed.
  const emitted = useRef<string[]>(value);

  useEffect(() => {
    if (sameCommaList(emitted.current, value)) return;
    emitted.current = value;
    setText(cleanList(value).join(", "));
  }, [value]);

  function handleChange(next: string) {
    setText(next);
    const parsed = parseCommaList(next);
    emitted.current = parsed;
    onChange(parsed);
  }

  return (
    <Field label={label} hint={t.preferences.listHint}>
      <Input value={text} placeholder={placeholder} onChange={(event) => handleChange(event.target.value)} />
    </Field>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-between gap-4 rounded-card border border-ivory/[0.08] bg-black/15 px-4 py-2.5">
      <span className="text-sm text-muted">{label}</span>
      <button
        type="button"
        aria-pressed={value}
        onClick={() => onChange(!value)}
        className={cn(
          "min-h-9 shrink-0 rounded-pill border px-4 text-sm font-semibold transition",
          value ? "border-amber/50 bg-amber/[0.16] text-ivory" : "border-ivory/12 bg-ivory/[0.05] text-muted hover:text-ivory"
        )}
      >
        {value ? t.common.yes : t.common.no}
      </button>
    </div>
  );
}

/** 0-5 in both the UI and the backend, so a chosen value can never be rejected. */
function ScaleField({
  label,
  value,
  onChange,
  minLabel,
  maxLabel
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  const safe = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), scaleMax);

  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: scaleMax + 1 }, (_, step) => (
          <button
            key={step}
            type="button"
            aria-pressed={safe === step}
            onClick={() => onChange(step)}
            className={cn(
              "min-h-10 w-10 rounded-card border font-mono text-sm transition",
              safe === step ? "border-amber/50 bg-amber/[0.16] text-ivory" : "border-ivory/12 bg-black/20 text-muted hover:text-ivory"
            )}
          >
            {step}
          </button>
        ))}
      </div>
      <span className="mt-2 flex justify-between text-xs text-faint">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </span>
    </Field>
  );
}

function Select({
  value,
  onChange,
  options,
  extraOption
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  extraOption?: { value: string; label: string };
}) {
  const all = extraOption ? [extraOption, ...options] : options;

  return (
    <select
      className="min-h-12 w-full rounded-card border border-ivory/12 bg-black/25 px-4 text-ivory"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {all.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function SaveRow({ busy, saved, error }: { busy: boolean; saved: boolean; error: string }) {
  const { t } = useI18n();

  return (
    <>
      {error ? (
        <p className="mt-5 rounded-card border border-wine/40 bg-wine/20 px-4 py-3 text-sm text-ivory" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-5 flex items-center gap-3">
        <Button disabled={busy}>{busy ? t.profile.saving : t.preferences.save}</Button>
        {saved && !busy ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-sage" role="status">
            <Check size={15} aria-hidden />
            {t.preferences.saved}
          </span>
        ) : null}
      </div>
    </>
  );
}

function formatPresetDistance(meters: number, unit: ProfileDto["distanceUnit"]) {
  if (unit === "mi") {
    const miles = meters / 1609.344;
    return `${miles < 10 ? miles.toFixed(1) : miles.toFixed(0)} mi`;
  }
  return meters >= 1000 ? `${meters % 1000 === 0 ? meters / 1000 : (meters / 1000).toFixed(1)} km` : `${meters} m`;
}
