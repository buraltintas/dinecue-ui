import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Nunito_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/utils";
import { languageCookieKey, resolveLanguagePriority } from "@/lib/i18n";
import en from "@/messages/en.json";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-nunito-sans"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0F"
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: en.landing.seoTitle,
    template: "%s | DineCue"
  },
  description: en.landing.seoDescription,
  applicationName: "DineCue",
  authors: [{ name: "DineCue" }],
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }]
  },
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: "DineCue",
    title: en.landing.seoTitle,
    description: en.landing.seoDescription,
    images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: "DineCue dining assistant preview" }]
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

  return (
    <html lang={initialLanguage}>
      <body className={`${nunitoSans.variable} ${nunitoSans.className}`}>
        <JsonLd />
        <AppProviders initialLanguage={initialLanguage} hasLanguageCookie={hasLanguageCookie}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
