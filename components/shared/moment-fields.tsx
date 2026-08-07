"use client";

import { Baby, Clock, Users } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { Input, Textarea } from "@/components/ui/input";
import { useI18n } from "@/components/providers/i18n-provider";
import type { MomentContext } from "@/lib/types";

/**
 * The cue values sent to the backend are the English literals; only the labels are localized.
 * This must stay in step with the find form so the backend sees one vocabulary across all three flows.
 */
export const cueValues = ["Dinner", "Coffee", "Drinks", "Family", "Date night", "Quiet", "Good value", "Outdoor"];
export const mealMomentValues = ["breakfast", "lunch", "dinner", "late-night"];

export type MomentFieldsValue = MomentContext & {
  rawText: string;
  selectedCues: string[];
};

export const emptyMoment: MomentFieldsValue = {
  rawText: "",
  selectedCues: [],
  partySize: 2,
  withKids: false,
  mealMoment: "dinner"
};

/**
 * The context block shared by menu scan and fit check. Everything here is optional on purpose: the
 * diner's allergies, dietary restrictions, spice tolerance, kids, and budget already come from their
 * stored profile, so this is only the layer for *this* moment.
 */
export function MomentFields({
  value,
  onChange,
  noteLabel,
  notePlaceholder
}: {
  value: MomentFieldsValue;
  onChange: (value: MomentFieldsValue) => void;
  noteLabel: string;
  notePlaceholder: string;
}) {
  const { t } = useI18n();

  function toggleCue(cue: string) {
    onChange({
      ...value,
      selectedCues: value.selectedCues.includes(cue)
        ? value.selectedCues.filter((item) => item !== cue)
        : [...value.selectedCues, cue]
    });
  }

  return (
    <>
      <label htmlFor="momentNote" className="mt-8 block text-sm text-muted">
        {noteLabel}
      </label>
      <Textarea
        id="momentNote"
        value={value.rawText}
        onChange={(event) => onChange({ ...value, rawText: event.target.value })}
        placeholder={notePlaceholder}
        className="mt-2 min-h-28"
      />
      <p className="mt-2 text-xs leading-6 text-faint">{t.shared.contextOptional}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {cueValues.map((cue, index) => (
          <Chip key={cue} active={value.selectedCues.includes(cue)} onClick={() => toggleCue(cue)}>
            {t.find.cues[index]}
          </Chip>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <label className="rounded-card border border-ivory/10 bg-black/15 p-3">
          <span className="flex items-center gap-2 text-xs text-muted">
            <Users size={15} aria-hidden /> {t.find.party}
          </span>
          <Input
            type="number"
            min={1}
            max={12}
            value={value.partySize}
            onChange={(event) => onChange({ ...value, partySize: Number(event.target.value) })}
            className="mt-2 min-h-10 rounded-card"
          />
        </label>
        <label className="rounded-card border border-ivory/10 bg-black/15 p-3">
          <span className="flex items-center gap-2 text-xs text-muted">
            <Baby size={15} aria-hidden /> {t.find.kids}
          </span>
          <button
            type="button"
            onClick={() => onChange({ ...value, withKids: !value.withKids })}
            aria-pressed={value.withKids}
            className="mt-2 w-full rounded-card bg-ivory/[0.08] px-3 py-2 text-sm text-ivory"
          >
            {value.withKids ? t.common.yes : t.common.no}
          </button>
        </label>
        <label className="rounded-card border border-ivory/10 bg-black/15 p-3">
          <span className="flex items-center gap-2 text-xs text-muted">
            <Clock size={15} aria-hidden /> {t.find.moment}
          </span>
          <select
            value={value.mealMoment}
            onChange={(event) => onChange({ ...value, mealMoment: event.target.value })}
            className="mt-2 w-full rounded-card border border-ivory/10 bg-black/30 px-2 py-2 text-sm text-ivory"
          >
            {mealMomentValues.map((moment) => (
              <option key={moment} value={moment}>
                {t.find.mealMoments[moment as keyof typeof t.find.mealMoments]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}

/** The shape the backend expects in `context` across every flow. */
export function toContextPayload(value: MomentFieldsValue): Record<string, unknown> {
  return {
    partySize: value.partySize,
    withKids: value.withKids,
    mealMoment: value.mealMoment
  };
}
