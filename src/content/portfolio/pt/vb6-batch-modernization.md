---
title: "Modernização de batch legado em VB6 com agentes de IA"
translationKey: "vb6-batch-modernization"
period: "2026 - atual"
stack:
  - "VB6"
  - "Java 25"
  - "Spring Batch"
  - "Spring Boot 4"
  - "REST"
  - "MCP"
  - "SSH"
order: 1
summary: "Destravei uma modernização parada havia anos, estruturando o trabalho para agentes de IA com testes de caracterização via SSH."
---

## Problema

Processos batch legados em VB6 na Techne, cujo volume inviabilizava a reescrita havia anos, o tipo de projeto que ficava anos na gaveta.

## Abordagem

Estruturei o trabalho para agentes de IA: contrato arquitetural versionado no repositório, acesso ao banco real via MCP e testes de caracterização que executam o binário VB original via SSH para gerar os gabaritos que o Java precisa reproduzir, mantendo paridade 1:1 com o sistema original.

## Tecnologia

VB6 (legado), Spring Batch, Java 25, Spring Boot 4, REST, MCP, SSH, testes de caracterização, agentes de IA.

## Resultado

Destravou uma modernização parada havia anos. Paridade 1:1 com o sistema original, exposto via REST.
