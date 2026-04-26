---
name: strict-tdd
description: Enforce red-green-refactor when tests exist, and strict verification for all behavior changes. Use when the user asks for TDD, tests first, or disciplined change.
---

# Strict TDD (this repo)

**Current gate:** `yarn verify` (eslint check + `next build`) — this repo may not have a `test` script; do not add Jest/Vitest/Playwright unless the user asks.

## When the project has automated tests

1. **Red** — smallest failing test for the new behavior.
2. **Green** — smallest implementation that passes.
3. **Refactor** — without changing behavior; re-run the targeted tests and **`yarn verify`**.

## When there are no tests for an area (common here)

- **Reproduce** the bug or new behavior with clear manual steps; after implementation, re-run those steps and **`yarn verify`**.
- For **UI** under `app/**`, use **chrome-devtools-verify** when DevTools MCP is available.

## Discipline

- Do not “fix” by deleting checks or silencing eslint without a scoped reason and follow-up.
- Prefer one behavior per change when possible.

## Finish

- Note what you ran: **`yarn verify`**, and any manual or MCP checks.
