// Portfolio case counterpart resolver (D-07, Pitfall 4). A case's cross-
// locale counterpart is ALWAYS resolved by matching translationKey against
// the other locale's collection entries — never by slug/id. Localized case
// titles produce different slugs per locale (e.g. pt "plataforma-low-code"
// vs en "low-code-platform"), so slug-matching would silently break the
// language switcher the moment a title diverges. Pure function, no Astro
// imports, so it stays runnable under plain node:test.
import { localeUrl, type Locale } from "./url.ts";

export interface PortfolioCounterpartEntry {
  translationKey: string;
  slug: string;
}

export function portfolioCounterpartUrl(
  entries: PortfolioCounterpartEntry[],
  translationKey: string,
  otherLocale: Locale,
): string | undefined {
  const match = entries.find(
    (entry) => entry.translationKey === translationKey,
  );
  if (!match) return undefined;
  return localeUrl(otherLocale, "portfolio/" + match.slug);
}
