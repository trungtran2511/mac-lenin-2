<!--
Sync Impact Report
Version change: 1.1.0 -> 1.2.0
Modified principles:
- I. AI-Native Control Plane (Thay Nam AI): updated for KTCT-Easy
- II. Prompt Governance: updated for KTCT-Easy
- III. Data Source Discipline: updated for KTCT-Easy
- IV. Observable Static Frontend: updated (replaces modular monolith)
- V. API Key Rotation & Safety Gates: updated (replaces premium safety gates)
- Removed principle -> VI. Authentication Identity Integrity (auth is out of scope)
Templates requiring updates:
- .specify/templates/plan-template.md: ✅ updated
- .specify/templates/tasks-template.md: ✅ updated
Follow-up TODOs:
- None
-->
# KTCT-Easy Constitution

## Core Principles

### I. AI-Native Control Plane (Thay Nam AI)
The system uses Thầy Nam AI to guide and explain academic concepts in Marxist-Leninist Political Economy, quiz reviews, and career reflections. Prompt templates live under `src/lib/ai.ts` or helper classes. AI output must complement, not replace or override, local deterministic calculations.

Rationale: KTCT-Easy is an AI-enhanced learning platform. AI helps bridge complex academic theory with real-life scenarios, but calculations must remain deterministic and local.

### II. Prompt Governance
AI prompt templates and instruction parameters must be versioned, reviewed, and governed as code logic to prevent API leakage or incorrect educational guidance.

Rationale: AI prompts represent academic curriculum logic and need code ownership, versioning, and rigorous quality check.

### III. Data Source Discipline
Strict adherence to authenticated curriculum data. No economic data (e.g., province-level cost of living, minimum wages, inflation rates) should be hardcoded or fabricated unless backed by an official sourced dataset (documented with `sourceName`, `sourceUrl`, and `sourceDate`). Simulation values must be clearly labeled "ví dụ học tập" (teaching example) or "mock".

Rationale: Users must trust that economic facts presented are truthful, while learning simulation ranges are explicitly marked.

### IV. Observable Static Frontend
The app is a serverless static single-page web app (SPA) built with React + Vite + Tailwind CSS, run locally or on Vercel. All calculations (salary calculations, surplus value, rate of surplus value) are client-side, deterministic, and inspectable. Errors and API cooldown states (e.g., rate limit error 429) must be handled gracefully without crashing the UI.

Rationale: Educational tools need instant feedback, client-side auditability, and offline resilience.

### V. API Key Rotation & Safety Gates
To secure API usage without a backend database, client-side requests must use key rotation fallback (`VITE_GEMINI_API_KEY`, `VITE_GEMINI_API_KEY1`, `VITE_GEMINI_API_KEY2`). Under no circumstances should API keys be leaked in logs, network payloads, or UI. Safe client-side cooldown limits must prevent key exhaustion.

Rationale: Educational static apps have key limitations; fallback rotation ensures high availability while client-side safety guards avoid abuse.

## Development Workflow

- Create or claim work with `bd` before changing files.
- Read the active Spec Kit plan before implementation.
- Update specs before changing behavior.
- Add or update tests when code changes affect contracts, UI components, or AI boundaries.
- Run the relevant quality gate before closing work.
- Commit and push code and beads data before ending a session.

## Governance

This constitution supersedes conflicting project notes. Amendments MUST update this file, the Sync Impact Report, affected Spec Kit templates, and any runtime guidance files. Versioning follows semantic rules: MAJOR for incompatible principle changes, MINOR for new or materially expanded principles, and PATCH for clarification. Compliance MUST be checked during specification, planning, review, and release handoff.

**Version**: 1.2.0 | **Ratified**: 2026-06-28 | **Last Amended**: 2026-06-28
