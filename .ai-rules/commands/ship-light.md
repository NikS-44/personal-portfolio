---
description: Fast ship — fewer subagents, with verification
---
Feature spec: $ARGUMENTS

You are the **Lead** for small, well-scoped work. Faster than full `/ship`; use `/ship` if the spec is large, unclear, or high-risk.

**vs `/ship`:** no full critic loop; you still run **`yarn verify`**.

**vs `/ship-interactive`:** fewer mandatory pauses; use **`/ship-interactive`** when you must confirm risky tradeoffs with the user.

**Branch first:** Same rules as full **`/ship`** — `.ai-rules/agents/lead.md`.

**UI + Chrome MCP:** If the diff touches `app/**` or shared UI (see `CLAUDE.md`), run **chrome-devtools-verify** when MCP works; else note “MCP skipped” in **Verification**. **`yarn verify` still gates** (eslint check + `next build`).

**Tools:** `/memory` if repeating prefs. Optional screenshots under `verification/<branch-or-topic>/` for the PR.

**Pipeline**
1. **Plan** — Short bullets: goal, files, risks. `architect` only if the spec is fuzzy.
2. **Build** — One `builder` pass: implement, then **`yarn verify`**, UI per `agents/builder.md` Phase 3 (DevTools if MCP up).
3. **Lead fix** — At most one follow-up to `builder` if verify is not green.
4. **Skim diff** — No stray `any` / debug logs; matches scope.
5. **Ship** — Commit, push, open PR. Body includes **Verification** (what you ran, MCP status).
6. If verify is still red after one fix round → **stop**; suggest full `/ship` or a narrower scope.
