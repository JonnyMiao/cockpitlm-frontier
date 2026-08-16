# AGENTS.md

## Project

CockpitLM Frontier is a research intelligence platform for tracking frontier research in VLM, Video VLM, Omni Models, Multimodal Agents, World Models, and their transfer to intelligent cockpit applications.

## Core Principle

This is not a paper-listing demo.

Build a maintainable research intelligence platform that connects:

Paper → Method → Model → Dataset / Benchmark → Research Trend → Cockpit Relevance → Engineering Recommendation.

## Engineering Rules

- Prefer maintainable production-quality implementations.
- Use real research metadata. Never fabricate papers or statistics.
- Keep source metadata separate from generated research intelligence.
- Preserve data provenance.
- Use strict TypeScript.
- Keep provider integrations modular.
- Support incremental ingestion and deduplication.
- Run lint, typecheck, tests, and build after major changes.
- Do not use large amounts of temporary mock data.
- Do not stop after implementing only frontend pages.

## UI

The interface should be restrained, academic, professional, and information-dense.

Avoid:
- excessive gradients
- glow
- glassmorphism
- oversized rounded cards
- generic AI startup aesthetics

Prioritize desktop research workflows.

## Research Scope

Prioritize:
- VLM
- Video VLM
- Omni / native multimodal models
- multimodal fusion
- pretraining
- SFT / PEFT
- multimodal reasoning
- dataset construction
- knowledge distillation
- model compression
- on-device deployment
- world models
- multimodal agents

Special focus:
- intelligent cockpit
- driver / occupant understanding
- behavior / event understanding
- intention prediction
- multimodal interaction
- cockpit agents
- edge deployment