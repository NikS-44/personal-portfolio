---
name: improve-codebase
description: Identify and implement scoped improvements using repo conventions, lint/build signals, and small reviewable batches. Use when users ask to improve, modernize, clean up, harden, simplify, or make the codebase more maintainable.
---

# Improve codebase (this repo)

## Principles

- **Default tools:** `yarn verify` (`lint:check` + `next build`) before claiming done; use `yarn lint` with fix when you are intentionally auto-fixing.
- **Scope:** one theme per batch (a11y pass, error handling, one route, one component tree).
- **Safety:** do not change behavior you cannot observe; for UI, prefer a quick **chrome-devtools-verify** when MCP is available.

## Workflow

1. **Pick a boundary** — e.g. one `app/` segment, one feature folder, or one class of issue from eslint.
2. **Baseline** — `yarn verify` green on the starting branch; note existing warnings you will touch.
3. **Change** — small steps; keep commits/PRs reviewable.
4. **Re-verify** — `yarn verify` after each meaningful chunk.
5. **PR text** — what changed, why, how you tested (see `CLAUDE.md` and **commit** skill).

## Avoid

- Drive-by renames across the whole tree without a spec
- New dependencies for tiny wins unless justified
- Disabling eslint rules repo-wide to silence noise
