// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://michelmoreira.eti.br',
  output: 'static', // default; no adapter (Cloudflare Pages static — Pitfall 4)
  build: { format: 'file' }, // en/index.astro -> en.html -> served at /en (no trailing slash)
  trailingSlash: 'never', // canonical form has no trailing slash (Pitfall 1 / A)
  i18n: {
    defaultLocale: 'pt',
    locales: ['pt', 'en'],
    routing: {
      prefixDefaultLocale: false, // PT at /, EN at /en (I18N-01)
      redirectToDefaultLocale: false,
    },
  },
  // Native Fonts API (Astro >=6): one self-hosted family (INFRA-03).
  // Self-hosted → no third-party font requests → LGPD-safe. Real typefaces are Phase 2.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
