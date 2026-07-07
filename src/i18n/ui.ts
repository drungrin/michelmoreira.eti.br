// Tiny typed PT/EN string table for the handful of UI strings this phase needs.
// No runtime i18n framework — article/page bodies are translated as separate
// Markdown files per locale (later phases); only chrome strings live here.
import type { Locale } from '../lib/url';

/**
 * Single source for the routing-code -> BCP-47 `<html lang>` mapping.
 * Routing/path code is `pt`, but the document lang (and Phase 5 hreflang) is
 * `pt-BR`. Phase 5 hreflang/sitemap MUST reuse this map — do not re-derive it.
 */
export const HTML_LANG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
};

/** Native language names for the switcher (no flags — project-wide rule, D-04). */
export const LOCALE_NAME: Record<Locale, string> = {
  pt: 'Português',
  en: 'English',
};

/** Per-locale UI strings (the `<html>` title for now). */
export const ui: Record<Locale, { title: string }> = {
  pt: { title: 'Michel Moreira — Senior Software Architect' },
  en: { title: 'Michel Moreira — Senior Software Architect' },
};
