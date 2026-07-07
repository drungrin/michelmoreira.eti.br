---
title: "Modernizing legacy VB6 batch processing with AI agents"
translationKey: "vb6-batch-modernization"
period: "2026 - present"
stack:
  - "VB6"
  - "Java 25"
  - "Spring Batch"
  - "Spring Boot 4"
  - "REST"
  - "MCP"
  - "SSH"
order: 1
summary: "Unlocked a modernization that had been stalled for years, structuring the work for AI agents with SSH-driven characterization tests."
---

## Problem

Legacy VB6 batch processes at Techne, whose volume had made a rewrite unfeasible for years, the kind of project that used to sit in a drawer.

## Approach

I structured the work for AI agents: a versioned architectural contract in the repository, access to the real database via MCP, and characterization tests that run the original VB binary via SSH to generate the fixtures the Java code must reproduce, keeping 1:1 parity with the original system.

## Technology

VB6 (legacy), Spring Batch, Java 25, Spring Boot 4, REST, MCP, SSH, characterization tests, AI agents.

## Result

Unlocked a modernization that had been stalled for years. 1:1 parity with the original system, exposed via REST.
