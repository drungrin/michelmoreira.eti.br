// The SINGLE no-trailing-slash URL builder. Every internal link, the language
// switcher, and (later phases) canonical/hreflang/sitemap MUST route through
// this helper so the trailingSlash:"never" convention can never drift (Pitfall 1/A).
// Do NOT call getRelativeLocaleUrl raw in templates; this is the one emitter.
export type Locale = 'pt' | 'en';

/** '' -> '/' (pt) or '/en' (en). No trailing slash on locale roots or paths. */
export function localeUrl(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/|\/$/g, ''); // strip leading/trailing slashes
  const prefix = locale === 'pt' ? '' : '/en'; // pt is default, unprefixed
  const suffix = clean ? `/${clean}` : '';
  return `${prefix}${suffix}` || '/'; // pt home -> '/', en home -> '/en'
}
