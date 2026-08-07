import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge only recognises t-shirt sizes as font sizes, so custom scale
// steps like `text-display-2` would be read as text *colours* and dropped the
// moment a colour class follows them. Teaching it the scale keeps the sizes.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display-1", "display-2", "display-3", "lead", "body", "label"] }],
      rounded: [{ rounded: ["card", "panel", "pill"] }]
    }
  }
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://dinecue.com";
  return new URL(path, base).toString();
}

export function formatDate(value?: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
