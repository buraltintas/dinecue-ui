"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import type { DivIcon, LeafletMouseEvent, Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

export type MapCoordinates = {
  lat: number;
  lng: number;
};

type LeafletModule = typeof import("leaflet");

export function LocationMapPicker({
  center,
  selected,
  onSelect,
  label,
  hint,
  zoomInLabel,
  zoomOutLabel
}: {
  center: MapCoordinates;
  selected: MapCoordinates | null;
  onSelect: (coordinates: MapCoordinates) => void;
  label: string;
  hint: string;
  zoomInLabel: string;
  zoomOutLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const markerIconRef = useRef<DivIcon | null>(null);
  const onSelectRef = useRef(onSelect);
  const latestCenterRef = useRef(center);
  const selectedRef = useRef(selected);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    latestCenterRef.current = center;
    if (!mapRef.current) return;
    mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom(), { animate: true });
  }, [center]);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;
      const leaflet = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      leafletRef.current = leaflet;
      markerIconRef.current = createMarkerIcon(leaflet);

      const map = leaflet.map(containerRef.current, {
        attributionControl: false,
        center: [latestCenterRef.current.lat, latestCenterRef.current.lng],
        keyboard: true,
        scrollWheelZoom: true,
        touchZoom: true,
        zoom: 15,
        zoomControl: false
      });

      leaflet
        .tileLayer("/api/map/tiles/{z}/{x}/{y}", {
          maxZoom: 19,
          minZoom: 3,
          tileSize: 256
        })
        .addTo(map);

      leaflet.control
        .zoom({
          position: "topright",
          zoomInTitle: zoomInLabel,
          zoomOutTitle: zoomOutLabel
        })
        .addTo(map);

      const handlePick = (event: LeafletMouseEvent) => {
        const coordinates = { lat: event.latlng.lat, lng: event.latlng.lng };
        setMarker(leaflet, map, markerRef, markerIconRef.current, coordinates, onSelectRef.current);
        onSelectRef.current(coordinates);
      };

      map.on("click", handlePick);
      mapRef.current = map;

      if (selectedRef.current) {
        setMarker(leaflet, map, markerRef, markerIconRef.current, selectedRef.current, onSelectRef.current);
      }

      window.setTimeout(() => map.invalidateSize(), 80);
    }

    void initMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      markerIconRef.current = null;
    };
  }, [zoomInLabel, zoomOutLabel]);

  useEffect(() => {
    if (!leafletRef.current || !mapRef.current || !selected) return;
    setMarker(leafletRef.current, mapRef.current, markerRef, markerIconRef.current, selected, onSelectRef.current);
  }, [selected]);

  return (
    <div className="relative overflow-hidden rounded-[1.15rem] border border-ivory/10 bg-black/30">
      <div ref={containerRef} aria-label={label} className="h-72 w-full sm:h-80" />
      <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-ivory shadow-soft backdrop-blur">
        {hint}
      </div>
    </div>
  );
}

function setMarker(
  leaflet: LeafletModule,
  map: LeafletMap,
  markerRef: MutableRefObject<LeafletMarker | null>,
  icon: DivIcon | null,
  coordinates: MapCoordinates,
  onSelect: (coordinates: MapCoordinates) => void
) {
  if (!markerRef.current) {
    markerRef.current = leaflet
      .marker([coordinates.lat, coordinates.lng], {
        draggable: true,
        icon: icon || undefined,
        keyboard: true
      })
      .addTo(map);

    markerRef.current.on("dragend", () => {
      const next = markerRef.current?.getLatLng();
      if (!next) return;
      onSelect({ lat: next.lat, lng: next.lng });
    });
  }

  markerRef.current.setLatLng([coordinates.lat, coordinates.lng]);
}

function createMarkerIcon(leaflet: LeafletModule) {
  return leaflet.divIcon({
    className: "dinecue-map-marker",
    html: '<span class="dinecue-map-marker-pin" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a.92.92 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></span>',
    iconAnchor: [20, 40],
    iconSize: [40, 40]
  });
}
