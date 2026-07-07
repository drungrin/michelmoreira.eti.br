---
---

Day to day setup, revised whenever something actually changes (not a static showcase).

## Hardware

- **To be confirmed with Michel.** No hardware item has been validated yet; nothing was assumed here per rule zero (no invented brand, model, or spec).

## Editor and Terminal

- **VS Code inside the devcontainer**: extensions pinned in `devcontainer.json` (Astro, Tailwind CSS IntelliSense, Prettier, ESLint, GitLens), so the environment is reproducible on any machine that boots the container.
- **Claude Code**: runs contained inside the devcontainer (`sysbox-runc` plus Docker-in-Docker), used on this project for the whole GSD planning and execution flow.
- **Git and the GitHub CLI**: PRs are required on `main`, with an automatic Cloudflare Pages preview on every branch.

## Dev Stack

- **Astro 7**: the framework chosen for this site, fully static output, native i18n instead of a client-side framework.
- **Tailwind CSS v4** (`@tailwindcss/vite`): semantic tokens defined in `@theme`, no `tailwind.config.js` file.
- **Node.js 24**: build and dev runtime, pinned in `.nvmrc` to match the Cloudflare build.
- **Java, Python, C#, .NET, TypeScript**: languages used across a career in systems architecture and low-code platforms.
- **AWS (Lambda, ECS, Step Functions, Amazon Bedrock)**: current production stack for GenAI-driven technical documentation automation, with RAG via `pgvector` on RDS PostgreSQL.

## Services and Apps

- **Cloudflare Pages**: static hosting with automatic deploy on every push to `main` and a preview per PR.
- **GitHub**: code hosting and CI/CD through the native git integration.
- **Other daily apps**: to be confirmed with Michel before publishing (nothing beyond what already runs on this project was assumed).
