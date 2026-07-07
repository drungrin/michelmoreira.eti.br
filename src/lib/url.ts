// The SINGLE no-trailing-slash URL builder. Every internal link, the language
// switcher, and future canonical/hreflang/sitemap emitters MUST route through
// this helper; the build never produces trailing slashes (trailingSlash: "never"),
// so funneling every link through one emitter keeps links from drifting off the
// canonical form. Do NOT call getRelativeLocaleUrl raw in templates.
export type Locale = "pt" | "en";

/** '' -> '/' (pt) or '/en' (en). No trailing slash on locale roots or paths. */
export function localeUrl(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/|\/$/g, ""); // strip leading/trailing slashes
  const prefix = locale === "pt" ? "" : "/en"; // pt is default, unprefixed
  const suffix = clean ? `/${clean}` : "";
  return `${prefix}${suffix}` || "/"; // pt home -> '/', en home -> '/en'
}
