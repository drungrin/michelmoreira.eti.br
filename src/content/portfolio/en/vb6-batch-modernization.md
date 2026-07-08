---
title: "Modernizing legacy VB6 batch processing with AI agents"
translationKey: "vb6-batch-modernization"
period: "2026 - present"
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
summary: "Architecture, skeleton, and method to unlock a rewrite stalled for years: a versioned contract, characterization tests against the original binary, and an incremental track for the team to execute."
---

## Problem

Legacy VB6 batch processes at Techne, launched as .exe executables by a Java interface. The volume of processes had made a rewrite unfeasible for years: too large for a big bang, and too risky to touch without a safety net, because the behavior has to stay identical while the system runs in production. It was the kind of project that sat in a drawer for years.

## Approach

<figure class="diagram">
<svg viewBox="0 0 650 348" width="100%" role="img" aria-label="Before and after: from a UI-spawned .exe to a Spring Batch job over REST" style="max-width:650px;height:auto;color:inherit;font-family:ui-sans-serif,system-ui,sans-serif">
<defs><marker id="am_en" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor" fill-opacity="0.55"/></marker></defs><text x="165" y="24" text-anchor="middle" font-size="11" letter-spacing="1.5" fill="currentColor" fill-opacity="0.55">BEFORE</text><text x="475" y="24" text-anchor="middle" font-size="11" letter-spacing="1.5" fill="currentColor" fill-opacity="0.55">AFTER</text><line x1="318" y1="40" x2="318" y2="322" stroke="currentColor" stroke-opacity="0.18" stroke-dasharray="4 6"/><rect x="40" y="44" width="250" height="40" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="165" y="68" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">Java interface</text><rect x="40" y="150" width="250" height="40" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="165" y="174" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">VB6 .exe</text><rect x="40" y="254" width="250" height="48" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="165" y="274.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">SQL Server</text><text x="165" y="289.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">(2 legacy databases)</text><line x1="165" y1="84" x2="165" y2="108" stroke="currentColor" stroke-opacity="0.45"/><line x1="165" y1="124" x2="165" y2="149" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#am_en)"/><text x="165" y="120" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">spawns .exe</text><line x1="165" y1="190" x2="165" y2="253" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#am_en)"/><rect x="340" y="44" width="270" height="40" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="475" y="68" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">Java interface</text><rect x="340" y="150" width="270" height="52" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="475" y="172.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">REST API + Spring Batch</text><text x="475" y="187.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">Java 25 · Boot 4 · chunk=1</text><rect x="340" y="262" width="270" height="52" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="475" y="284.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">SQL Server (dual)</text><text x="475" y="299.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">session proxy = VB 1:1</text><line x1="475" y1="84" x2="475" y2="102" stroke="currentColor" stroke-opacity="0.45"/><line x1="475" y1="130" x2="475" y2="149" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#am_en)"/><text x="475" y="114" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">POST /executions (JWT)</text><text x="475" y="126" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">202 + jobExecutionId</text><line x1="475" y1="202" x2="475" y2="261" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#am_en)"/><text x="475" y="332" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">GET /{id} · GET /{id}/log</text>
</svg>
  <figcaption>From a UI-spawned .exe to a Spring Batch job triggered over REST.</figcaption>
</figure>

Instead of rewriting everything at once, my deliverable was the architecture, the skeleton, and the migration process, so the rewrite becomes an incremental track a team can execute. Three decisions hold it together.

The first is a versioned architectural contract in the repository: a canonical catalog that maps each VB process to its target Java package and prevents naming collisions, plus a per-process migration roadmap. The work is structured for AI agents, with reusable skills and access to the real database via MCP, so the agents validate against the actual database rather than guesses.

The second is the safety net: characterization tests. The original VB binary runs on Windows via SSH and PowerShell and produces the golden output, .csv files and semantic logs; the Spring Batch job has to reproduce the same output for the same input. The parity required is functional, at the domain level: the same business output for the same input, with timestamp differences out of scope. Seven scenarios, from the happy path to idempotency, a comparison of 6 business fields per record, and a semantic log comparison that normalizes timestamp and encoding and matches each line to its equivalent VB log category. It all runs against a real SQL Server via Testcontainers.

<figure class="diagram">
<svg viewBox="0 0 500 398" width="100%" role="img" aria-label="Characterization loop: the VB binary produces the golden output the Spring Batch job must reproduce" style="max-width:500px;height:auto;color:inherit;font-family:ui-sans-serif,system-ui,sans-serif">
<defs><marker id="pm_en" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="currentColor" fill-opacity="0.55"/></marker></defs><rect x="90" y="40" width="300" height="46" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="240" y="59.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">VB6 .exe</text><text x="240" y="74.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">(Windows)</text><rect x="90" y="168" width="300" height="48" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="240" y="188.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">expected/*.csv + semantic logs</text><text x="240" y="203.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">ORACLE (golden)</text><rect x="90" y="300" width="300" height="52" rx="6" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.45"/><text x="240" y="322.5" text-anchor="middle" font-size="13" font-weight="500" fill="currentColor" fill-opacity="1">Spring Batch Job</text><text x="240" y="337.5" text-anchor="middle" font-size="11.5" font-weight="400" fill="currentColor" fill-opacity="0.6">Testcontainers · SQL Server 2022</text><line x1="240" y1="86" x2="240" y2="118" stroke="currentColor" stroke-opacity="0.45"/><line x1="240" y1="134" x2="240" y2="167" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#pm_en)"/><text x="240" y="130" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">produces</text><line x1="240" y1="216" x2="240" y2="243" stroke="currentColor" stroke-opacity="0.45"/><line x1="240" y1="271" x2="240" y2="299" stroke="currentColor" stroke-opacity="0.45" marker-end="url(#pm_en)"/><text x="240" y="255" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">compares 6 fields per record</text><text x="240" y="267" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">+ normalized semantic log</text><text x="240" y="374" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">7 scenarios (C1-C7) · idempotency</text><text x="240" y="387" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">becomes a parity gate in CI</text><path d="M 390 326 H 452 V 63 H 390" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="5 4" marker-end="url(#pm_en)"/><text transform="rotate(-90 470 195)" x="470" y="195" text-anchor="middle" font-size="10.5" fill="currentColor" fill-opacity="0.6">runs via SSH · same input params</text>
</svg>
  <figcaption>The VB binary produces the golden output; the Spring Batch job must reproduce it, and any divergence fails CI.</figcaption>
</figure>

The third is fidelity where it matters and divergence where it pays off. The step uses chunk-size=1, one transaction per record, to preserve the VB commit and rollback semantics. Data access is plain JdbcTemplate, no ORM, to keep the queries faithful to the originals. A DataSource proxy replicates the legacy per-connection session bootstrap, so the old system's security views keep behaving the same way. The divergence is deliberate: skip-limit=100, so one problematic record does not abort the whole batch the way it did in VB.

Delivery replaces OS-process spawning with REST. The consuming interface creates an asynchronous execution, the POST returns 202 and an identifier, polls the status, and retrieves the persisted log over HTTP, with JWT authentication. The service runs in a container, Java 25 on Alpine, published by an Azure DevOps pipeline.

## Technology

Java 25 LTS, Spring Boot 4, and Spring Batch 6 at the core. SQL Server accessed through JdbcTemplate, no ORM; Flyway only for the Batch metadata schema; Testcontainers for the characterization tests; JWT authentication; container packaging (eclipse-temurin:25-jre-alpine) with an Azure DevOps pipeline and the image in Azure Container Registry. On the AI side, a versioned contract for agents, reusable skills, and MCP to the real SQL Server.

## Result

The architecture, the skeleton, and the migration method are in place and validated end to end on the first process, with a characterization gate that proves parity before any merge. That is what took the rewrite out of the drawer: what was an unfeasible big bang became an incremental track, with a contract and a safety net, that the team runs one process at a time. Developers are already being allocated to migrate the rest of the backlog against the same contract and the same gate.

It is not finished, and that is the point: I delivered the path, not the whole migration. The cost of the track is concrete: each process requires capturing the original binary's golden output on a Windows host and keeping a real SQL Server in the test loop.
