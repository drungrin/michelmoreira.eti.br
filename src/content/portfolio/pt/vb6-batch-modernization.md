---
title: "Modernização de batch legado em VB6 com agentes de IA"
translationKey: "vb6-batch-modernization"
period: "2026 - atual"
stack:
  - "VB6"
  - "Java 25"
  - "Spring Batch"
  - "Spring Boot 4"
  - "SQL Server"
  - "Testcontainers"
  - "REST"
  - "JWT"
  - "MCP"
  - "SSH"
  - "Azure DevOps"
order: 1
summary: "Arquitetura, esqueleto e método para destravar uma reescrita parada havia anos: contrato versionado, testes de caracterização contra o binário original e um trilho incremental para o time executar."
---

## Problema

Processos batch legados em VB6 na Techne, disparados como executáveis .exe por uma interface Java. São 97 processos, e esse volume inviabilizava a reescrita havia anos: grande demais para um big-bang e arriscado demais para tocar sem rede de segurança, porque o comportamento precisa continuar idêntico enquanto o sistema roda em produção. Era o tipo de projeto que ficava anos na gaveta.

## Abordagem

<figure class="diagram">
<svg viewBox="0 0 650 348" width="100%" role="img" aria-label="Antes e depois: do .exe disparado pela interface a um Job Spring Batch via REST" style="max-width:650px;height:auto;color:inherit;font-family:ui-sans-serif,system-ui,sans-serif">
<defs><marker id="am_pt" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor" fill-opacity="0.55"/></marker></defs><text x="165" y="24" text-anchor="middle" font-size="11" letter-spacing="1.5" fill="currentColor" fill-opacity="0.55">ANTES</text><text x="475" y="24" text-anchor="middle" font-size="11" letter-spacing="1.5" fill="currentColor" fill-opacity="0.55">DEPOIS</text><line x1="318" y1="40" x2="318" y2="322" stroke="currentColor" stroke-opacity="0.18" stroke-dasharray="4 6"/><rect x="40" y="44" width="250" height="40" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="165" y="68" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">Interface Java</text><rect x="40" y="150" width="250" height="40" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="165" y="174" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">VB6 .exe</text><rect x="40" y="254" width="250" height="48" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="165" y="274.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">SQL Server</text><text x="165" y="289.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">(2 bancos legados)</text><line x1="165" y1="84" x2="165" y2="108" stroke="currentColor" stroke-opacity="0.45"/><line x1="165" y1="124" x2="165" y2="149" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#am_pt)"/><text x="165" y="120" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">dispara .exe</text><line x1="165" y1="190" x2="165" y2="253" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#am_pt)"/><rect x="340" y="44" width="270" height="40" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="475" y="68" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">Interface Java</text><rect x="340" y="150" width="270" height="52" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="475" y="172.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">REST API + Spring Batch</text><text x="475" y="187.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">Java 25 · Boot 4 · chunk=1</text><rect x="340" y="262" width="270" height="52" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="475" y="284.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">SQL Server (dual)</text><text x="475" y="299.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">session-proxy = VB 1:1</text><line x1="475" y1="84" x2="475" y2="102" stroke="currentColor" stroke-opacity="0.45"/><line x1="475" y1="130" x2="475" y2="149" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#am_pt)"/><text x="475" y="114" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">POST /executions (JWT)</text><text x="475" y="126" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">202 + jobExecutionId</text><line x1="475" y1="202" x2="475" y2="261" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#am_pt)"/><text x="475" y="332" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">GET /{id} · GET /{id}/log</text>
</svg>
  <figcaption>Do .exe disparado pela interface ao Job Spring Batch acionado por REST.</figcaption>
</figure>

Em vez de reescrever tudo de uma vez, meu entregável foi a arquitetura, o esqueleto e o processo de migração, de forma que a reescrita virasse um trilho incremental que um time consegue executar. Três decisões sustentam isso.

A primeira é um contrato arquitetural versionado no repositório: um catálogo canônico que mapeia cada processo VB ao pacote Java de destino e previne colisões de nome, mais um roteiro de migração por processo. O trabalho foi estruturado para agentes de IA, com skills reutilizáveis e acesso ao banco real via MCP, para os agentes validarem contra o banco de verdade em vez de suposições.

A segunda é a rede de segurança: testes de caracterização. O binário VB original roda no Windows via SSH e PowerShell e gera o gabarito, arquivos .csv e logs semânticos; o Job Spring Batch precisa reproduzir a mesma saída para a mesma entrada. A paridade exigida é funcional, no nível de domínio: mesma saída de negócio para a mesma entrada, com diferenças de timestamp fora de escopo. Sete cenários, do caminho feliz à idempotência, comparação de 6 campos de negócio por registro e uma comparação semântica do log que normaliza timestamp e encoding e casa cada linha com a categoria equivalente do log VB. Tudo roda contra um SQL Server real via Testcontainers.

<figure class="diagram">
<svg viewBox="0 0 500 398" width="100%" role="img" aria-label="Loop de caracterização: o binário VB gera o gabarito, o Job Spring Batch precisa reproduzir" style="max-width:500px;height:auto;color:inherit;font-family:ui-sans-serif,system-ui,sans-serif">
<defs><marker id="pm_pt" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor" fill-opacity="0.55"/></marker></defs><rect x="90" y="40" width="300" height="46" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="240" y="59.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">VB6 .exe</text><text x="240" y="74.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">(Windows)</text><rect x="90" y="168" width="300" height="48" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="240" y="188.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">expected/*.csv + logs semânticos</text><text x="240" y="203.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">ORÁCULO (gabarito)</text><rect x="90" y="300" width="300" height="52" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="240" y="322.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">Spring Batch Job</text><text x="240" y="337.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">Testcontainers · SQL Server 2022</text><line x1="240" y1="86" x2="240" y2="118" stroke="currentColor" stroke-opacity="0.45"/><line x1="240" y1="134" x2="240" y2="167" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#pm_pt)"/><text x="240" y="130" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">produz</text><line x1="240" y1="216" x2="240" y2="243" stroke="currentColor" stroke-opacity="0.45"/><line x1="240" y1="271" x2="240" y2="299" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#pm_pt)"/><text x="240" y="255" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">compara 6 campos por registro</text><text x="240" y="267" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">+ log semântico normalizado</text><text x="240" y="374" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">7 cenários (C1-C7) · idempotência</text><text x="240" y="387" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">vira gate de paridade no CI</text><path d="M 390 326 H 452 V 63 H 390" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="5 4" marker-end="url(#pm_pt)"/><text transform="rotate(-90 470 195)" x="470" y="195" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">roda via SSH · mesmos parâmetros</text>
</svg>
  <figcaption>O binário VB gera o gabarito; o Job Spring Batch precisa reproduzi-lo, e qualquer divergência falha o CI.</figcaption>
</figure>

A terceira é fidelidade onde importa e divergência onde compensa. O Step usa chunk-size=1, uma transação por registro, para preservar a semântica de commit e rollback do VB. O acesso a dados é JdbcTemplate puro, sem ORM, para manter as queries fiéis às originais. Um proxy de DataSource replica o bootstrap de sessão por conexão do legado, para as views de segurança do sistema antigo continuarem se comportando igual. A divergência é deliberada: skip-limit=100, para um registro problemático não abortar o lote inteiro como acontecia no VB.

A entrega troca o disparo de processo do sistema operacional por REST. A interface consumidora cria uma execução assíncrona, o POST devolve 202 e um identificador, consulta o status e recupera o log persistido por HTTP, com autenticação JWT. O serviço roda em container, Java 25 sobre Alpine, publicado por um pipeline no Azure DevOps.

## Tecnologia

Java 25 LTS, Spring Boot 4 e Spring Batch 6 no núcleo. SQL Server acessado por JdbcTemplate, sem ORM; Flyway apenas para o schema de metadados do próprio Batch; Testcontainers para os testes de caracterização; autenticação JWT; empacotamento em container (eclipse-temurin:25-jre-alpine) com pipeline no Azure DevOps e imagem no Azure Container Registry. Do lado de IA, um contrato versionado para agentes, skills reutilizáveis e MCP para o SQL Server real.

## Resultado

A arquitetura, o esqueleto e o método de migração estão de pé, validados de ponta a ponta em 1 dos 97 processos do backlog, com um gate de caracterização que prova a paridade antes de qualquer merge. Foi isso que tirou a reescrita da gaveta: o que era um big-bang inviável virou um trilho incremental, com contrato e rede de segurança, que o time executa processo a processo. Os desenvolvedores já estão sendo alocados para migrar o restante do backlog contra o mesmo contrato e o mesmo gate.

Não está terminado, e o ponto é esse: entreguei o caminho, não a migração inteira. O custo do trilho é concreto: cada processo exige capturar o gabarito do binário original num host Windows e manter um SQL Server real no circuito de teste.
