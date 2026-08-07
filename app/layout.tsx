import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Fraunces, IBM_Plex_Mono, Nunito_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { absoluteUrl } from "@/lib/utils";
import { languageCookieKey, resolveLanguagePriority } from "@/lib/i18n";
import { hasAuthCookies } from "@/lib/server/authCookies";
import en from "@/messages/en.json";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-nunito-sans"
});

// Display face. The SOFT and WONK axes are what keep headings from reading as
// a stock serif; see docs/DESIGN_SYSTEM.md.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["SOFT", "WONK"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-fraunces"
});

// Micro-label and data face: eyebrows, match scores, counters.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-plex-mono"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#100E0C"
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dinecue.com"),
  title: {
    default: en.landing.seoTitle,
    template: "%s | dinecue"
  },
  description: en.landing.seoDescription,
  applicationName: "dinecue",
  authors: [{ name: "dinecue" }],
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }]
  },
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: "dinecue",
    title: en.landing.seoTitle,
    description: en.landing.seoDescription,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "dinecue dining assistant preview" }]
  },
  twitter: {
    card: "summary_large_image",
    title: en.landing.seoTitle,
    description: en.landing.seoDescription,
    images: [absoluteUrl("/opengraph-image")]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const languageCookie = cookies().get(languageCookieKey)?.value;
  const initialLanguage = resolveLanguagePriority({
    localLanguage: languageCookie,
    browserLanguage: headers().get("accept-language")
  });
  const hasLanguageCookie = Boolean(languageCookie);
  const initialHasAuthSession = hasAuthCookies();

  return (
    // The font variables live on <html> so that the --font-sans/-display/-mono
    // aliases declared on :root in globals.css can actually resolve them.
    <html lang={initialLanguage} className={`${nunitoSans.variable} ${fraunces.variable} ${plexMono.variable}`}>
      <body className="font-sans">
        <AppProviders initialLanguage={initialLanguage} hasLanguageCookie={hasLanguageCookie} initialHasAuthSession={initialHasAuthSession}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
