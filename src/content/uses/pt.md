---
---

Setup usado no dia a dia, revisado a cada mudanca real (nao um showcase estatico).

## Hardware

- **A confirmar com Michel.** Nenhum item de hardware foi validado ainda; nada foi assumido aqui por regra zero (sem inventar marca, modelo ou especificacao).

## Editor e Terminal

- **VS Code dentro do devcontainer**: extensoes fixadas em `devcontainer.json` (Astro, Tailwind CSS IntelliSense, Prettier, ESLint, GitLens), assim o ambiente e reproduzivel em qualquer maquina que suba o container.
- **Claude Code**: roda contido no devcontainer (`sysbox-runc` + Docker-in-Docker), usado neste projeto para todo o fluxo de planejamento e execucao GSD.
- **Git + GitHub CLI**: PRs obrigatorios em `main`, preview automatico via Cloudflare Pages a cada branch.

## Stack de Desenvolvimento

- **Astro 7**: framework escolhido para este site, saida 100% estatica, i18n nativo em vez de framework client-side.
- **Tailwind CSS v4** (`@tailwindcss/vite`): tokens semanticos definidos em `@theme`, sem arquivo `tailwind.config.js`.
- **Node.js 24**: runtime de build e dev, pinado em `.nvmrc` para bater com o build da Cloudflare.
- **Java, Python, C#, .NET, TypeScript**: linguagens usadas ao longo da carreira em arquitetura de sistemas e plataformas low-code.
- **AWS (Lambda, ECS, Step Functions, Amazon Bedrock)**: stack atual de producao para automacao de documentacao tecnica com GenAI, com RAG via `pgvector` no RDS PostgreSQL.

## Servicos e Apps

- **Cloudflare Pages**: hospedagem estatica com deploy automatico a cada push em `main` e preview por PR.
- **GitHub**: hospedagem do codigo e CI/CD via git integration nativa.
- **Outros apps do dia a dia**: a confirmar com Michel antes de publicar (nada alem do que ja roda neste projeto foi assumido).
