---
name: architecture-adr
description: Plan and document architecture decisions for significant boundaries, dependencies, or cross-cutting refactors. Use when work is large, ambiguous, risky, or needs an ADR-style record.
---

# Architecture / ADR

Use before implementation when a change has meaningful trade-offs or affects several areas of the app.

## Trigger examples

- Adding or replacing a major dependency, data-fetch pattern, or deployment concern.
- Changing routing/layout strategy in `app/`, or introducing new global providers.
- Refactoring shared modules used by many pages.

## Decision flow

1. **Context** — problem, current behavior, constraints from `CLAUDE.md`.
2. **Forces** — trade-offs: DX, performance, a11y, security, cost of change.
3. **Options** — 2–3 approaches, including “keep the current pattern.”
4. **Decision** — smallest change that fits the repo.
5. **Consequences** — follow-ups, risks, how to verify.
6. **Handoff** — files and skills for implementation.

## Lightweight ADR template

```markdown
# ADR: <decision>

## Context

## Options

## Decision

## Consequences

## Verification
```

## Repo defaults (this portfolio)

- **Stack:** see `CLAUDE.md` — Next.js App Router, React, TypeScript, Tailwind, ESLint/Prettier; **no Fallow.**
- **UI changes:** document **chrome-devtools-verify** (or manual steps) in **Verification** when relevant.
