// Static slug-pairing table for the four fixed Phase 3 pages (D-13). Every
// localized-slug page link and its language-switcher counterpart MUST resolve
// through pagePairUrl() — never a hand-built string — so the PT/EN slug pairs
// (which intentionally differ, e.g. /curriculo vs /en/resume) can never drift
// apart. Delegates all slash/prefix handling to localeUrl(); this module only
// owns the slug lookup.
import { localeUrl, type Locale } from "./url.ts";

const SLUGS = {
  resume: { pt: "curriculo", en: "resume" },
  portfolio: { pt: "portfolio", en: "portfolio" },
  uses: { pt: "uses", en: "uses" },
  now: { pt: "now", en: "now" },
} as const;

export function pagePairUrl(key: keyof typeof SLUGS, locale: Locale): string {
  return localeUrl(locale, SLUGS[key][locale]);
}
