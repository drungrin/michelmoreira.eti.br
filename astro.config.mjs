// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://michelmoreira.eti.br",
  output: "static", // default; no adapter — Cloudflare Pages serves the static build directly
  // Cloudflare Pages issues sitewide redirects for directory-format builds, so
  // file format keeps the EN home canonical at /en without redirects
  // (en/index.astro -> en.html, served at /en).
  build: { format: "file" },
  trailingSlash: "never", // the canonical form of every URL has no trailing slash
  i18n: {
    defaultLocale: "pt",
    locales: ["pt", "en"],
    routing: {
      prefixDefaultLocale: false, // PT at /, EN at /en
      redirectToDefaultLocale: false,
    },
  },
  // Native Fonts API: one self-hosted family, downloaded at build time.
  // Self-hosted → no third-party font requests from visitors' browsers.
  // Weights limited to 400 (regular) and 600 (semibold), normal style only —
  // the full type scale uses exactly these two weights.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 600],
      styles: ["normal"],
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
