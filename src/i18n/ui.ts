// Tiny typed PT/EN string table for the site's chrome strings (header, theme
// toggle, language switcher, metadata). No runtime i18n framework: page and
// article bodies are translated as separate Markdown files per locale; only
// chrome strings live here.
import type { Locale } from "../lib/url";

/**
 * Single source for the routing-code -> BCP-47 `<html lang>` mapping.
 * Routing/path code is `pt`, but the document lang is `pt-BR`. Any future
 * hreflang/sitemap emission MUST reuse this map instead of re-deriving it.
 */
export const HTML_LANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

/** Native language names for the switcher (native names only, no flags). */
export const LOCALE_NAME: Record<Locale, string> = {
  pt: "Português",
  en: "English",
};

/** Site brand string rendered by the header. */
export const BRAND = "Michel Moreira";

/** Per-locale UI chrome strings. */
export const ui: Record<
  Locale,
  {
    title: string;
    metaDescription: string;
    themeLabelLight: string;
    themeLabelDark: string;
    themeLabelSystem: string;
    languageLabel: string;
    footerCopyright: string;
    navResume: string;
    navPortfolio: string;
    navUses: string;
    navNow: string;
    selectedWorkLabel: string;
    readCaseLabel: string;
    viewAllCasesLabel: string;
    pdfDownloadLabel: string;
    nowUpdatedLabel: string;
  }
> = {
  pt: {
    title: "Michel Moreira · Senior Software Architect",
    metaDescription:
      "Michel Moreira, Senior Software Architect. Modernização de sistemas legados com engenharia de LLM e GenAI em produção na AWS. Currículo e portfolio de 20+ anos de arquitetura.",
    themeLabelLight: "Mudar tema, atual: claro",
    themeLabelDark: "Mudar tema, atual: escuro",
    themeLabelSystem: "Mudar tema, atual: sistema",
    languageLabel: "Idioma",
    footerCopyright: "© 2026 Michel Moreira",
    navResume: "Currículo",
    navPortfolio: "Portfolio",
    navUses: "Uses",
    navNow: "Now",
    selectedWorkLabel: "Arquitetura na prática",
    readCaseLabel: "Ler o case →",
    viewAllCasesLabel: "Ver todos os cases →",
    pdfDownloadLabel: "Baixar currículo em PDF",
    nowUpdatedLabel: "Atualizado em",
  },
  en: {
    title: "Michel Moreira · Senior Software Architect",
    metaDescription:
      "Michel Moreira, Senior Software Architect. Legacy system modernization with LLM engineering and GenAI in production on AWS. Resume and 20+ year architecture portfolio.",
    themeLabelLight: "Change theme, current: light",
    themeLabelDark: "Change theme, current: dark",
    themeLabelSystem: "Change theme, current: system",
    languageLabel: "Language",
    footerCopyright: "© 2026 Michel Moreira",
    navResume: "Resume",
    navPortfolio: "Portfolio",
    navUses: "Uses",
    navNow: "Now",
    selectedWorkLabel: "Selected work",
    readCaseLabel: "Read the case →",
    viewAllCasesLabel: "See all cases →",
    pdfDownloadLabel: "Download resume as PDF",
    nowUpdatedLabel: "Updated",
  },
};
