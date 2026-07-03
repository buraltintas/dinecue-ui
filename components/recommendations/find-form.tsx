"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Baby, Clock, LocateFixed, Map, MapPin, Users } from "lucide-react";
import { createRecommendationSession } from "@/lib/api/recommendations";
import { ApiClientError } from "@/lib/api/http";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input, Textarea } from "@/components/ui/input";
import { useI18n } from "@/components/providers/i18n-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LocationMapPicker } from "@/components/recommendations/location-map-picker";
import { cn } from "@/lib/utils";
import type { LocationInput } from "@/lib/types";

const cues = ["Dinner", "Coffee", "Drinks", "Family", "Date night", "Quiet", "Good value", "Outdoor"];
const mealMoments = ["breakfast", "lunch", "dinner", "late-night"];
type LocationMode = "text" | "current" | "map";
type Coordinates = { lat: number; lng: number };
type LocationFailure = "denied" | "timeout" | "unavailable" | "unsupported";

export function FindForm() {
  const router = useRouter();
  const { language, t } = useI18n();
  const [rawText, setRawText] = useState("");
  const [location, setLocation] = useState("");
  const [locationMode, setLocationMode] = useState<LocationMode>("text");
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinates | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<Coordinates | null>(null);
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

  function requestBrowserLocation(options: PositionOptions): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("unsupported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        reject,
        options
      );
    });
  }

  function watchBrowserLocation(options: PositionOptions): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("unsupported"));
        return;
      }

      let settled = false;
      const timeout = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        navigator.geolocation.clearWatch(watchId);
        reject({ code: 3 });
      }, options.timeout || 20_000);

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          navigator.geolocation.clearWatch(watchId);
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          navigator.geolocation.clearWatch(watchId);
          reject(error);
        },
        options
      );
    });
  }

  async function resolveBrowserLocation() {
    const attempts: Array<() => Promise<Coordinates>> = [
      () => requestBrowserLocation({ enableHighAccuracy: false, timeout: 8_000, maximumAge: 600_000 }),
      () => requestBrowserLocation({ enableHighAccuracy: true, timeout: 18_000, maximumAge: 0 }),
      () => watchBrowserLocation({ enableHighAccuracy: false, timeout: 22_000, maximumAge: 600_000 })
    ];
    let lastError: unknown = null;

    for (const attempt of attempts) {
      try {
        return await attempt();
      } catch (error) {
        lastError = error;
        if (getLocationFailure(error) === "denied" || getLocationFailure(error) === "unsupported") throw error;
      }
    }

    throw lastError;
  }

  function getLocationFailureMessage(error: unknown) {
    const failure = getLocationFailure(error);
    if (failure === "denied") return t.find.locationPermissionDenied;
    if (failure === "timeout") return t.find.locationTimeoutError;
    if (failure === "unsupported") return t.find.locationUnsupportedError;
    return t.find.locationUnavailableError;
  }

  function getMapLocationFailureMessage(error: unknown) {
    return getLocationFailure(error) === "denied" ? t.find.mapPermissionRequired : getLocationFailureMessage(error);
  }

  async function geocodeTypedLocation(): Promise<Coordinates | null> {
    const query = location.trim();
    if (!query) return null;

    const response = await fetch(`/api/map/geocode?q=${encodeURIComponent(query)}&language=${language}`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error("location_lookup_failed");

    const result = (await response.json()) as Partial<Coordinates>;
    return typeof result.lat === "number" && typeof result.lng === "number" ? { lat: result.lat, lng: result.lng } : null;
  }

  async function chooseLocationMode(mode: LocationMode) {
    setLocationMode(mode);
    setLocationMessage("");
    if (mode === "text") return;
    if (mode === "map") {
      setLocationPending(true);
      try {
        const typedCoordinates = await geocodeTypedLocation();
        if (typedCoordinates) {
          setMapCoordinates(typedCoordinates);
          setLocationMessage(t.find.mapTextLocationReady);
          return;
        }

        if (location.trim()) {
          setMapCoordinates(null);
          setLocationMessage(t.find.mapTextLocationNotFound);
          return;
        }

        if (currentCoordinates) {
          setMapCoordinates((current) => current || currentCoordinates);
          setLocationMessage(t.find.mapLocationReady);
          return;
        }

        const coordinates = await resolveBrowserLocation();
        setCurrentCoordinates(coordinates);
        setMapCoordinates((current) => current || coordinates);
        setLocationMessage(t.find.mapLocationReady);
      } catch (error) {
        setMapCoordinates(null);
        setLocationMessage(error instanceof Error && error.message === "location_lookup_failed" ? t.find.mapTextLocationNotFound : getMapLocationFailureMessage(error));
      } finally {
        setLocationPending(false);
      }
      return;
    }

    setLocationPending(true);
    try {
      const coordinates = await resolveBrowserLocation();
      setCurrentCoordinates(coordinates);
      setLocationMessage(t.find.currentLocationReady);
    } catch (error) {
      setLocationMessage(getLocationFailureMessage(error));
    } finally {
      setLocationPending(false);
    }
  }

  function buildLocationInput(): LocationInput {
    if (locationMode === "current" && currentCoordinates) {
      return { mode: "current", text: null, lat: currentCoordinates.lat, lng: currentCoordinates.lng };
    }
    if (locationMode === "map" && mapCoordinates) {
      return { mode: "map_pin", text: location.trim() || null, lat: mapCoordinates.lat, lng: mapCoordinates.lng };
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
        setError(location.trim() ? t.find.mapTextLocationNotFound : t.find.mapPermissionRequired);
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
            <button
              type="button"
              onClick={() => void chooseLocationMode("current")}
              className="mt-3 w-full rounded-2xl border border-ivory/10 bg-black/15 p-4 text-left transition hover:border-amber/30 hover:bg-amber/5"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-ivory">
                <LocateFixed size={16} className="text-amber" aria-hidden />
                {locationPending
                  ? t.find.locationRequesting
                  : currentCoordinates
                    ? t.find.currentLocationReady
                    : locationMessage
                      ? t.find.currentLocationRetry
                      : t.find.currentLocationHint}
              </p>
              {currentCoordinates ? <p className="mt-2 text-xs text-muted">{formatCoordinates(currentCoordinates)}</p> : null}
            </button>
          ) : null}

          {locationMode === "map" ? (
            <div className="mt-3 rounded-[1.5rem] border border-ivory/10 bg-black/15 p-3">
              {currentCoordinates || mapCoordinates ? (
                <>
                  <LocationMapPicker
                    center={(mapCoordinates || currentCoordinates)!}
                    selected={mapCoordinates}
                    onSelect={(coordinates) => {
                      setMapCoordinates(coordinates);
                      setLocationMessage(t.find.mapPinReady);
                    }}
                    label={t.find.mapPickerLabel}
                    hint={t.find.mapPickerHint}
                    zoomInLabel={t.find.mapZoomIn}
                    zoomOutLabel={t.find.mapZoomOut}
                  />
                  {mapCoordinates ? <p className="mt-3 text-xs text-muted">{formatCoordinates(mapCoordinates)}</p> : null}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => void chooseLocationMode("map")}
                  className="flex min-h-28 w-full items-center justify-center rounded-[1.15rem] border border-amber/25 bg-amber/8 px-4 text-center text-sm font-semibold text-ivory transition hover:bg-amber/12"
                >
                  {locationPending ? t.find.mapSearchingLocation : location.trim() ? t.find.mapUseTypedLocation : t.find.mapPermissionRequired}
                </button>
              )}
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

function getLocationFailure(error: unknown): LocationFailure {
  if (error instanceof Error && error.message === "unsupported") return "unsupported";
  const geolocationError = error as Partial<GeolocationPositionError>;
  if (geolocationError.code === 1) return "denied";
  if (geolocationError.code === 3) return "timeout";
  return "unavailable";
}
