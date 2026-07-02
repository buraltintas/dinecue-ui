import { cookies, headers } from "next/headers";
import "server-only";
import { languageCookieKey, resolveLanguagePriority } from "@/lib/i18n";

export function getRequestLanguage() {
  return resolveLanguagePriority({
    localLanguage: cookies().get(languageCookieKey)?.value,
    browserLanguage: headers().get("accept-language")
  });
}
