"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Baby, Clock, MapPin } from "lucide-react";
import { createRecommendationSession } from "@/lib/api/recommendations";
import { ApiClientError } from "@/lib/api/http";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input, Textarea } from "@/components/ui/input";
import { useI18n } from "@/components/providers/i18n-provider";

const cues = ["Dinner", "Coffee", "Drinks", "Family", "Date night", "Quiet", "Good value", "Outdoor"];
const mealMoments = ["breakfast", "lunch", "dinner", "late-night"];

export function FindForm() {
  const router = useRouter();
  const { language, setLanguage, t } = useI18n();
  const [rawText, setRawText] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCues, setSelectedCues] = useState<string[]>(["Dinner"]);
  const [partySize, setPartySize] = useState(2);
  const [withKids, setWithKids] = useState(false);
  const [mealMoment, setMealMoment] = useState("dinner");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleCue(cue: string) {
    setSelectedCues((current) => (current.includes(cue) ? current.filter((item) => item !== cue) : [...current, cue]));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await createRecommendationSession({
        rawText,
        selectedCues,
        language,
        location: location ? { mode: "text", text: location } : { mode: "text", text: null },
        context: { partySize, withKids, mealMoment }
      });
      router.push(`/app/recommendations/${response.sessionId}`);
    } catch (caught) {
      if (caught instanceof ApiClientError && caught.status === 401) {
        setError(t.errors.signInAgain);
      } else if (caught instanceof ApiClientError && caught.code === "quota_exceeded") {
        setError(`${t.errors.quotaExceeded} ${t.errors.proComingSoon}`);
      } else {
        setError(t.errors.startRecommendation);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass rounded-[2rem] p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-sm tracking-[0.26em] text-amber">{t.find.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">{t.find.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{t.find.prompt}</p>
        </div>
        <select
          aria-label={t.find.language}
          value={language}
          onChange={(event) => setLanguage(event.target.value as "en" | "tr" | "de")}
          className="h-11 rounded-full border border-ivory/12 bg-black/25 px-4 text-ivory"
        >
          <option value="en">en</option>
          <option value="tr">tr</option>
          <option value="de">de</option>
        </select>
      </div>

      <label htmlFor="rawText" className="mt-8 block text-sm text-muted">
        {t.find.mood}
      </label>
      <Textarea id="rawText" required value={rawText} onChange={(event) => setRawText(event.target.value)} placeholder={t.find.placeholder} className="mt-2" />

      <div className="mt-5 flex flex-wrap gap-2">
        {cues.map((cue, index) => (
          <Chip key={cue} active={selectedCues.includes(cue)} onClick={() => toggleCue(cue)}>
            {t.find.cues[index]}
          </Chip>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-muted">{t.find.location}</span>
          <span className="relative mt-2 block">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} aria-hidden />
            <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder={t.find.locationPlaceholder} className="pl-11" />
          </span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="rounded-2xl border border-ivory/10 bg-black/15 p-3">
            <span className="flex items-center gap-2 text-xs text-muted"><Users size={15} /> {t.find.party}</span>
            <Input type="number" min={1} max={12} value={partySize} onChange={(event) => setPartySize(Number(event.target.value))} className="mt-2 min-h-10 rounded-xl" />
          </label>
          <label className="rounded-2xl border border-ivory/10 bg-black/15 p-3">
            <span className="flex items-center gap-2 text-xs text-muted"><Baby size={15} /> {t.find.kids}</span>
            <button type="button" onClick={() => setWithKids((value) => !value)} className="mt-2 w-full rounded-xl bg-ivory/8 px-3 py-2 text-sm text-ivory">
              {withKids ? t.common.yes : t.common.no}
            </button>
          </label>
          <label className="rounded-2xl border border-ivory/10 bg-black/15 p-3">
            <span className="flex items-center gap-2 text-xs text-muted"><Clock size={15} /> {t.find.moment}</span>
            <select value={mealMoment} onChange={(event) => setMealMoment(event.target.value)} className="mt-2 w-full rounded-xl border border-ivory/10 bg-black/30 px-2 py-2 text-sm text-ivory">
              {mealMoments.map((moment) => (
                <option key={moment} value={moment}>
                  {t.find.mealMoments[moment as keyof typeof t.find.mealMoments]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error ? <p className="mt-5 rounded-2xl border border-wine/40 bg-wine/20 px-4 py-3 text-sm">{error}</p> : null}
      <Button className="mt-7 w-full sm:w-auto" disabled={loading}>
        {loading ? t.common.preparing : t.find.submit}
      </Button>
    </motion.form>
  );
}
