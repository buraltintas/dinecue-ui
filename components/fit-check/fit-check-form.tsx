"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, LocateFixed, MapPin, Search, Star } from "lucide-react";
import { checkRestaurantFit, getRestaurant, searchRestaurants } from "@/lib/api/restaurants";
import { ApiClientError } from "@/lib/api/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/providers/i18n-provider";
import { MomentFields, emptyMoment, toContextPayload, type MomentFieldsValue } from "@/components/shared/moment-fields";
import { cn } from "@/lib/utils";
import { FitCheckReport } from "./fit-check-report";
import type { RestaurantFitCheckResponse, RestaurantSearchResultDto } from "@/lib/types";

type Coordinates = { lat: number; lng: number };

type Selection = {
  placeId: string;
  name: string;
  address: string;
};

export function FitCheckForm() {
  const searchParams = useSearchParams();
  const { language, t } = useI18n();
  // The zero-friction path: arriving from a recommendation card or a saved place.
  const deepLinkedPlaceId = searchParams.get("placeId");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [query, setQuery] = useState("");
  const [locationText, setLocationText] = useState("");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [results, setResults] = useState<RestaurantSearchResultDto[] | null>(null);
  const [moment, setMoment] = useState<MomentFieldsValue>(emptyMoment);
  const [visitAt, setVisitAt] = useState("");
  const [error, setError] = useState("");
  const [report, setReport] = useState<RestaurantFitCheckResponse | null>(null);

  // A deep-linked place is resolved to its name/address so the diner sees what they are checking.
  const deepLinked = useQuery({
    queryKey: ["restaurant", deepLinkedPlaceId],
    queryFn: () => getRestaurant(deepLinkedPlaceId!),
    enabled: Boolean(deepLinkedPlaceId) && !selection
  });

  useEffect(() => {
    if (!deepLinked.data) return;
    setSelection({
      placeId: deepLinked.data.providerPlaceId,
      name: deepLinked.data.name,
      address: deepLinked.data.address
    });
  }, [deepLinked.data]);

  const search = useMutation({
    mutationFn: (input: { nearby: boolean }) =>
      searchRestaurants({
        query: input.nearby && query.trim().length < 2 ? "restaurant" : query.trim(),
        language,
        location: buildLocation(),
        cues: input.nearby ? ["nearby"] : undefined
      }),
    onSuccess: (found) => {
      setResults(found);
      setError(found.length === 0 ? t.fitCheck.noResults : "");
    },
    onError: (caught) => {
      setResults(null);
      setError(caught instanceof ApiClientError && caught.status === 401 ? t.errors.signInAgain : t.fitCheck.searchError);
    }
  });

  const fit = useMutation({
    mutationFn: () =>
      checkRestaurantFit(selection!.placeId, {
        rawText: moment.rawText.trim() || null,
        language,
        context: {
          ...toContextPayload(moment),
          // Opening hours only become a usable signal once we know when they intend to go.
          ...(visitAt ? { visitAt: new Date(visitAt).toISOString() } : {})
        }
      }),
    onSuccess: (response) => {
      setReport(response);
      setError("");
    },
    onError: (caught) => {
      if (caught instanceof ApiClientError && caught.status === 401) setError(t.errors.signInAgain);
      else if (caught instanceof ApiClientError && caught.code === "quota_exceeded") {
        setError(`${t.errors.quotaExceeded} ${t.errors.proComingSoon}`);
      } else setError(t.fitCheck.checkError);
    }
  });

  function buildLocation() {
    if (coordinates) return { mode: "current" as const, text: locationText.trim() || null, lat: coordinates.lat, lng: coordinates.lng };
    return locationText.trim() ? { mode: "text" as const, text: locationText.trim() } : null;
  }

  async function requestCurrentLocation(thenSearchNearby: boolean) {
    setLocationMessage(t.find.locationRequesting);
    if (!navigator.geolocation) {
      setLocationMessage(t.find.locationUnsupportedError);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationMessage(t.find.currentLocationReady);
        if (thenSearchNearby) search.mutate({ nearby: true });
      },
      (caught) => {
        setLocationMessage(caught.code === 1 ? t.find.locationPermissionDenied : t.find.locationUnavailableError);
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 600_000 }
    );
  }

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length < 2) {
      setError(t.fitCheck.queryTooShort);
      return;
    }
    setError("");
    search.mutate({ nearby: false });
  }

  function pick(result: RestaurantSearchResultDto) {
    setSelection({ placeId: result.providerPlaceId, name: result.name, address: result.address });
    setResults(null);
    setReport(null);
    setError("");
  }

  function reset() {
    setSelection(null);
    setReport(null);
    setResults(null);
    setError("");
  }

  if (report && selection) {
    return (
      <FitCheckReport
        report={report}
        placeName={selection.name}
        address={selection.address}
        placeId={selection.placeId}
        onCheckAnother={reset}
      />
    );
  }

  return (
    <div className="glass rounded-panel p-5 sm:p-7">
      <p className="eyebrow text-copper">{t.fitCheck.eyebrow}</p>
      <h1 className="mt-4 font-display text-display-2 text-ivory text-balance">{t.fitCheck.title}</h1>
      <p className="mt-4 max-w-measure leading-7 text-muted text-pretty">{t.fitCheck.body}</p>

      {selection ? (
        <section className="mt-8 rounded-card border border-amber/25 bg-amber/[0.08] p-5" aria-label={t.fitCheck.selectedPlace}>
          <p className="eyebrow text-amber">{t.fitCheck.selectedPlace}</p>
          <h2 className="mt-3 font-display text-xl text-ivory">{selection.name}</h2>
          <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted">
            <MapPin className="mt-0.5 shrink-0 text-copper" size={15} aria-hidden />
            {selection.address}
          </p>
          <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={reset}>
            {t.fitCheck.changePlace}
          </Button>
        </section>
      ) : (
        <section className="mt-8" aria-label={t.fitCheck.findPlace}>
          <form onSubmit={submitSearch}>
            <label htmlFor="fitQuery" className="block text-sm text-muted">
              {t.fitCheck.findPlace}
            </label>
            <span className="relative mt-2 block">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={17} aria-hidden />
              <Input
                id="fitQuery"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.fitCheck.queryPlaceholder}
                className="pl-11"
              />
            </span>
            <span className="relative mt-3 block">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={17} aria-hidden />
              <Input
                value={locationText}
                onChange={(event) => setLocationText(event.target.value)}
                placeholder={t.fitCheck.locationPlaceholder}
                className="pl-11"
              />
            </span>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Button size="lg" disabled={search.isPending} className="sm:col-span-2">
                {search.isPending ? t.common.working : t.fitCheck.search}
              </Button>
              <Button type="button" variant="secondary" size="lg" onClick={() => void requestCurrentLocation(true)}>
                <LocateFixed size={16} aria-hidden />
                {t.fitCheck.nearby}
              </Button>
            </div>
          </form>
          {locationMessage ? <p className="mt-3 text-sm text-muted">{locationMessage}</p> : null}

          {results && results.length > 0 ? (
            <ul className="mt-5 space-y-2">
              {results.map((result) => (
                <li key={result.providerPlaceId}>
                  <button
                    type="button"
                    onClick={() => pick(result)}
                    className={cn(
                      "flex w-full items-start justify-between gap-4 rounded-card border border-ivory/10 bg-black/20 p-4 text-left transition",
                      "hover:border-amber/35 hover:bg-amber/[0.06]"
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ivory">{result.name}</span>
                      <span className="mt-1 block truncate text-sm text-muted">{result.address}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      {typeof result.rating === "number" ? (
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
                          <Star size={12} className="text-amber" aria-hidden />
                          {result.rating.toFixed(1)}
                        </span>
                      ) : null}
                      <Check size={16} className="text-copper" aria-hidden />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      )}

      {selection ? (
        <>
          <MomentFields
            value={moment}
            onChange={setMoment}
            noteLabel={t.fitCheck.noteLabel}
            notePlaceholder={t.fitCheck.notePlaceholder}
          />

          <label htmlFor="visitAt" className="mt-6 block text-sm text-muted">
            {t.fitCheck.visitAtLabel}
          </label>
          <Input
            id="visitAt"
            type="datetime-local"
            value={visitAt}
            onChange={(event) => setVisitAt(event.target.value)}
            className="mt-2 max-w-xs"
          />
          <p className="mt-2 text-xs leading-6 text-faint">{t.fitCheck.visitAtHint}</p>

          <Button className="mt-7 w-full sm:w-auto" size="lg" disabled={fit.isPending} onClick={() => fit.mutate()}>
            {fit.isPending ? t.common.working : t.fitCheck.submit}
          </Button>
        </>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-card border border-wine/40 bg-wine/20 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
