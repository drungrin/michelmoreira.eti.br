// The single date formatter for user-facing dates: the /now timestamp today,
// and any future dated content that needs a localized long-form date reuses
// this instead of hand-rolling a new Intl call. Always keys the Intl locale
// tag off HTML_LANG, never a hardcoded "pt"/"en" string, so the routing
// locale and the document-lang mapping can never drift apart.
import type { Locale } from "./url.ts";
import { HTML_LANG } from "../i18n/ui.ts";

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(HTML_LANG[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
