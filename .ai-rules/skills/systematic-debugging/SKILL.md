---
name: systematic-debugging
description: Reproduce, narrow, and fix bugs methodically. Use for confusing failures, flaky UI, or build/lint errors that are not obvious.
---

# Systematic debugging

## Reproduce

- **Stable steps** — exact URL, clicks, input; note browser and viewport if UI.
- **One variable at a time** — branch, dependency install, cache (`.next` delete for strange Next issues).

## Narrow

- **Build/lint:** read the **first** error; often fixes cascade. `yarn verify` splits eslint vs Next build.
- **Runtime:** React DevTools, Network tab, server logs in the terminal running `yarn dev`.
- **Git:** `git bisect` when regression appeared across many commits.

## Fix and verify

- Smallest change that proves the cause; then `yarn verify`.
- For UI, **chrome-devtools-verify** when MCP is available.
- If you are stuck after two attempts, **summarize evidence** and escalate — do not thrash.

## This repo (no Fallow, no custom DB toolkit)

- Lint: `yarn lint` / `yarn lint:check`
- Build: `yarn build`
- Dev: `yarn dev` → [http://localhost:3000](http://localhost:3000) by default
