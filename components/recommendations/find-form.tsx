"use client";

import { FormEvent, type MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Baby, Clock, LocateFixed, Map, MapPin, MousePointer2, Users } from "lucide-react";
import { createRecommendationSession } from "@/lib/api/recommendations";
import { ApiClientError } from "@/lib/api/http";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input, Textarea } from "@/components/ui/input";
import { useI18n } from "@/components/providers/i18n-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { cn } from "@/lib/utils";
import type { LocationInput } from "@/lib/types";

const cues = ["Dinner", "Coffee", "Drinks", "Family", "Date night", "Quiet", "Good value", "Outdoor"];
const mealMoments = ["breakfast", "lunch", "dinner", "late-night"];
type LocationMode = "text" | "current" | "map";
type Coordinates = { lat: number; lng: number };

export function FindForm() {
  const router = useRouter();
  const { language, t } = useI18n();
  const [rawText, setRawText] = useState("");
  const [location, setLocation] = useState("");
  const [locationMode, setLocationMode] = useState<LocationMode>("text");
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates | null>(null);
  const [mapPin, setMapPin] = useState({ x: 50, y: 50 });
  const [locationPending, setLocationPending] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [selectedCues, setSelectedCues] = useState<string[]>(["Dinner"]);
  const [partySize, setPartySize] = useState(2);
  const [withKids, setWithKids] = useState(false);
  const [mealMoment, setMealMoment] = useState("dinner");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleCue(cue: string) {
    setSelectedCues((current) => (current.includes(cue) ? current.filter((item) => item !== cue) : [...current, cue]));
  }

  function requestBrowserLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("geolocation_unavailable"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        reject,
        { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 }
      );
    });
  }

  async function chooseLocationMode(mode: LocationMode) {
    setLocationMode(mode);
    setLocationMessage("");
    if (mode === "text") return;

    setLocationPending(true);
    try {
      const coordinates = await requestBrowserLocation();
      setCurrentCoordinates(coordinates);
      if (mode === "map") {
        setMapCoordinates((current) => current || coordinates);
        setMapPin((current) => current || { x: 50, y: 50 });
      }
      setLocationMessage(mode === "current" ? t.find.currentLocationReady : t.find.mapLocationReady);
    } catch {
      setLocationMessage(t.find.locationPermissionError);
    } finally {
      setLocationPending(false);
    }
  }

  function pickMapLocation(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(92, Math.max(8, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(86, Math.max(14, ((event.clientY - rect.top) / rect.height) * 100));
    const center = currentCoordinates || mapCoordinates || { lat: 41.0082, lng: 28.9784 };
    const next = {
      lat: center.lat + (50 - y) * 0.0018,
      lng: center.lng + (x - 50) * 0.0024
    };
    setMapPin({ x, y });
    setMapCoordinates(next);
    setLocationMessage(t.find.mapPinReady);
  }

  function buildLocationInput(): LocationInput {
    if (locationMode === "current" && currentCoordinates) {
      return { mode: "current", text: null, lat: currentCoordinates.lat, lng: currentCoordinates.lng, placeId: null };
    }
    if (locationMode === "map" && mapCoordinates) {
      return { mode: "place", text: null, lat: mapCoordinates.lat, lng: mapCoordinates.lng, placeId: null };
    }
    return location ? { mode: "text", text: location } : { mode: "text", text: null };
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (locationMode === "current" && !currentCoordinates) {
        await chooseLocationMode("current");
        setLoading(false);
        return;
      }
      if (locationMode === "map" && !mapCoordinates) {
        setError(t.find.mapRequired);
        setLoading(false);
        return;
      }
      const response = await createRecommendationSession({
        rawText,
        selectedCues,
        language,
        location: buildLocationInput(),
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
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm tracking-[0.26em] text-amber">{t.find.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">{t.find.title}</h1>
          <p className="mt-3 max-w-2xl text-muted">{t.find.prompt}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 self-start rounded-full border border-ivory/10 bg-black/20 p-1.5">
          <span className="hidden pl-3 text-xs font-semibold text-muted sm:inline">{t.find.language}</span>
          <LanguageSwitcher compact />
        </div>
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
        <section className="block">
          <span className="text-sm text-muted">{t.find.location}</span>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {([
              ["text", MapPin, t.find.locationTextMode],
              ["current", LocateFixed, t.find.locationCurrentMode],
              ["map", Map, t.find.locationMapMode]
            ] as const).map(([mode, Icon, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => void chooseLocationMode(mode)}
                className={cn(
                  "flex min-h-11 items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-semibold transition",
                  locationMode === mode ? "border-amber/45 bg-amber/12 text-ivory" : "border-ivory/10 bg-black/15 text-muted hover:bg-ivory/7 hover:text-ivory"
                )}
              >
                <Icon size={16} aria-hidden />
                {label}
              </button>
            ))}
          </div>

          {locationMode === "text" ? (
            <span className="relative mt-3 block">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} aria-hidden />
              <Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder={t.find.locationPlaceholder} className="pl-11" />
            </span>
          ) : null}

          {locationMode === "current" ? (
            <div className="mt-3 rounded-2xl border border-ivory/10 bg-black/15 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ivory">
                <LocateFixed size={16} className="text-amber" aria-hidden />
                {locationPending ? t.find.locationRequesting : currentCoordinates ? t.find.currentLocationReady : t.find.currentLocationHint}
              </p>
              {currentCoordinates ? <p className="mt-2 text-xs text-muted">{formatCoordinates(currentCoordinates)}</p> : null}
            </div>
          ) : null}

          {locationMode === "map" ? (
            <div className="mt-3 rounded-[1.5rem] border border-ivory/10 bg-black/15 p-3">
              <button
                type="button"
                onClick={pickMapLocation}
                className="relative h-48 w-full overflow-hidden rounded-[1.15rem] border border-ivory/10 bg-[radial-gradient(circle_at_50%_45%,rgba(240,179,92,.16),transparent_28%),linear-gradient(135deg,rgba(244,239,228,.08),rgba(145,160,107,.08))] text-left"
                aria-label={t.find.mapPickerLabel}
              >
                <span className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(244,239,228,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,228,.6)_1px,transparent_1px)] [background-size:28px_28px]" aria-hidden />
                <span
                  className="absolute -ml-4 -mt-8 grid h-9 w-9 place-items-center rounded-full bg-amber text-graphite shadow-glow"
                  style={{ left: `${mapPin.x}%`, top: `${mapPin.y}%` }}
                  aria-hidden
                >
                  <MapPin size={19} />
                </span>
                <span className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs text-ivory backdrop-blur">
                  <MousePointer2 size={14} className="text-amber" aria-hidden />
                  {currentCoordinates ? t.find.mapPickerHint : t.find.currentLocationHint}
                </span>
              </button>
              {mapCoordinates ? <p className="mt-3 text-xs text-muted">{formatCoordinates(mapCoordinates)}</p> : null}
            </div>
          ) : null}

          {locationMessage ? <p className="mt-3 text-sm text-muted">{locationMessage}</p> : null}
        </section>
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

function formatCoordinates(coordinates: Coordinates) {
  return `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`;
}
