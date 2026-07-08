---
title: "Automação de documentação técnica serverless com Amazon Bedrock"
translationKey: "bedrock-doc-automation"
period: "2018 - 2026"
stack:
  - "AWS Step Functions"
  - "Amazon Bedrock"
  - "Claude Sonnet"
  - "RAG"
  - "pgvector"
  - "RDS PostgreSQL"
order: 2
summary: "Arquitetura serverless orientada a eventos que reduziu um processamento de dias para minutos."
---

## Problema

Automação de documentação técnica na Techne: um processamento que levava dias.

## Abordagem

Desenhei uma arquitetura serverless e orientada a eventos: AWS Step Functions orquestrando Amazon Bedrock (Claude Sonnet), com RAG sobre pgvector no RDS PostgreSQL.

## Tecnologia

AWS Step Functions, Amazon Bedrock (Claude Sonnet), RAG, pgvector, RDS PostgreSQL, arquitetura serverless.

## Resultado

A automação eliminou mais de 80% do esforço manual de documentação. Processou sessões contínuas de 9 horas com zero alucinações, e o tempo de entrega caiu de dias para minutos.
