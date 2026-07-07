# michelmoreira.eti.br

Personal professional site and bilingual (PT/EN) technical blog of **Michel Moreira**,
Senior Software Architect. Built with [Astro](https://astro.build) as a static site,
deployed to Cloudflare Pages via git-driven CI/CD.

**The git repository is the single source of truth** — every page, article and résumé
lives as Markdown in this repo and is published automatically on push. There is no admin
panel, database, or server runtime.

## Stack

- **Astro** (static output, no adapter) with built-in i18n routing — PT at `/`, EN at `/en`.
- **Tailwind CSS v4** via `@tailwindcss/vite`.
- **Node.js 24** (pinned in `.nvmrc`; match this in CI to avoid dev/prod drift).

## Local development

```sh
npm install       # install dependencies
npm run dev       # dev server at http://localhost:4321
npm run build     # production build to ./dist
npm run preview   # preview the production build locally
npm run astro -- check   # type/content check
```

Use the Node version in `.nvmrc` (`nvm use`) so local builds match the Cloudflare build.

## URL convention

`/` is PT (default locale, unprefixed); `/en` is EN. URLs carry **no trailing slash**
(`build.format: "file"`, `trailingSlash: "never"`). All internal links go through the
single `localeUrl()` helper in `src/lib/url.ts` — never hand-write locale paths or call
`getRelativeLocaleUrl` directly in templates.

## Commit conventions

These rules are **locked** and apply to every commit in this repository:

- **Use a gitmoji at the start of every commit message** — e.g. `✨ Add ...`, `🐛 Fix ...`,
  `🔖 Release ...`, `📝 Docs ...`, `♻️ Refactor ...`, `🎉 Scaffold ...`.
- **Never add a `Co-Authored-By` trailer** (or any co-author trailer). Pushes with a
  co-author trailer are rejected on this project.
- **Describe changes technically** — what changed in the code and why. Commit messages
  must **never reference external planning or tracker identifiers** — no milestone, phase,
  plan, ticket, or requirement IDs of any kind. Such references have no meaning inside
  this repository and are forbidden here.
- **Branch naming: `feature/*`.** Work happens on `feature/<short-description>` branches.
- **`main` is protected — pull-request only.** Direct pushes to `main` are blocked; changes
  land through a reviewed PR whose preview build must pass.
- **Never commit secrets or certificates** of any kind (API tokens, private keys, `.env`
  files). `.env*` is gitignored — keep it that way.

## Deployment

Pushes to `main` deploy to production via the Cloudflare Pages git integration; every branch
and pull request gets its own `*.pages.dev` preview URL. No manual deploy step, no wrangler.

The Cloudflare Pages build command is `npm run build` (not a bare `astro build` — the build
image does not expose `node_modules` binaries on `PATH`). The production deployment is live at
<https://michelmoreira-eti-br.pages.dev> until the custom domain is cut over.
