---
name: tech-debt
description: Assess and plan technical debt cleanup using eslint, build output, search, and git history. Use when users mention tech debt, cleanup, dead code, complexity, duplication, refactoring priority, or code health.
---

# Tech debt (this repo)

This project does **not** use Fallow. Use what exists:

- **Lint:** `yarn lint` (with fix) or `yarn lint:check` (CI-style, no auto-fix) — violations and complexity hints from ESLint rules you have enabled.
- **Typecheck + bundle:** `yarn build` — Next.js surfaces TypeScript issues.
- **Search / review:** `git log`, `git blame`, and ripgrep for TODO/FIXME and duplicate patterns.
- **Dependencies:** `yarn outdated`, `yarn audit` — read changelogs before bumping.

## Process

1. State the **symptom** (bugs, slowness, fear of changing file X) and the **outcome** (stability, speed, clarity).
2. Gather evidence: lint output, build logs, recent diffs, and targeted file reads.
3. Prioritize: **risk × effort × user impact**; prefer small, reviewable steps.
4. Propose 1–3 concrete **batches** (PR-sized), each with a **verify** bar: `yarn verify` for code changes.
5. Before **deleting** code, confirm it is unused (search imports/references, run build).

## Anti-patterns

- “Rewrite everything” without a first small win
- Bumping many unrelated dependencies in one go without reading notes
- Suppressing eslint findings without a reason tied to a follow-up
