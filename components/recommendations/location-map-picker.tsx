"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { MapPin, Minus, Plus } from "lucide-react";

export type MapCoordinates = {
  lat: number;
  lng: number;
};

const tileSize = 256;
const defaultSize = { width: 640, height: 260 };

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
  const rootRef = useRef<HTMLButtonElement>(null);
  const [zoom, setZoom] = useState(14);
  const [size, setSize] = useState(defaultSize);
  const [mapCenter, setMapCenter] = useState(center);

  useEffect(() => {
    setMapCenter(center);
  }, [center]);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.max(280, entry.contentRect.width),
        height: Math.max(220, entry.contentRect.height)
      });
    });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  const centerPoint = latLngToPoint(mapCenter, zoom);
  const selectedPoint = selected ? latLngToPoint(selected, zoom) : null;

  const tiles = useMemo(() => {
    const startX = Math.floor((centerPoint.x - size.width / 2) / tileSize);
    const endX = Math.floor((centerPoint.x + size.width / 2) / tileSize);
    const startY = Math.floor((centerPoint.y - size.height / 2) / tileSize);
    const endY = Math.floor((centerPoint.y + size.height / 2) / tileSize);
    const maxTile = 2 ** zoom;
    const nextTiles: { key: string; src: string; left: number; top: number }[] = [];

    for (let x = startX; x <= endX; x += 1) {
      for (let y = startY; y <= endY; y += 1) {
        if (y < 0 || y >= maxTile) continue;
        const wrappedX = ((x % maxTile) + maxTile) % maxTile;
        nextTiles.push({
          key: `${zoom}-${wrappedX}-${y}`,
          src: `/api/map/tiles/${zoom}/${wrappedX}/${y}`,
          left: x * tileSize - centerPoint.x + size.width / 2,
          top: y * tileSize - centerPoint.y + size.height / 2
        });
      }
    }

    return nextTiles;
  }, [centerPoint.x, centerPoint.y, size.height, size.width, zoom]);

  function pick(event: MouseEvent<HTMLButtonElement>) {
    if (event.defaultPrevented) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = {
      x: centerPoint.x - rect.width / 2 + (event.clientX - rect.left),
      y: centerPoint.y - rect.height / 2 + (event.clientY - rect.top)
    };
    const next = pointToLatLng(point, zoom);
    setMapCenter(next);
    onSelect(next);
  }

  const markerPoint = selectedPoint
    ? {
        left: selectedPoint.x - centerPoint.x + size.width / 2,
        top: selectedPoint.y - centerPoint.y + size.height / 2
      }
    : { left: size.width / 2, top: size.height / 2 };

  return (
    <div className="relative">
      <button
        ref={rootRef}
        type="button"
        onClick={pick}
        className="relative h-64 w-full overflow-hidden rounded-[1.15rem] border border-ivory/10 bg-black/30 text-left"
        aria-label={label}
      >
        {tiles.map((tile) => (
          <Image
            key={tile.key}
            alt=""
            aria-hidden
            src={tile.src}
            width={tileSize}
            height={tileSize}
            unoptimized
            className="absolute h-64 w-64 select-none"
            draggable={false}
            style={{ left: tile.left, top: tile.top }}
          />
        ))}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" aria-hidden />
        <span
          className="pointer-events-none absolute -ml-4 -mt-8 grid h-9 w-9 place-items-center rounded-full bg-amber text-graphite shadow-glow"
          style={{ left: markerPoint.left, top: markerPoint.top }}
          aria-hidden
        >
          <MapPin size={19} />
        </span>
        <span className="absolute bottom-3 left-3 right-3 rounded-full bg-black/65 px-3 py-2 text-xs text-ivory backdrop-blur">
          {hint}
        </span>
      </button>
      <div className="absolute right-3 top-3 flex overflow-hidden rounded-full border border-ivory/10 bg-black/70 backdrop-blur">
        <button
          type="button"
          onClick={() => setZoom((value) => Math.min(18, value + 1))}
          className="grid h-9 w-9 place-items-center text-ivory transition hover:bg-ivory/10"
          aria-label={zoomInLabel}
        >
          <Plus size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setZoom((value) => Math.max(3, value - 1))}
          className="grid h-9 w-9 place-items-center border-l border-ivory/10 text-ivory transition hover:bg-ivory/10"
          aria-label={zoomOutLabel}
        >
          <Minus size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function latLngToPoint(coordinates: MapCoordinates, zoom: number) {
  const scale = tileSize * 2 ** zoom;
  const sinLat = Math.sin((coordinates.lat * Math.PI) / 180);
  return {
    x: ((coordinates.lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale
  };
}

function pointToLatLng(point: { x: number; y: number }, zoom: number): MapCoordinates {
  const scale = tileSize * 2 ** zoom;
  const lng = (point.x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * point.y) / scale;
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lng };
}
